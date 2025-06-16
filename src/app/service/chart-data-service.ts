// fixed-unified-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin } from 'rxjs';
import { map, tap, shareReplay, catchError } from 'rxjs/operators';

// Interfaces for the unified service
export interface RawTradeData {
  Date: string;
  product: number;
  Value: number;
  naics?: number;
  naics_description?: string;
  pci?: number;
  distance?: number;
  rca?: number;
  eci?: number;
  cluster_name?: string;
  // Add other properties as needed
}

export interface ProcessedDataCache {
  rawData: RawTradeData[];
  unfilteredRawData: RawTradeData[]; // Store unfiltered data for overtime charts
  lastUpdated: Date;
  region: string;
}

export interface HSDescription {
  HS4: string;
  'HS4 Short Name': string;
}

export interface DataFetchOptions {
  includeHistoricalData?: boolean; // For overtime charts that need all years
  filterThresholdDate?: Date; // Custom threshold date
  skipDateFiltering?: boolean; // Completely skip date filtering
}

@Injectable({
  providedIn: 'root'
})
export class UnifiedDataService {
  
  // API endpoints for different provinces
  private readonly apiMap = {
    'Alberta': 'https://api.economicdata.alberta.ca/api/data?code=e786bd96-d36d-4933-b36b-8e5d1cfd549b',
    'British Columbia': 'https://api.economicdata.alberta.ca/api/data?code=e6429f6a-0a6d-4475-a3f1-400a5fa1e0b3',
    'Manitoba': 'https://api.economicdata.alberta.ca/api/data?code=dcb00881-bd06-4cd3-8f89-1dd182867aa7',
    'New Brunswick': 'https://api.economicdata.alberta.ca/api/data?code=f547346c-2ff5-48f8-b94b-2d896607a27f',
    'Newfoundland and Labrador': 'https://api.economicdata.alberta.ca/api/data?code=52332753-d386-42bc-aab9-0a2b6f33cec7',
    'Nova Scotia': 'https://api.economicdata.alberta.ca/api/data?code=14323f81-095b-4ca6-bfd7-88c96802b347',
    'Ontario': 'https://api.economicdata.alberta.ca/api/data?code=b36d2876-996c-4afc-a388-e743c215cd0d',
    'Prince Edward Island': 'https://api.economicdata.alberta.ca/api/data?code=c7f40018-09f6-4372-828b-135bce1a7a6a',
    'Quebec': 'https://api.economicdata.alberta.ca/api/data?code=412697ba-64c3-4263-ad33-240b7b451517',
    'Saskatchewan': 'https://api.economicdata.alberta.ca/api/data?code=96b8107d-c8dd-4315-bb83-cca5a220f2f5'
  };

  // Cache for storing processed data by region
  private dataCache = new Map<string, ProcessedDataCache>();
  
  // Cache expiry time (in milliseconds) - 1 hour
  private readonly CACHE_EXPIRY = 60 * 60 * 1000;
  
  // Threshold date for filtering recent data (for product space and ECI charts)
  private readonly thresholdDate = new Date("2021-01-01T00:00:00");
  
  // HS descriptions
  private hsDescriptions: HSDescription[] = [
    { HS4: "8518", "HS4 Short Name": "Electronic Equipment" },
    { HS4: "8535", "HS4 Short Name": "Electrical Machinery" },
    // Add your actual HS descriptions here
  ];

  // Observable subjects for reactive data
  private currentRegionSubject = new BehaviorSubject<string>('Alberta');
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public currentRegion$ = this.currentRegionSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Set HS descriptions for data processing
   */
  setHSDescriptions(descriptions: HSDescription[]): void {
    this.hsDescriptions = descriptions;
  }

  /**
   * Set current region and trigger data loading if needed
   */
  setCurrentRegion(region: keyof typeof this.apiMap): Observable<RawTradeData[]> {
    this.currentRegionSubject.next(region);
    return this.getRawData(region);
  }

