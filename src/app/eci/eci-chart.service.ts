// eci-chart.service.ts

import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UnifiedDataService } from '../service/chart-data-service';
import { 
  ECIRawDataItem, 
  ECIDataPoint, 
  ECILineData, 
  ECIChartConfig,
  ECIProvinceMapping,
  ECIChartStats
} from './eci-chart.models';

@Injectable({
  providedIn: 'root'
})
export class ECIChartService {

  private provinceMapping: ECIProvinceMapping = {
    'Alberta': 'AB',
    'British Columbia': 'BC',
    'Manitoba': 'MB',
    'New Brunswick': 'NB',
    'Newfoundland and Labrador': 'NL',
    'Northwest Territories': 'NT',
    'Nova Scotia': 'NS',
    'Nunavut': 'NU',
    'Ontario': 'ON',
    'Prince Edward Island': 'PE',
    'Quebec': 'QC',
    'Saskatchewan': 'SK',
    'Yukon': 'YT'
  };

  constructor(private unifiedDataService: UnifiedDataService) {}

  /**
   * Load ECI data from unified data service
   * This will fetch data for all available provinces
   */
  loadECIData(): Observable<ECIRawDataItem[]> {
    const availableRegions = this.unifiedDataService.getAvailableRegions();
    
    // Create requests for all regions
    const requests = availableRegions.map(region => 
      this.unifiedDataService.getRawData(region as any, { includeHistoricalData: true })
        .pipe(
          map(rawData => this.extractECIData(rawData, region)),
          catchError(error => {
            console.error(`Error loading ECI data for ${region}:`, error);
            return of([]); // Return empty array on error to continue with other regions
          })
        )
    );

    // Combine all results
    return forkJoin(requests).pipe(
      map(results => results.flat()) // Flatten array of arrays
    );
  }

  /**
   * Load ECI data for specific provinces only
   */
  loadECIDataForProvinces(provinces: string[]): Observable<ECIRawDataItem[]> {
    const requests = provinces.map(province => 
      this.unifiedDataService.getRawData(province as any, { includeHistoricalData: true })
        .pipe(
          map(rawData => this.extractECIData(rawData, province)),
          catchError(error => {
            console.error(`Error loading ECI data for ${province}:`, error);
            return of([]);
          })
        )
    );

    return forkJoin(requests).pipe(
      map(results => results.flat())
    );
  }

  /**
   * Extract ECI data from raw trade data
   */
  private extractECIData(rawData: any[], region: string): ECIRawDataItem[] {
    // Group by year and extract unique ECI values
    const yearlyECI = new Map<string, number>();
    
    rawData.forEach(item => {
      if (item.eci !== undefined && item.eci !== null && item.Date) {
        const year = new Date(item.Date).getFullYear().toString();
        
        // If we haven't seen this year yet, or if this is a more recent data point
        // (assuming later entries in the array are more recent)
        yearlyECI.set(year, item.eci);
      }
    });

    // Convert to ECIRawDataItem format
    return Array.from(yearlyECI.entries()).map(([year, eci]) => ({
      year,
      origin: region,
      eci
    }));
  }

  /**
   * Get ECI data from cache if available
   */
  getCachedECIData(): Observable<ECIRawDataItem[] | null> {
    const availableRegions = this.unifiedDataService.getAvailableRegions();
    const cachedData: ECIRawDataItem[] = [];
    let allCached = true;

    availableRegions.forEach(region => {
      const cached = this.unifiedDataService.getCachedData(region as any, true);
      if (cached) {
        cachedData.push(...this.extractECIData(cached, region));
      } else {
        allCached = false;
      }
    });

    return of(allCached ? cachedData : null);
  }

  /**
   * Transform raw data into line chart format
   */
  transformDataToLines(rawData: ECIRawDataItem[]): ECILineData[] {
    const groupedData: { [province: string]: ECIDataPoint[] } = {};

    // Group data by province
    rawData.forEach(item => {
      const province = item.origin;
      const year = parseInt(item.year.toString());
      const eci = parseFloat(item.eci.toString());

      if (!groupedData[province]) {
        groupedData[province] = [];
      }

      groupedData[province].push({
        year: year,
        eci: eci
      });
    });

    // Convert to line data format and sort by year
    const lineData: ECILineData[] = Object.keys(groupedData).map(province => ({
      name: province,
      values: groupedData[province].sort((a, b) => a.year - b.year)
    }));

    return lineData;
  }

  /**
   * Calculate chart statistics
   */
  calculateChartStats(lineData: ECILineData[]): ECIChartStats {
    let allYears: number[] = [];
    let allECIs: number[] = [];
    let totalDataPoints = 0;

    lineData.forEach(line => {
      line.values.forEach(point => {
        allYears.push(point.year);
        allECIs.push(point.eci);
        totalDataPoints++;
      });
    });

    return {
      provinceCount: lineData.length,
      yearRange: {
        min: Math.min(...allYears),
        max: Math.max(...allYears)
      },
      eciRange: {
        min: Math.min(...allECIs),
        max: Math.max(...allECIs)
      },
      dataPoints: totalDataPoints
    };
  }

  /**
   * Get province short name
   */
  getProvinceShortName(fullName: string): string {
    return this.provinceMapping[fullName] || fullName;
  }

