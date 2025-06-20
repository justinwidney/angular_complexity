// enhanced-chart-coordination.service.ts - FIXED VERSION

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { map, distinctUntilChanged, debounceTime, switchMap, tap, startWith } from 'rxjs/operators';
import { DisplayMode, FilterType, GroupingType } from '../feasible/feasible-chart-model';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'description' | 'hs_code' | 'product_name';
  hsCode?: string;
  description?: string;
  data?: any;
  score?: number;
}

// NEW: Interface for product group filtering
export interface ProductGroup {
  id: string;
  name: string;
  hsCodeRanges: { min: number; max: number }[];
  color?: string;
  enabled: boolean;
}

// NEW: Interface for filtered totals
export interface FilteredTotals {
  totalSum: number;
  productCount: number;
  nodeCount: number;
  averageValue: number;
  filteredData: any[];
  filterSummary: {
    filterType: FilterType;
    enabledProductGroups: string[];
    searchQuery: string;
    hasActiveFilters: boolean;
  };
}

// Enhanced state interface
export interface ChartCoordinationState {
  selectedRegion: string;
  selectedYear: string;
  selectedGrouping: GroupingType;
  displayMode: DisplayMode;
  filterType: FilterType;
  searchQuery: string;
  searchResults: any[];
  searchSuggestions: SearchSuggestion[];
  isSearching: boolean;
  // NEW: Filtered totals and product groups
  filteredTotals: FilteredTotals;
  productGroups: ProductGroup[];
}

@Injectable({
  providedIn: 'root'
})
export class ChartCoordinationService {
  
  // Individual state subjects (keeping your existing ones)
  private regionSubject = new BehaviorSubject<string>('Alberta');
  private yearSubject = new BehaviorSubject<string>('2023');
  private groupingSubject = new BehaviorSubject<GroupingType>(GroupingType.HS2);
  private displayModeSubject = new BehaviorSubject<DisplayMode>(DisplayMode.DEFAULT);
  private filterTypeSubject = new BehaviorSubject<FilterType>(FilterType.ALL);
  
  // Search state subjects - Enhanced with better debouncing (keeping your existing ones)
  private searchQueryInputSubject = new Subject<string>(); // For immediate input
  private searchQuerySubject = new BehaviorSubject<string>(''); // For synchronized state
  private searchResultsSubject = new BehaviorSubject<any[]>([]);
  private searchSuggestionsSubject = new BehaviorSubject<SearchSuggestion[]>([]);
  private isSearchingSubject = new BehaviorSubject<boolean>(false); // Loading state
  
  // NEW: Product groups and filtered totals subjects
  private productGroupsSubject = new BehaviorSubject<ProductGroup[]>(this.getDefaultProductGroups());
  private filteredTotalsSubject = new BehaviorSubject<FilteredTotals>(this.getEmptyFilteredTotals());
  
  // Data cache for search and filtering (keeping your existing one)
  private dataCache: any[] = [];
  private originalTotalSum: number = 0; // NEW: Track original total for comparison
  private dataCacheSet: boolean = false; // NEW: Track if data cache has been set
  
  // Race condition prevention (keeping your existing one)
  private searchSequence = 0;
  
  // Public observables (keeping all your existing ones + new ones)
  public region$ = this.regionSubject.asObservable().pipe(distinctUntilChanged());
  public year$ = this.yearSubject.asObservable().pipe(distinctUntilChanged());
  public grouping$ = this.groupingSubject.asObservable().pipe(distinctUntilChanged());
  public displayMode$ = this.displayModeSubject.asObservable().pipe(distinctUntilChanged());
  public filterType$ = this.filterTypeSubject.asObservable().pipe(distinctUntilChanged());
  
  // Enhanced search observables (keeping your existing ones)
  public searchQuery$ = this.searchQuerySubject.asObservable().pipe(distinctUntilChanged());
  public searchResults$ = this.searchResultsSubject.asObservable().pipe(distinctUntilChanged());
  public searchSuggestions$ = this.searchSuggestionsSubject.asObservable().pipe(distinctUntilChanged());
  public isSearching$ = this.isSearchingSubject.asObservable().pipe(distinctUntilChanged());
  