  /**
   * Get current region
   */
  getCurrentRegion(): string {
    return this.currentRegionSubject.value;
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(cache: ProcessedDataCache): boolean {
    const now = new Date();
    return (now.getTime() - cache.lastUpdated.getTime()) < this.CACHE_EXPIRY;
  }

  /**
   * Fetch raw data from API with caching (with date filtering for recent data)
   */
  getRawData(region: keyof typeof this.apiMap, options?: DataFetchOptions): Observable<RawTradeData[]> {
    // Check cache first
    const cached = this.dataCache.get(region);
    if (cached && this.isCacheValid(cached)) {
      // Return appropriate data based on options
      if (options?.includeHistoricalData || options?.skipDateFiltering) {
        return of(cached.unfilteredRawData);
      } else {
        return of(cached.rawData);
      }
    }

    // Set loading state
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    // Fetch from API
    return this.http.get<RawTradeData[]>(this.apiMap[region]).pipe(
      map(data => {
        console.log(`📋 Fetched ${data.length} total records from API for ${region}`);
        
        // Store unfiltered data
        const unfilteredData = data;
        
        // Apply filtering based on options
        let filteredData: RawTradeData[];
        
        if (options?.skipDateFiltering) {
          filteredData = unfilteredData;
        } else if (options?.includeHistoricalData) {
          filteredData = unfilteredData;
        } else if (options?.filterThresholdDate) {
          filteredData = this.filterDataByDate(unfilteredData, options.filterThresholdDate);
        } else {
          filteredData = this.filterRecentData(unfilteredData);
        }

        const years = [...new Set(unfilteredData.map(d => new Date(d.Date).getFullYear()))].sort();
        const filteredYears = [...new Set(filteredData.map(d => new Date(d.Date).getFullYear()))].sort();
        
        // Cache both filtered and unfiltered data
        this.dataCache.set(region, {
          rawData: filteredData,
          unfilteredRawData: unfilteredData,
          lastUpdated: new Date(),
          region
        });
        
        this.loadingSubject.next(false);
        
        // Return appropriate data based on options
        return (options?.includeHistoricalData || options?.skipDateFiltering) ? unfilteredData : filteredData;
      }),
      catchError(error => {
        this.errorSubject.next(`Failed to fetch data for ${region}: ${error.message}`);
        this.loadingSubject.next(false);
        throw error;
      }),
      shareReplay(1)
    );
  }

  /**
   * Get cached data for a region (synchronous)
   */
  getCachedData(region: keyof typeof this.apiMap, includeHistorical: boolean = false): RawTradeData[] | null {
    const cached = this.dataCache.get(region);
    if (!cached || !this.isCacheValid(cached)) {
      return null;
    }
    
    return includeHistorical ? cached.unfilteredRawData : cached.rawData;
  }

  /**
   * Filter data to only include records after threshold date
   */
  private filterRecentData(data: RawTradeData[]): RawTradeData[] {
    return this.filterDataByDate(data, this.thresholdDate);
  }

  /**
   * Filter data by custom date
   */
  private filterDataByDate(data: RawTradeData[], thresholdDate: Date): RawTradeData[] {
    return data.filter(item => {
      const itemDate = new Date(item.Date);
      return itemDate > thresholdDate;
    });
  }

  /**
   * Get most recent year from data
   */
  private getMostRecentYear(data: RawTradeData[]): number {
    const years = data.map(d => new Date(d.Date).getFullYear());
    return Math.max(...years);
  }

  /**
   * Filter data to most recent year only
   */
  private filterToMostRecentYear(data: RawTradeData[]): RawTradeData[] {
    const mostRecentYear = this.getMostRecentYear(data);
    return data.filter(item => {
      const itemYear = new Date(item.Date).getFullYear();
      return itemYear === mostRecentYear;
    });
  }

  /**
   * Get processed data for Product Space Chart (uses recent data only)
   */
  getProductSpaceData(region: keyof typeof this.apiMap): Observable<{
    groupedData: any[];
    totalSum: number;
  }> {
    return this.getRawData(region, { includeHistoricalData: false }).pipe(
      map(rawData => {
        const processedData = rawData.map(d => {
          let description = this.hsDescriptions.find(x => x.HS4 === d.product.toString())?.['HS4 Short Name'] || 'Unknown';
          return {
            ...d,
            description,
            prio: 0
          };
        });

        const totalSum = processedData.reduce((acc, curr) => {
          return acc + (typeof curr.Value === "number" ? curr.Value : 0);
        }, 0);

        return {
          groupedData: processedData,
          totalSum
        };
      })
    );
  }

  /**
   * Get processed data for Feasible Chart (uses recent data only)
   */
  getFeasibleChartData(region: keyof typeof this.apiMap): Observable<{
    feasibleData: any[];
    rawData: RawTradeData[];
    eci: number;
    bounds: any;
  }> {
    return this.getRawData(region, { includeHistoricalData: false }).pipe(
      map(rawData => {
        // Process data similar to your feasible chart service
        const modifiedData = rawData.map(obj => {
          const hs2 = Math.floor(obj.product / 100);
          const naics2 = obj.naics ? Math.floor(obj.naics / 10) : 0;
          const hs4 = obj.product;

          return {
            hs2,
            hs4,
            naics2,
            state: 0,
            ...obj
          };
        });

        // Calculate bounds
        const distances = modifiedData.map(d => d.distance || 0);
        const pcis = modifiedData.map(d => d.pci || 0);
        
        const bounds = {
          minDistance: Math.min(...distances),
          maxDistance: Math.max(...distances),
          minPci: Math.min(...pcis),
          maxPci: Math.max(...pcis),
          centerX: (Math.min(...distances) + Math.max(...distances)) / 2,
          centerY: (Math.min(...pcis) + Math.max(...pcis)) / 2
        };

        return {
          feasibleData: modifiedData,
          rawData,
          eci: rawData.length > 0 ? rawData[0].eci || 0 : 0,
          bounds
        };
      })
    );
  }

  /**
   * Get processed data for Treemap Chart (uses most recent year only)
   */
  getTreemapData(region: keyof typeof this.apiMap): Observable<{
    rawData: RawTradeData[];
    totalValue: number;
    mostRecentYear: number;
    naicsCount: number;
  }> {
    console.log(`🌳 Getting treemap data for ${region} (most recent year only)`);
    
    return this.getRawData(region, { includeHistoricalData: false }).pipe(
      map(recentData => {
        // Filter to most recent year only
        const mostRecentYearData = this.filterToMostRecentYear(recentData);
        const mostRecentYear = this.getMostRecentYear(recentData);
        
        // Filter out items without NAICS data (required for treemap)
        const validTreemapData = mostRecentYearData.filter(item => 
          item.naics && 
          item.naics_description && 
          item.Value !== undefined && 
          item.Value !== null && 
          item.Value > 0  // Only include items with positive values
        );

        // Calculate total value
        const totalValue = validTreemapData.reduce((sum, item) => sum + (Number(item.Value) || 0), 0);
        
        // Count unique NAICS codes
        const uniqueNaics = new Set(validTreemapData.map(item => item.naics));
        const naicsCount = uniqueNaics.size;

        console.log(`🌳 Treemap data processed: ${validTreemapData.length} items, ${naicsCount} NAICS categories, year ${mostRecentYear}`);

        return {
          rawData: validTreemapData,
          totalValue,
          mostRecentYear,
          naicsCount
        };
      })
    );
  }

  /**
   * Get processed data for Overtime Chart (uses ALL historical data)
   */
  getOvertimeChartData(region: keyof typeof this.apiMap): Observable<{
    groupedByYear: any[];
    chartData: any[];
    rawData: RawTradeData[];
  }> {
    console.log(`🕐 Getting overtime chart data for ${region} with historical data`);
    
    return this.getRawData(region, { includeHistoricalData: true }).pipe(
      map(rawData => {
        
        const years = [...new Set(rawData.map(d => new Date(d.Date).getFullYear()))].sort();

        // Group by year and category (similar to your overtime service)
        const groupedByYear = this.groupByYearAndCategory(rawData);
        const chartData = this.transformDataByDate(groupedByYear);

        return {
          groupedByYear,
          chartData,
          rawData
        };
      })
    );
  }

  /**
   * Helper method: Group data by year and category based on HS2 codes
   */
  private groupByYearAndCategory(data: RawTradeData[]): any[] {
    const iconMapping = {
      "Animal & Food Products": { min: 1, max: 24 },
      "Minerals": { min: 25, max: 27 },
      "Chemicals & Plastics": { min: 28, max: 40 },
      "Raw Materials": { min: 41, max: 49 },
      "Textiles": { min: 50, max: 63 },
      "Footwear & Accessories": { min: 64, max: 67 },
      "Stone & Glass": { min: 68, max: 71 },
      "Metals": { min: 72, max: 83 },
      "Machinery & Electronics": { min: 84, max: 85 },
      "Transportation": { min: 86, max: 89 },
      "Miscellaneous": { min: 90, max: 97 }
    };

    return data.reduce((accumulator: { Date: number; Category: string; TotalValue: number }[], item) => {
      const year = new Date(item.Date).getFullYear();
      const hs2 = parseInt(item.product.toString().substring(0, 2));
      let category = "Unknown category";

      // Find the category using the icon mapping
      for (const [categoryName, range] of Object.entries(iconMapping)) {
        if (hs2 >= range.min && hs2 <= range.max) {
          category = categoryName;
          break;
        }
      }

      // Locate or create the category entry for the year
      let entry = accumulator.find(e => e.Date === year && e.Category === category);
      if (!entry) {
        entry = { Date: year, Category: category, TotalValue: 0 };
        accumulator.push(entry);
      }

      entry!.TotalValue += item.Value;
      return accumulator;
    }, []);
  }

  /**
   * Helper method: Transform grouped data by date into chart-ready format
   */
  private transformDataByDate(data: any[]): any[] {
    const result: { [key: number]: any } = {};
    const categories = ["Animal & Food Products", "Minerals", "Chemicals & Plastics", 
                      "Raw Materials", "Textiles", "Footwear & Accessories", 
                      "Stone & Glass", "Metals", "Machinery & Electronics", 
                      "Transportation", "Miscellaneous"];

    data.forEach(item => {
      if (!result[item.Date]) {
        result[item.Date] = { Date: item.Date };
        categories.forEach(cat => {
          result[item.Date][cat] = 0;
        });
      }
      result[item.Date][item.Category] = item.TotalValue;
    });

    return Object.values(result);
  }

  /**
   * Find data by product ID
   */
  findDataByProduct(data: RawTradeData[], productId: string): RawTradeData | undefined {
    return data.find(item => item.product.toString() === productId);
  }

  /**
   * Calculate total sum of values
   */
  calculateTotalSum(data: RawTradeData[]): number {
    return data.reduce((acc, item) => acc + (typeof item.Value === "number" ? item.Value : 0), 0);
  }

  /**
   * Get all available regions
   */
  getAvailableRegions(): string[] {
    return Object.keys(this.apiMap);
  }

  /**
   * Clear cache for a specific region or all regions
   */
  clearCache(region?: keyof typeof this.apiMap): void {
    if (region) {
      this.dataCache.delete(region);
      console.log(`🗑️ Cache cleared for ${region}`);
    } else {
      this.dataCache.clear();
      console.log(`🗑️ All cache cleared`);
    }
  }

  /**
   * Preload data for multiple regions
   */
  preloadRegions(regions: (keyof typeof this.apiMap)[], includeHistorical: boolean = false): Observable<any> {
    const requests = regions.map(region => 
      this.getRawData(region, { includeHistoricalData: includeHistorical })
    );
    return forkJoin(requests);
  }

  /**
   * Get cache status for all regions
   */
  getCacheStatus(): { region: string; cached: boolean; lastUpdated?: Date; recordCount?: number; historicalRecordCount?: number }[] {
    return Object.keys(this.apiMap).map(region => {
      const cached = this.dataCache.get(region);
      return {
        region,
        cached: cached ? this.isCacheValid(cached) : false,
        lastUpdated: cached?.lastUpdated,
        recordCount: cached?.rawData?.length,
        historicalRecordCount: cached?.unfilteredRawData?.length
      };
    });
  }
}