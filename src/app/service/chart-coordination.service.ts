// enhanced-chart-coordination.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { DisplayMode, FilterType, GroupingType } from '../feasible/feasible-chart-model';

export interface ChartCoordinationState {
  selectedRegion: string;
  selectedYear: string;
  selectedGrouping: GroupingType;
  displayMode: DisplayMode;
  filterType: FilterType;
  searchQuery: string;
  searchResults: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ChartCoordinationService {
  
  // Individual state subjects
  private regionSubject = new BehaviorSubject<string>('Alberta');
  private yearSubject = new BehaviorSubject<string>('2023');
  private groupingSubject = new BehaviorSubject<GroupingType>(GroupingType.HS2);
  private displayModeSubject = new BehaviorSubject<DisplayMode>(DisplayMode.DEFAULT);
  private filterTypeSubject = new BehaviorSubject<FilterType>(FilterType.ALL);
  
  // Search state subjects
  private searchQuerySubject = new BehaviorSubject<string>('');
  private searchResultsSubject = new BehaviorSubject<any[]>([]);
  
  // Public observables
  public region$ = this.regionSubject.asObservable().pipe(distinctUntilChanged());
  public year$ = this.yearSubject.asObservable().pipe(distinctUntilChanged());
  public grouping$ = this.groupingSubject.asObservable().pipe(distinctUntilChanged());
  public displayMode$ = this.displayModeSubject.asObservable().pipe(distinctUntilChanged());
  public filterType$ = this.filterTypeSubject.asObservable().pipe(distinctUntilChanged());
  
  // Search observables
  public searchQuery$ = this.searchQuerySubject.asObservable().pipe(
    distinctUntilChanged(),
    debounceTime(300) // Debounce search queries for performance
  );
  public searchResults$ = this.searchResultsSubject.asObservable().pipe(distinctUntilChanged());
  
  // Combined state observable
  public state$: Observable<ChartCoordinationState> = combineLatest([
    this.region$,
    this.year$,
    this.grouping$,
    this.displayMode$,
    this.filterType$,
    this.searchQuery$,
    this.searchResults$
  ]).pipe(
    map(([selectedRegion, selectedYear, selectedGrouping, displayMode, filterType, searchQuery, searchResults]) => ({
      selectedRegion,
      selectedYear,
      selectedGrouping,
      displayMode,
      filterType,
      searchQuery,
      searchResults
    })),
    distinctUntilChanged((prev, curr) => 
      JSON.stringify(prev) === JSON.stringify(curr)
    )
  );

  constructor() {
    // Log state changes in development
    if (!window.location.hostname.includes('prod')) {
      this.state$.subscribe(state => {
        console.log('📊 Chart Coordination State Changed:', state);
      });
    }

    // Subscribe to search query changes to perform search
    this.searchQuery$.subscribe(query => {
      if (query.trim()) {
        this.performSearch(query);
      } else {
        this.clearSearchResults();
      }
    });
  }

  // Setters
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
  }

  // Search methods
  setSearchQuery(query: string): void {
    console.log('Setting search query:', query);
    this.searchQuerySubject.next(query);
  }

  setSearchResults(results: any[]): void {
    console.log('Setting search results:', results);
    this.searchResultsSubject.next(results);
  }

  clearSearch(): void {
    this.searchQuerySubject.next('');
    this.searchResultsSubject.next([]);
  }

  clearSearchResults(): void {
    this.searchResultsSubject.next([]);
  }

  // Getters
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

  // Convenience methods
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

  // Search functionality
  private performSearch(query: string): void {
    // This method will be called when search query changes
    // The actual search logic will be handled by individual chart components
    // but we can store common search results here if needed
    console.log('Performing search for:', query);
  }

  // Search helper methods
  searchInData(data: any[], query: string, searchFields: string[] = ['description']): any[] {
    if (!query.trim()) {
      return data;
    }

    const lowercaseQuery = query.toLowerCase().trim();
    
    return data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = item[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(lowercaseQuery);
        }
        if (typeof fieldValue === 'number') {
          return fieldValue.toString().includes(lowercaseQuery);
        }
        return false;
      });
    });
  }

  // Create search suggestions/autocomplete data
  getSearchSuggestions(data: any[], maxSuggestions: number = 10): string[] {
    const suggestions = new Set<string>();
    
    data.forEach(item => {
      if (item.description && suggestions.size < maxSuggestions) {
        suggestions.add(item.description);
      }
    });
    
    return Array.from(suggestions).slice(0, maxSuggestions);
  }

  // Get unique product names for search dropdown
  getUniqueProductNames(data: any[]): Array<{id: string, text: string}> {
    const uniqueNames = new Map<string, string>();
    
    data.forEach(item => {
      if (item.description && !uniqueNames.has(item.description)) {
        uniqueNames.set(item.description, item.product?.toString() || item.id?.toString() || '');
      }
    });
    
    return Array.from(uniqueNames.entries()).map(([text, id]) => ({
      id,
      text
    }));
  }

  // Batch update method
  updateState(partial: Partial<ChartCoordinationState>): void {
    if (partial.selectedRegion !== undefined) {
      this.setRegion(partial.selectedRegion);
    }
    if (partial.selectedYear !== undefined) {
      this.setYear(partial.selectedYear);
    }
    if (partial.selectedGrouping !== undefined) {
      this.setGrouping(partial.selectedGrouping);
    }
    if (partial.displayMode !== undefined) {
      this.setDisplayMode(partial.displayMode);
    }
    if (partial.filterType !== undefined) {
      this.setFilterType(partial.filterType);
    }
    if (partial.searchQuery !== undefined) {
      this.setSearchQuery(partial.searchQuery);
    }
    if (partial.searchResults !== undefined) {
      this.setSearchResults(partial.searchResults);
    }
  }

  // Reset to defaults
  reset(): void {
    this.regionSubject.next('Alberta');
    this.yearSubject.next('2023');
    this.groupingSubject.next(GroupingType.HS2);
    this.displayModeSubject.next(DisplayMode.DEFAULT);
    this.filterTypeSubject.next(FilterType.ALL);
    this.searchQuerySubject.next('');
    this.searchResultsSubject.next([]);
  }

  // Get current state snapshot
  getState(): ChartCoordinationState {
    return {
      selectedRegion: this.currentRegion,
      selectedYear: this.currentYear,
      selectedGrouping: this.currentGrouping,
      displayMode: this.currentDisplayMode,
      filterType: this.currentFilterType,
      searchQuery: this.currentSearchQuery,
      searchResults: this.currentSearchResults
    };
  }
}