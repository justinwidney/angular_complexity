// eci-chart.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  constructor() {}

  /**
   * Load ECI data from API or CSV
   */
  loadECIData(): Observable<ECIRawDataItem[]> {
    // TODO: Replace with actual HTTP call
    // return this.http.get<ECIRawDataItem[]>('/api/eci-data');
    
    // For now, return sample data
    return of(this.generateSampleData());
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
   * Generate sample data for testing
   */
  private generateSampleData(): ECIRawDataItem[] {
    const provinces = ['Alberta', 'British Columbia', 'Ontario', 'Quebec', 'Saskatchewan'];
    const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    const data: ECIRawDataItem[] = [];

    provinces.forEach(province => {
      let baseECI = Math.random() * 2 - 1; // Random starting ECI between -1 and 1
      
      years.forEach((year, index) => {
        // Add some year-over-year variation
        const variation = (Math.random() - 0.5) * 0.3;
        baseECI += variation;
        
        // Keep ECI within reasonable bounds
        baseECI = Math.max(-2, Math.min(2, baseECI));

        data.push({
          year: year.toString(),
          origin: province,
          eci: parseFloat(baseECI.toFixed(4))
        });
      });
    });

    return data;
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
}