  /**
   * Get all available provinces
   */
  getAvailableProvinces(lineData: ECILineData[]): string[] {
    return lineData.map(line => line.name);
  }

  /**
   * Filter data for specific provinces
   */
  filterProvinces(lineData: ECILineData[], selectedProvinces: string[]): ECILineData[] {
    return lineData.filter(line => selectedProvinces.includes(line.name));
  }

  /**
   * Get data for a specific year
   */
  getDataForYear(lineData: ECILineData[], targetYear: number): { province: string; eci: number }[] {
    const result: { province: string; eci: number }[] = [];

    lineData.forEach(line => {
      const yearData = line.values.find(point => point.year === targetYear);
      if (yearData) {
        result.push({
          province: line.name,
          eci: yearData.eci
        });
      }
    });

    return result.sort((a, b) => b.eci - a.eci); // Sort by ECI descending
  }

  /**
   * Find closest data point to mouse position
   */
  findClosestDataPoint(
    lineData: ECILineData[], 
    targetYear: number, 
    targetProvince?: string
  ): { province: string; year: number; eci: number } | null {
    
    if (targetProvince) {
      const line = lineData.find(l => l.name === targetProvince);
      if (line) {
        const closestPoint = line.values.reduce((prev, curr) => 
          Math.abs(curr.year - targetYear) < Math.abs(prev.year - targetYear) ? curr : prev
        );
        return {
          province: targetProvince,
          year: closestPoint.year,
          eci: closestPoint.eci
        };
      }
    }

    // Find closest across all provinces
    let closest: { province: string; year: number; eci: number } | null = null;
    let minDistance = Infinity;

    lineData.forEach(line => {
      line.values.forEach(point => {
        const distance = Math.abs(point.year - targetYear);
        if (distance < minDistance) {
          minDistance = distance;
          closest = {
            province: line.name,
            year: point.year,
            eci: point.eci
          };
        }
      });
    });

    return closest;
  }

  /**
   * Abbreviate numbers for display
   */
  abbreviateNumber(number: number): string {
    const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];
    
    // what tier? (determines SI symbol)
    const tier = Math.log10(Math.abs(number)) / 3 | 0;

    // if zero, we don't need a suffix
    if (tier === 0) return number.toString();

    // get suffix and determine scale
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);

    // scale the number
    const scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
  }

  /**
   * Export data to CSV format
   */
  exportToCSV(lineData: ECILineData[]): string {
    const headers = ['Province', 'Year', 'ECI'];
    const rows: string[] = [headers.join(',')];

    lineData.forEach(line => {
      line.values.forEach(point => {
        rows.push(`${line.name},${point.year},${point.eci}`);
      });
    });

    return rows.join('\n');
  }

  /**
   * Validate ECI data format
   */
  validateData(data: ECIRawDataItem[]): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    return data.every(item => {
      return (
        item.hasOwnProperty('year') &&
        item.hasOwnProperty('origin') &&
        item.hasOwnProperty('eci') &&
        !isNaN(parseInt(item.year.toString())) &&
        !isNaN(parseFloat(item.eci.toString())) &&
        typeof item.origin === 'string'
      );
    });
  }

  /**
   * Get trending direction for a province
   */
  getTrendDirection(lineData: ECILineData[], provinceName: string): 'up' | 'down' | 'stable' {
    const line = lineData.find(l => l.name === provinceName);
    if (!line || line.values.length < 2) return 'stable';

    const values = line.values;
    const firstValue = values[0].eci;
    const lastValue = values[values.length - 1].eci;
    const difference = lastValue - firstValue;

    if (Math.abs(difference) < 0.1) return 'stable';
    return difference > 0 ? 'up' : 'down';
  }

  /**
   * Calculate average ECI for a province
   */
  getAverageECI(lineData: ECILineData[], provinceName: string): number {
    const line = lineData.find(l => l.name === provinceName);
    if (!line || line.values.length === 0) return 0;

    const sum = line.values.reduce((acc, point) => acc + point.eci, 0);
    return sum / line.values.length;
  }

  /**
   * Get year-over-year growth rate
   */
  getYearOverYearGrowth(lineData: ECILineData[], provinceName: string): number[] {
    const line = lineData.find(l => l.name === provinceName);
    if (!line || line.values.length < 2) return [];

    const growthRates: number[] = [];
    for (let i = 1; i < line.values.length; i++) {
      const previousYear = line.values[i - 1];
      const currentYear = line.values[i];
      const growthRate = ((currentYear.eci - previousYear.eci) / Math.abs(previousYear.eci)) * 100;
      growthRates.push(growthRate);
    }

    return growthRates;
  }

  /**
   * Get latest available year from data
   */
  getLatestYear(lineData: ECILineData[]): number {
    let maxYear = 0;
    lineData.forEach(line => {
      line.values.forEach(point => {
        if (point.year > maxYear) {
          maxYear = point.year;
        }
      });
    });
    return maxYear;
  }

  /**
   * Refresh ECI data for a specific province
   */
  refreshProvinceData(province: string): Observable<ECIRawDataItem[]> {
    return this.unifiedDataService.getRawData(province as any, { includeHistoricalData: true })
      .pipe(
        map(rawData => this.extractECIData(rawData, province))
      );
  }
}