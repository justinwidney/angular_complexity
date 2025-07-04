// enhanced-unified-data.service.ts - FIXED VERSION

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin, combineLatest } from 'rxjs';
import { map, tap, shareReplay, catchError, switchMap, distinctUntilChanged } from 'rxjs/operators';
import * as d3 from 'd3';

// Interfaces remain the same
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
}

export interface ProcessedDataCache {
  rawData: RawTradeData[];
  unfilteredRawData: RawTradeData[];
  lastUpdated: Date;
  region: string;
  year?: string;
  isHistoricalData?: boolean; // NEW: Flag to identify historical data cache
}

export interface HSDescription {
  HS4: string;
  'HS4 Short Name': string;
  'HS4 Description': string;
}

export interface DataFetchOptions {
  includeHistoricalData?: boolean;
  filterThresholdDate?: Date;
  skipDateFiltering?: boolean;
  filterByYear?: string;
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
    'Saskatchewan': 'https://api.economicdata.alberta.ca/api/data?code=96b8107d-c8dd-4315-bb83-cca5a220f2f5',
    'Canada': 'https://api.economicdata.alberta.ca/api/data?code=canada-data-code'
  };

  // Cache with region+year key
  private dataCache = new Map<string, ProcessedDataCache>();
  
  // Cache expiry time (in milliseconds) - 1 hour
  private readonly CACHE_EXPIRY = 60 * 60 * 1000;

  // HS descriptions
  private hsDescriptions: HSDescription[] = [];

  // Observable subjects for reactive data
  private currentRegionSubject = new BehaviorSubject<string>('Alberta');
  private currentYearSubject = new BehaviorSubject<string>('2023');
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public currentRegion$ = this.currentRegionSubject.asObservable();
  public currentYear$ = this.currentYearSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  // Combined observable for region and year changes
  public currentSelection$ = combineLatest([
    this.currentRegion$.pipe(distinctUntilChanged()),
    this.currentYear$.pipe(distinctUntilChanged())
  ]).pipe(
    map(([region, year]) => ({ region, year }))
  );

  constructor(private http: HttpClient) {
  }

 
  setHSDescriptions(descriptions: HSDescription[]): void {
    this.hsDescriptions = descriptions;
  }

  getHSDescriptions(): HSDescription[] {
    return this.hsDescriptions; 
  }


  setCurrentRegion(region: keyof typeof this.apiMap): void {
    this.currentRegionSubject.next(region);
  }


  setCurrentYear(year: string): void {
    this.currentYearSubject.next(year);
  }


  getCurrentRegion(): string {
    return this.currentRegionSubject.value;
  }


  getCurrentYear(): string {
    return this.currentYearSubject.value;
  }


  private getCacheKey(region: string, year?: string, isHistorical: boolean = false): string {
    if (isHistorical) {
      return `${region}-ALL_YEARS`; // Special key for historical data
    }
    return year ? `${region}-${year}` : region;
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(cache: ProcessedDataCache): boolean {
    const now = new Date();
    return (now.getTime() - cache.lastUpdated.getTime()) < this.CACHE_EXPIRY;
  }

  /**
   * Fetch raw data from API with caching and year filtering
   * FIXED: Now properly handles historical vs year-specific caching
   */
  getRawData(region: keyof typeof this.apiMap, options?: DataFetchOptions): Observable<RawTradeData[]> {
    const year = options?.filterByYear || this.getCurrentYear();
    const isHistorical = options?.includeHistoricalData || options?.skipDateFiltering;
    const cacheKey = this.getCacheKey(region, year, isHistorical);
    
    // Check cache first
    const cached = this.dataCache.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      if (options?.includeHistoricalData || options?.skipDateFiltering) {
        return of(cached.unfilteredRawData);
      } else {
        return of(cached.rawData);
      }
    }

    // Check if we can derive year-specific data from historical cache
    if (!isHistorical && year) {
      const historicalCacheKey = this.getCacheKey(region, undefined, true);
      const historicalCache = this.dataCache.get(historicalCacheKey);
      
      if (historicalCache && this.isCacheValid(historicalCache)) {
        const yearFilteredData = this.filterDataByYear(historicalCache.unfilteredRawData, year);
        
        // Cache the derived year-specific data
        this.dataCache.set(cacheKey, {
          rawData: yearFilteredData,
          unfilteredRawData: yearFilteredData,
          lastUpdated: new Date(),
          region,
          year,
          isHistoricalData: false
        });
        
        return of(yearFilteredData);
      }
    }

    // Set loading state
    this.loadingSubject.next(true);
    this.errorSubject.next(null);


    // Fetch from API
    return this.http.get<RawTradeData[]>(this.apiMap[region]).pipe(
      map(data => {
        
        // Store unfiltered data (always all years from API)
        let unfilteredData = data;
        let filteredData: RawTradeData[];
        
        if (options?.includeHistoricalData || options?.skipDateFiltering) {
          filteredData = unfilteredData;
        } else if (options?.filterByYear) {
          filteredData = this.filterDataByYear(unfilteredData, options.filterByYear);
        } else if (options?.filterThresholdDate) {
          filteredData = this.filterDataByDate(unfilteredData, options.filterThresholdDate);
        } else {
          filteredData = this.filterDataByYear(unfilteredData, year);
        }

        // Cache the data appropriately
        this.dataCache.set(cacheKey, {
          rawData: filteredData,
          unfilteredRawData: unfilteredData, // Always store full dataset
          lastUpdated: new Date(),
          region,
          year: isHistorical ? undefined : year,
          isHistoricalData: isHistorical
        });

        // If this was a historical data fetch, also cache all individual years
        if (isHistorical) {
          this.cacheIndividualYears(region, unfilteredData);
        }
        
        this.loadingSubject.next(false);
        
        // Return appropriate data based on options
        return filteredData;
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
   * Cache individual years from historical data
   * This optimizes future year-specific requests
   */
  private cacheIndividualYears(region: string, allData: RawTradeData[]): void {
    const years = [...new Set(allData.map(d => new Date(d.Date).getFullYear().toString()))];
    
    years.forEach(year => {
      const yearCacheKey = this.getCacheKey(region, year, false);
      
      // Only cache if not already cached
      if (!this.dataCache.has(yearCacheKey)) {
        const yearData = this.filterDataByYear(allData, year);
        
        this.dataCache.set(yearCacheKey, {
          rawData: yearData,
          unfilteredRawData: yearData,
          lastUpdated: new Date(),
          region,
          year,
          isHistoricalData: false
        });
      }
    });
    
  }

  /**
   * Filter data by year
   */
  private filterDataByYear(data: RawTradeData[], year: string): RawTradeData[] {
    return data.filter(item => {
      const itemYear = new Date(item.Date).getFullYear().toString();
      return itemYear === year;
    });
  }

  /**
   * Get data for current region and year selections
   */
  getCurrentSelectionData(options?: Omit<DataFetchOptions, 'filterByYear'>): Observable<RawTradeData[]> {
    const region = this.getCurrentRegion();
    const year = this.getCurrentYear();
    
    return this.getRawData(region as any, {
      ...options,
      filterByYear: year
    });
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
   * Get processed data for Product Space Chart (uses current year)
   */
  getProductSpaceData(region?: keyof typeof this.apiMap): Observable<{
    groupedData: any[];
    totalSum: number;
    year: string;
  }> {
    const targetRegion = region || this.getCurrentRegion() as keyof typeof this.apiMap;
    const year = this.getCurrentYear();
    
    return this.getRawData(targetRegion, { filterByYear: year }).pipe(
      map(rawData => {
        const processedData = rawData.map(d => {
          let description = this.hsDescriptions.find(x => Number(x.HS4) === d.product)?.['HS4 Short Name'] || 'Unknown';
          return {
            ...d,
            description,
            prio: 0
          };
        });

        const totalSum = processedData.reduce((acc, curr) => {
          return acc + (typeof curr.Value === "number" ? curr.Value : Number(curr.Value));
        }, 0);

        return {
          groupedData: processedData,
          totalSum,
          year
        };
      })
    );
  }

  /**
   * Get processed data for Feasible Chart (uses current year)
   */
  getFeasibleChartData(region?: keyof typeof this.apiMap): Observable<{
    feasibleData: any[];
    rawData: RawTradeData[];
    eci: number;
    bounds: any;
    year: string;
  }> {
    const targetRegion = region || this.getCurrentRegion() as keyof typeof this.apiMap;
    const year = this.getCurrentYear();

    return this.getRawData(targetRegion, { filterByYear: year }).pipe(
      map(rawData => {
        console.log('Raw data for Feasible Chart:', rawData);

        // Process data similar to your feasible chart service
        const modifiedData = rawData.map(obj => {
          let description = this.hsDescriptions.find(x => Number(x.HS4) === obj.product)?.['HS4 Short Name'] || 'Unknown';
          const hs2 = Math.floor(obj.product / 100);
          const naics2 = obj.naics ? Math.floor(obj.naics / 10) : 0;
          const hs4 = obj.product;

          return {
            hs2,
            description,
            hs4,
            naics2,
            state: 0,
            ...obj
          };
        });

        const lowerPercentile = 1;   // 5th percentile
        const upperPercentile =  99;  // 95th percentile
        
        const distances = modifiedData.map(d => d.distance).filter(d => d !== undefined).sort((a, b) => a - b);
        const pcis = modifiedData.map(d => d.pci).filter(pci => pci !== undefined).sort((a, b) => a - b);
        
        
          
        
        const minDistance = d3.quantile(distances, lowerPercentile / 100) || distances[0];
        const maxDistance = d3.quantile(distances, upperPercentile / 100) || distances[distances.length - 1];
        const minPci = d3.quantile(pcis, lowerPercentile / 100) || pcis[0];
        const maxPci = d3.quantile(pcis, upperPercentile / 100) || pcis[pcis.length - 1];
        
        const centerX = (minDistance + maxDistance) / 2;
        const centerY = (minPci + maxPci) / 2;
        
        const bounds = {
          minDistance: minDistance,
          maxDistance: maxDistance,
          minPci: minPci,
          maxPci: maxPci,
          centerX: centerX,
          centerY: centerY
        };

        return {
          feasibleData: modifiedData,
          rawData,
          eci: rawData.length > 0 ? rawData[0].eci || 0 : 0,
          bounds,
          year
        };
      })
    );
  }

  /**
   * Get processed data for Treemap Chart (uses current year)
   */
  getTreemapData(region?: keyof typeof this.apiMap): Observable<{
    rawData: RawTradeData[];
    totalValue: number;
    year: string;
    naicsCount: number;
  }> {
    const targetRegion = region || this.getCurrentRegion() as keyof typeof this.apiMap;
    const year = this.getCurrentYear();
    
    return this.getRawData(targetRegion, { filterByYear: year }).pipe(
      map(yearData => {
        // Filter out items without NAICS data
        const validTreemapData = yearData.filter(item => 
          item.naics && 
          item.naics_description && 
          item.Value !== undefined && 
          item.Value !== null && 
          item.Value > 0
        );

        // Calculate total value
        const totalValue = validTreemapData.reduce((sum, item) => sum + (Number(item.Value) || 0), 0);
        
        // Count unique NAICS codes
        const uniqueNaics = new Set(validTreemapData.map(item => item.naics));
        const naicsCount = uniqueNaics.size;

        return {
          rawData: validTreemapData,
          totalValue,
          year,
          naicsCount
        };
      })
    );
  }

  /**
   * Get processed data for Overtime Chart (shows ALL years for current region)
   * FIXED: Now uses dedicated historical data caching
   */
  getOvertimeChartData(region?: keyof typeof this.apiMap): Observable<{
    groupedByYear: any[];
    chartData: any[];
    rawData: RawTradeData[];
    region: string;
  }> {

    const targetRegion = region || this.getCurrentRegion() as keyof typeof this.apiMap;
    
    
    return this.getRawData(targetRegion, { includeHistoricalData: true }).pipe(
      map(rawData => {
        const years = [...new Set(rawData.map(d => new Date(d.Date).getFullYear()))].sort();

        // Group by year and category
        const groupedByYear = this.groupByYearAndCategory(rawData);
        const chartData = this.transformDataByDate(groupedByYear);

        return {
          groupedByYear,
          chartData,
          rawData,
          region: targetRegion
        };
      })
    );
  }

  /**
   * Get available years for a specific region
   */
  getAvailableYears(region?: keyof typeof this.apiMap): Observable<string[]> {
    const targetRegion = region || this.getCurrentRegion() as keyof typeof this.apiMap;
    
    return this.getRawData(targetRegion, { includeHistoricalData: true }).pipe(
      map(data => {
        const years = [...new Set(data.map(d => new Date(d.Date).getFullYear().toString()))];
        return years.sort().reverse(); // Most recent first
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
   * Clear cache for a specific region or all regions
   * FIXED: Now handles both historical and year-specific cache keys
   */
  clearCache(region?: keyof typeof this.apiMap, year?: string): void {
    if (region) {
      if (year) {
        // Clear specific year cache
        const yearCacheKey = this.getCacheKey(region, year, false);
        this.dataCache.delete(yearCacheKey);
        console.log(`🗑️ Cache cleared for ${region} (${year})`);
      } else {
        // Clear all caches for this region (both historical and year-specific)
        Array.from(this.dataCache.keys())
          .filter(key => key.startsWith(region))
          .forEach(key => this.dataCache.delete(key));
        console.log(`🗑️ All cache cleared for ${region}`);
      }
    } else {
      this.dataCache.clear();
      console.log(`🗑️ All cache cleared`);
    }
  }

  /**
   * Get cache status for all regions and years
   */
  getCacheStatus(): { region: string; year?: string; cached: boolean; lastUpdated?: Date; recordCount?: number; isHistorical?: boolean }[] {
    const status: { region: string; year?: string; cached: boolean; lastUpdated?: Date; recordCount?: number; isHistorical?: boolean }[] = [];
    
    this.dataCache.forEach((cache, key) => {
      status.push({
        region: cache.region,
        year: cache.year,
        cached: this.isCacheValid(cache),
        lastUpdated: cache.lastUpdated,
        recordCount: cache.rawData?.length,
        isHistorical: cache.isHistoricalData
      });
    });
    
    return status;
  }

  /**
   * Get cached data for a region (synchronous)
   */
  getCachedData(region: keyof typeof this.apiMap, includeHistorical: boolean = false): RawTradeData[] | null {
    const year = this.getCurrentYear();
    const cacheKey = this.getCacheKey(region, year, includeHistorical);
    const cached = this.dataCache.get(cacheKey);
    
    if (!cached || !this.isCacheValid(cached)) {
      return null;
    }
    
    return includeHistorical ? cached.unfilteredRawData : cached.rawData;
  }

  /**
   * Find data by product ID
   */
  findDataByProduct(data: RawTradeData[], productId: string): RawTradeData | undefined {

    return data.find(item => item.product === Number(productId));

    const productIdNumber = Number(productId);

    const returnValue = data.find(item => item.product === productIdNumber);

    if (!returnValue) {
      console.warn(`No data found for product ID: ${productId}`);
    }

    return returnValue
  }

  /**
   * Calculate total sum of values
   */
  calculateTotalSum(data: RawTradeData[]): number {
    return data.reduce((acc, item) => acc + (typeof item.Value === "number" ? item.Value : 0), 0);
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
   * Get all available regions
   */
  getAvailableRegions(): string[] {
    return Object.keys(this.apiMap);
  }
}