  // NEW: Product groups and filtered totals observables
  public productGroups$ = this.productGroupsSubject.asObservable().pipe(distinctUntilChanged());
  public filteredTotals$ = this.filteredTotalsSubject.asObservable().pipe(distinctUntilChanged());
  
  // Enhanced debounced search processing (keeping your existing logic)
  private debouncedSearch$ = this.searchQueryInputSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(query => {
      this.searchQuerySubject.next(query);
      if (query.trim().length > 0) {
        this.isSearchingSubject.next(true);
      }
    }),
    switchMap(query => this.processSearchQuery(query))
  );
  
  // Enhanced combined state observable
  public state$: Observable<ChartCoordinationState> = combineLatest([
    this.region$,
    this.year$,
    this.grouping$,
    this.displayMode$,
    this.filterType$,
    this.searchQuery$,
    this.searchResults$,
    this.searchSuggestions$,
    this.isSearching$,
    this.filteredTotals$, // NEW
    this.productGroups$ // NEW
  ]).pipe(
    map(([selectedRegion, selectedYear, selectedGrouping, displayMode, filterType, searchQuery, searchResults, searchSuggestions, isSearching, filteredTotals, productGroups]) => ({
      selectedRegion,
      selectedYear,
      selectedGrouping,
      displayMode,
      filterType,
      searchQuery,
      searchResults,
      searchSuggestions,
      isSearching,
      filteredTotals,
      productGroups
    })),
    distinctUntilChanged((prev, curr) => 
      JSON.stringify(prev) === JSON.stringify(curr)
    )
  );

  constructor() {

    if (!window.location.hostname.includes('prod')) {
      this.state$.subscribe(state => {
        console.log('📊 Chart Coordination State Changed:', state);
      });
    }

    this.setupSearchPipeline();
    this.setupFilteredTotalsCalculation();
  }

  private setupSearchPipeline(): void {
    this.debouncedSearch$.subscribe({
      next: ({ suggestions, results }) => {
        this.searchSuggestionsSubject.next(suggestions);
        this.searchResultsSubject.next(results);
        this.isSearchingSubject.next(false);
        this.calculateFilteredTotals();
      },
      error: (error) => {
        console.error('Search error:', error);
        this.isSearchingSubject.next(false);
      }
    });
  }

  // NEW: Setup filtered totals calculation pipeline
  private setupFilteredTotalsCalculation(): void {
    combineLatest([
      this.filterType$,
      this.searchQuery$,
      this.productGroups$
    ]).pipe(
      debounceTime(100) // Small debounce to batch multiple changes
    ).subscribe(() => {
      this.calculateFilteredTotals();
    });
  }

  // FIXED: Calculate filtered totals based on current filters
  private calculateFilteredTotals(): void {
    console.log('🔍 Calculating filtered totals...');

    // FIXED: If no data cache is set, don't calculate filtered totals
    // This prevents charts that don't use filtering from getting 0 values
    if (!this.dataCacheSet || !this.dataCache || this.dataCache.length === 0) {
      console.log('📊 No data cache set or empty - using base totals');
      
      // Only update if there's actually data to work with
      if (this.dataCacheSet && this.dataCache.length === 0) {
        this.filteredTotalsSubject.next(this.getEmptyFilteredTotals());
      }
      // If dataCache was never set, don't emit anything - let charts handle their own totals
      return;
    }

    console.log('🧮 Calculating filtered totals with', this.dataCache.length, 'records...');
    
    const filterType = this.filterTypeSubject.value;
    const searchQuery = this.searchQuerySubject.value;
    const enabledProductGroups = this.productGroupsSubject.value.filter(group => group.enabled);
    const searchResults = this.searchResultsSubject.value;
    
    let filteredData = [...this.dataCache];
    
    // 1. Apply RCA filter
    filteredData = this.applyRCAFilter(filteredData, filterType);
    
    // 2. Apply product group filter
    if (enabledProductGroups.length > 0 && enabledProductGroups.length < this.productGroupsSubject.value.length) {
      filteredData = this.applyProductGroupFilter(filteredData, enabledProductGroups);
    }
    
    // 3. Apply search filter
    if (searchQuery.trim().length > 0 && searchResults.length > 0) {
      const searchProductIds = new Set(searchResults.map(item => item.product?.toString()));
      filteredData = filteredData.filter(item => searchProductIds.has(item.product?.toString()));
    }
    
    // Calculate totals
    const totalSum = this.calculateTotalSum(filteredData);
    const productCount = filteredData.length;
    const nodeCount = new Set(filteredData.map(item => item.product)).size;
    const averageValue = productCount > 0 ? totalSum / productCount : 0;
    
    const hasActiveFilters = 
      filterType !== FilterType.ALL || 
      searchQuery.trim().length > 0 || 
      (enabledProductGroups.length > 0 && enabledProductGroups.length < this.productGroupsSubject.value.length);
    
    const filteredTotals: FilteredTotals = {
      totalSum,
      productCount,
      nodeCount,
      averageValue,
      filteredData,
      filterSummary: {
        filterType,
        enabledProductGroups: enabledProductGroups.map(group => group.name),
        searchQuery,
        hasActiveFilters
      }
    };
    
    console.log('📊 Filtered totals calculated:', {
      totalSum: totalSum.toLocaleString(),
      productCount,
      nodeCount,
      hasActiveFilters,
      originalSum: this.originalTotalSum.toLocaleString()
    });
    
    this.filteredTotalsSubject.next(filteredTotals);
  }

  // NEW: Get base totals from data without applying filters
  public getBaseTotals(data: any[]): FilteredTotals {
    const totalSum = this.calculateTotalSum(data);
    const productCount = data.length;
    const nodeCount = new Set(data.map(item => item.product)).size;
    const averageValue = productCount > 0 ? totalSum / productCount : 0;
    
    return {
      totalSum,
      productCount,
      nodeCount,
      averageValue,
      filteredData: data,
      filterSummary: {
        filterType: FilterType.ALL,
        enabledProductGroups: [],
        searchQuery: '',
        hasActiveFilters: false
      }
    };
  }

  // NEW: Check if filtering is active
  public isFilteringActive(): boolean {
    return this.dataCacheSet && (
      this.filterTypeSubject.value !== FilterType.ALL ||
      this.searchQuerySubject.value.trim().length > 0 ||
      this.productGroupsSubject.value.some(group => !group.enabled)
    );
  }

  // NEW: Apply RCA filter logic
  private applyRCAFilter(data: any[], filterType: FilterType): any[] {
    switch (filterType) {
      case FilterType.ALL:
        return data;
      case FilterType.RCA_ABOVE_1:
        return data.filter(item => item.rca && item.rca > 1);
      case FilterType.RCA_BETWEEN:
        return data.filter(item => item.rca && item.rca >= 0.5 && item.rca <= 1);
      default:
        return data;
    }
  }

  // NEW: Apply product group filter logic
  private applyProductGroupFilter(data: any[], enabledGroups: ProductGroup[]): any[] {
    const enabledRanges: { min: number; max: number }[] = [];
    
    enabledGroups.forEach(group => {
      enabledRanges.push(...group.hsCodeRanges);
    });
    
    return data.filter(item => {
      const productCode = parseInt(item.product?.toString() || '0');
      const hs2Code = Math.floor(productCode / 100);
      
      return enabledRanges.some(range => hs2Code >= range.min && hs2Code <= range.max);
    });
  }

  // NEW: Calculate total sum helper
  private calculateTotalSum(data: any[]): number {
    return data.reduce((acc, item) => acc + (Number(item.Value) || 0), 0);
  }

  // NEW: Default product groups configuration
  private getDefaultProductGroups(): ProductGroup[] {
    return [
      {
        id: 'animal-food',
        name: 'Animal & Food Products',
        hsCodeRanges: [{ min: 1, max: 24 }],
        color: '#FF6B6B',
        enabled: true
      },
      {
        id: 'minerals',
        name: 'Minerals',
        hsCodeRanges: [{ min: 25, max: 27 }],
        color: '#4ECDC4',
        enabled: true
      },
      {
        id: 'chemicals',
        name: 'Chemicals & Plastics',
        hsCodeRanges: [{ min: 28, max: 40 }],
        color: '#45B7D1',
        enabled: true
      },
      {
        id: 'raw-materials',
        name: 'Raw Materials',
        hsCodeRanges: [{ min: 41, max: 49 }],
        color: '#96CEB4',
        enabled: true
      },
      {
        id: 'textiles',
        name: 'Textiles',
        hsCodeRanges: [{ min: 50, max: 63 }],
        color: '#FFEAA7',
        enabled: true
      },
      {
        id: 'footwear',
        name: 'Footwear & Accessories',
        hsCodeRanges: [{ min: 64, max: 67 }],
        color: '#DDA0DD',
        enabled: true
      },
      {
        id: 'stone-glass',
        name: 'Stone & Glass',
        hsCodeRanges: [{ min: 68, max: 71 }],
        color: '#98D8C8',
        enabled: true
      },
      {
        id: 'metals',
        name: 'Metals',
        hsCodeRanges: [{ min: 72, max: 83 }],
        color: '#F7DC6F',
        enabled: true
      },
      {
        id: 'machinery',
        name: 'Machinery & Electronics',
        hsCodeRanges: [{ min: 84, max: 85 }],
        color: '#BB8FCE',
        enabled: true
      },
      {
        id: 'transportation',
        name: 'Transportation',
        hsCodeRanges: [{ min: 86, max: 89 }],
        color: '#85C1E9',
        enabled: true
      },
      {
        id: 'miscellaneous',
        name: 'Miscellaneous',
        hsCodeRanges: [{ min: 90, max: 97 }],
        color: '#F8C471',
        enabled: true
      }
    ];
  }

  // FIXED: Empty filtered totals
  private getEmptyFilteredTotals(): FilteredTotals {
    return {
      totalSum: 0,
      productCount: 0,
      nodeCount: 0,
      averageValue: 0,
      filteredData: [],
      filterSummary: {
        filterType: FilterType.ALL,
        enabledProductGroups: [],
        searchQuery: '',
        hasActiveFilters: false
      }
    };
  }

  // ===== ALL YOUR EXISTING METHODS BELOW (MOSTLY UNCHANGED) =====

  // Setters (keeping all your existing ones)
  setRegion(region: string): void {
    this.regionSubject.next(region);
  }

  setYear(year: string): void {
    this.yearSubject.next(year);
  }

  setGrouping(grouping: GroupingType): void {
    this.groupingSubject.next(grouping);
  }

  setDisplayMode(mode: DisplayMode): void {
    this.displayModeSubject.next(mode);
  }

  setFilterType(filter: FilterType): void {
    console.log('Setting filter type:', filter);
    this.filterTypeSubject.next(filter);
    // Filtered totals will be recalculated automatically via the pipeline
  }

  // Enhanced search methods (keeping all your existing logic)
  setSearchQuery(query: string): void {
    console.log('Setting search query:', query);
    this.searchQueryInputSubject.next(query);
  }

  setSearchResults(results: any[]): void {
    console.log('Setting search results:', results);
    this.searchResultsSubject.next(results);
  }

  setSuggestions(suggestions: SearchSuggestion[]): void {
    this.searchSuggestionsSubject.next(suggestions);
  }

  clearSearch(): void {
    this.searchQueryInputSubject.next('');
    this.searchQuerySubject.next('');
    this.searchResultsSubject.next([]);
    this.searchSuggestionsSubject.next([]);
    this.isSearchingSubject.next(false);
  }

  clearSearchResults(): void {
    this.searchResultsSubject.next([]);
  }

  clearSuggestions(): void {
    this.searchSuggestionsSubject.next([]);
  }

  // FIXED: Enhanced data management - Don't override with empty data
  setDataCache(data: any[], totalSum?: number): void {
    console.log('📊 Setting data cache with', data.length, 'records');
    
    // FIXED: Don't override existing data cache with empty data
    // This prevents charts with no data from clearing other charts' filtering
    if (data.length === 0 && this.dataCacheSet && this.dataCache.length > 0) {
      console.log('⚠️  Ignoring empty data cache - keeping existing data for filtering');
      return;
    }
    
    this.dataCache = data;
    this.dataCacheSet = data.length > 0; // Only mark as set if we have actual data
    
    if (totalSum !== undefined) {
      this.originalTotalSum = totalSum;
    } else {
      this.originalTotalSum = this.calculateTotalSum(data);
    }
    
    // NEW: Only recalculate filtered totals if we have data
    if (data.length > 0) {
      this.calculateFilteredTotals();
    }
  }

  // NEW: Clear data cache (for charts that don't need filtering)
  clearDataCache(): void {
    console.log('📊 Clearing data cache');
    this.dataCache = [];
    this.dataCacheSet = false;
    this.originalTotalSum = 0;
  }

  // NEW: Method for charts that don't use filtering - doesn't affect coordination service state
  getIndependentTotals(data: any[]): FilteredTotals {
    console.log('📊 Calculating independent totals for', data.length, 'records (no coordination service interference)');
    return this.getBaseTotals(data);
  }

  // NEW: Product group management methods
  toggleProductGroup(groupId: string): void {
    const currentGroups = this.productGroupsSubject.value;
    const updatedGroups = currentGroups.map(group => 
      group.id === groupId ? { ...group, enabled: !group.enabled } : group
    );
    this.productGroupsSubject.next(updatedGroups);
  }

  setProductGroupEnabled(groupId: string, enabled: boolean): void {
    const currentGroups = this.productGroupsSubject.value;
    const updatedGroups = currentGroups.map(group => 
      group.id === groupId ? { ...group, enabled } : group
    );
    this.productGroupsSubject.next(updatedGroups);
  }

  enableAllProductGroups(): void {
    const currentGroups = this.productGroupsSubject.value;
    const updatedGroups = currentGroups.map(group => ({ ...group, enabled: true }));
    this.productGroupsSubject.next(updatedGroups);
  }

  disableAllProductGroups(): void {
    const currentGroups = this.productGroupsSubject.value;
    const updatedGroups = currentGroups.map(group => ({ ...group, enabled: false }));
    this.productGroupsSubject.next(updatedGroups);
  }

  // Getters (keeping all your existing ones + new ones)
  get currentRegion(): string {
    return this.regionSubject.value;
  }

  get currentYear(): string {
    return this.yearSubject.value;
  }

  get currentGrouping(): GroupingType {
    return this.groupingSubject.value;
  }

  get currentDisplayMode(): DisplayMode {
    return this.displayModeSubject.value;
  }

  get currentFilterType(): FilterType {
    return this.filterTypeSubject.value;
  }

  get currentSearchQuery(): string {
    return this.searchQuerySubject.value;
  }

  get currentSearchResults(): any[] {
    return this.searchResultsSubject.value;
  }

  get currentSuggestions(): SearchSuggestion[] {
    return this.searchSuggestionsSubject.value;
  }

  get isCurrentlySearching(): boolean {
    return this.isSearchingSubject.value;
  }

  // NEW: Getters for filtered totals and product groups
  get currentFilteredTotals(): FilteredTotals {
    return this.filteredTotalsSubject.value;
  }

  get currentProductGroups(): ProductGroup[] {
    return this.productGroupsSubject.value;
  }

  get originalTotal(): number {
    return this.originalTotalSum;
  }

  // NEW: Check if data cache is set
  get hasDataCache(): boolean {
    return this.dataCacheSet;
  }

  // Convenience methods (keeping all your existing ones + new ones)
  isNaicsGrouping(): boolean {
    return this.currentGrouping === GroupingType.NAICS;
  }

  isHS2Grouping(): boolean {
    return this.currentGrouping === GroupingType.HS2;
  }

  isHS4Grouping(): boolean {
    return this.currentGrouping === GroupingType.HS4;
  }

  isHS6Grouping(): boolean {
    return this.currentGrouping === GroupingType.HS6;
  }

  isSearchActive(): boolean {
    return this.currentSearchQuery.trim().length > 0;
  }

  // NEW: Check if any filters are active
  hasActiveFilters(): boolean {
    return this.currentFilteredTotals.filterSummary.hasActiveFilters;
  }

  // ===== ALL YOUR EXISTING SEARCH METHODS (KEEPING THEM UNCHANGED) =====

  private processSearchQuery(query: string): Observable<{suggestions: SearchSuggestion[], results: any[]}> {
    return new Observable(observer => {
      const currentSequence = ++this.searchSequence;
      
      try {
        if (!query || query.trim().length === 0) {
          observer.next({ suggestions: [], results: [] });
          observer.complete();
          return;
        }

        const trimmedQuery = query.trim();
        
        if (currentSequence === this.searchSequence) {
          const suggestions = this.generateSuggestionsSync(trimmedQuery);
          const results = this.searchInDataEnhanced(this.dataCache, trimmedQuery);
          
          observer.next({ suggestions, results });
        }
        
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    });
  }

  // (Keep all your existing search methods exactly as they are...)
  searchInDataEnhanced(data: any[], query: string, maxResults: number = 50): any[] {
    if (!query.trim()) {
      return data;
    }

    const lowercaseQuery = query.toLowerCase().trim();
    const isNumericQuery = /^\d+$/.test(query.trim());
    
    let results: any[] = [];

    if (isNumericQuery) {
      results = this.searchByHSCode(data, query.trim());
    } else {
      results = this.searchByText(data, lowercaseQuery);
    }

    console.log('Search results found:', results.length, 'for query:', query);
    return results.slice(0, maxResults);
  }

  private searchByHSCode(data: any[], hsCode: string): any[] {
    const results: any[] = [];

    data.forEach(item => {
      const hsFields = this.getHSFieldsForSearch(item);
      
      for (const field of hsFields) {
        const fieldValue = item[field];
        if (fieldValue) {
          const fieldStr = fieldValue.toString();
          
          if (fieldStr === hsCode || fieldStr.startsWith(hsCode)) {
            results.push({
              ...item,
              matchType: 'hs_code',
              matchField: field,
              matchValue: fieldStr
            });
            break;
          }
        }
      }
    });

    return results.sort((a, b) => {
      const aExact = a.matchValue === hsCode ? 1 : 0;
      const bExact = b.matchValue === hsCode ? 1 : 0;
      return bExact - aExact;
    });
  }

  private searchByText(data: any[], query: string): any[] {
    const searchFields = ['description', 'product_name', 'commodity_description'];
    
    return data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = item[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(query);
        }
        return false;
      });
    });
  }

  private getHSFieldsForSearch(item: any): string[] {
    const fields: string[] = [];
    
    switch (this.currentGrouping) {
      case GroupingType.HS2:
        if (item.hs2) fields.push('hs2');
        if (item.hs_2) fields.push('hs_2');
        break;
      case GroupingType.HS4:
        if (item.hs4) fields.push('hs4');
        if (item.hs_4) fields.push('hs_4');
        break;
      case GroupingType.HS6:
        if (item.hs6) fields.push('hs6');
        if (item.hs_6) fields.push('hs_6');
        break;
      default:
        if (item.hs2) fields.push('hs2');
        if (item.hs4) fields.push('hs4');
        if (item.hs6) fields.push('hs6');
        if (item.hs_2) fields.push('hs_2');
        if (item.hs_4) fields.push('hs_4');
        if (item.hs_6) fields.push('hs_6');
        break;
    }
    
    const possibleFields = ['product'];
    possibleFields.forEach(field => {
      if (item.hasOwnProperty(field) && item[field] !== null && item[field] !== undefined) {
        fields.push(field);
      }
    });

    return fields;
  }

  private generateSuggestionsSync(query: string, maxSuggestions: number = 20): SearchSuggestion[] {
    if (!this.dataCache.length || query.length < 1) {
      return [];
    }

    const suggestions: SearchSuggestion[] = [];
    const lowercaseQuery = query.toLowerCase().trim();
    const isNumericQuery = /^\d+$/.test(query.trim());
    
    if (isNumericQuery) {
      suggestions.push(...this.generateHSCodeSuggestions(query.trim(), Math.floor(maxSuggestions / 2)));
    }
    
    suggestions.push(...this.generateTextSuggestions(lowercaseQuery, maxSuggestions - suggestions.length));
    
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) => 
        self.findIndex(s => s.id === suggestion.id && s.type === suggestion.type) === index
      )
      .slice(0, maxSuggestions);
    
    return uniqueSuggestions;
  }

  private generateHSCodeSuggestions(query: string, maxSuggestions: number): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const seen = new Set<string>();

    this.dataCache.forEach(item => {
      if (suggestions.length >= maxSuggestions) return;

      const hsFields = this.getHSFieldsForSearch(item);
      
      for (const field of hsFields) {
        const fieldValue = item[field];
        if (fieldValue && fieldValue.toString().startsWith(query)) {
          const hsCode = fieldValue.toString();
          const key = `${hsCode}_${field}`;
          
          if (!seen.has(key)) {
            seen.add(key);
            suggestions.push({
              id: hsCode,
              text: `${hsCode} - ${item.description || 'No description'}`,
              type: 'hs_code',
              hsCode: hsCode,
              description: item.description,
              data: item,
              score: this.calculateScore(query, hsCode, 'exact')
            });
          }
        }
      }
    });

    return suggestions.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  private generateTextSuggestions(query: string, maxSuggestions: number): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const seen = new Set<string>();

    this.dataCache.forEach(item => {
      if (suggestions.length >= maxSuggestions) return;

      const description = item.description;
      if (description && typeof description === 'string') {
        const lowerDescription = description.toLowerCase();
        
        if (lowerDescription.includes(query) && !seen.has(description)) {
          seen.add(description);
          suggestions.push({
            id: item.id || item.product || description,
            text: description,
            type: 'description',
            description: description,
            hsCode: this.getMainHSCode(item),
            data: item,
            score: this.calculateScore(query, lowerDescription, 'contains')
          });
        }
      }
    });

    return suggestions.sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  private calculateScore(query: string, target: string, matchType: 'exact' | 'contains'): number {
    if (matchType === 'exact') {
      if (target.startsWith(query)) {
        return 100 - (target.length - query.length);
      }
      return 0;
    } else {
      const index = target.indexOf(query);
      if (index === 0) return 100;
      if (index > 0) return 80 - index;
      return 0;
    }
  }

  private getMainHSCode(item: any): string | undefined {
    const grouping = this.currentGrouping;
    
    switch (grouping) {
      case GroupingType.HS2:
        return item.hs2 || item.hs_2;
      case GroupingType.HS4:
        return item.hs4 || item.hs_4;
      case GroupingType.HS6:
        return item.hs6 || item.hs_6;
      default:
        return item.hs2 || item.hs4 || item.hs6 || item.hs_2 || item.hs_4 || item.hs_6;
    }
  }

  selectSuggestion(suggestion: SearchSuggestion): void {
    console.log('Selected suggestion:', suggestion);
    
    this.searchQuerySubject.next(suggestion.text);
    
    if (suggestion.data) {
      this.setSearchResults([suggestion.data]);
    } else {
      const results = this.searchInDataEnhanced(this.dataCache, suggestion.text);
      this.setSearchResults(results);
    }
    
    this.clearSuggestions();
  }

  // Keep all your other existing methods...
  searchInData(data: any[], query: string, searchFields: string[] = ['description']): any[] {
    return this.searchInDataEnhanced(data, query);
  }

  getSearchSuggestions(data: any[], maxSuggestions: number = 10): SearchSuggestion[] {
    this.setDataCache(data);
    const currentQuery = this.currentSearchQuery;
    
    if (!currentQuery.trim()) {
      return [];
    }
    
    return this.generateSuggestionsSync(currentQuery, maxSuggestions);
  }

  getUniqueProductNames(data: any[]): SearchSuggestion[] {
    const uniqueNames = new Map<string, SearchSuggestion>();
    
    data.forEach(item => {
      if (item.description && !uniqueNames.has(item.description)) {
        uniqueNames.set(item.description, {
          id: item.product?.toString() || item.id?.toString() || '',
          text: item.description,
          type: 'product_name',
          description: item.description,
          hsCode: this.getMainHSCode(item),
          data: item
        });
      }
    });
    
    return Array.from(uniqueNames.values());
  }

  // Convenience getters for the observables
  get searchQuery(): Observable<string> {
    return this.searchQuery$;
  }

  get searchResults(): Observable<any[]> {
    return this.searchResults$;
  }

  get searchSuggestions(): Observable<SearchSuggestion[]> {
    return this.searchSuggestions$;
  }

  get isSearching(): Observable<boolean> {
    return this.isSearching$;
  }

  get state(): Observable<ChartCoordinationState> {
    return this.state$;
  }

  // NEW: Convenience getters for filtered totals and product groups
  get filteredTotals(): Observable<FilteredTotals> {
    return this.filteredTotals$;
  }

  get productGroups(): Observable<ProductGroup[]> {
    return this.productGroups$;
  }
}