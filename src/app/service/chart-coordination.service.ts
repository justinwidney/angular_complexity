// enhanced-chart-coordination.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { DisplayMode, FilterType, GroupingType } from '../feasible/feasible-chart-model';

export interface ChartCoordinationState {
  selectedRegion: string;
  selectedYear: string;
  selectedGrouping: GroupingType;
  displayMode: DisplayMode;
  filterType: FilterType;
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
  
  // Public observables
  public region$ = this.regionSubject.asObservable().pipe(distinctUntilChanged());
  public year$ = this.yearSubject.asObservable().pipe(distinctUntilChanged());
  public grouping$ = this.groupingSubject.asObservable().pipe(distinctUntilChanged());
  public displayMode$ = this.displayModeSubject.asObservable().pipe(distinctUntilChanged());
  public filterType$ = this.filterTypeSubject.asObservable().pipe(distinctUntilChanged());
  
  // Combined state observable
  public state$: Observable<ChartCoordinationState> = combineLatest([
    this.region$,
    this.year$,
    this.grouping$,
    this.displayMode$,
    this.filterType$
  ]).pipe(
    map(([selectedRegion, selectedYear, selectedGrouping, displayMode, filterType]) => ({
      selectedRegion,
      selectedYear,
      selectedGrouping,
      displayMode,
      filterType
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
    this.filterTypeSubject.next(filter);
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

  // Convenience methods
  isNaicsGrouping(): boolean {
    // Assuming NAICS is represented by a specific GroupingType value
    // Adjust based on your actual enum values
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
  }

  // Reset to defaults
  reset(): void {
    this.regionSubject.next('Alberta');
    this.yearSubject.next('2023');
    this.groupingSubject.next(GroupingType.HS2);
    this.displayModeSubject.next(DisplayMode.DEFAULT);
    this.filterTypeSubject.next(FilterType.ALL);
  }

  // Get current state snapshot
  getState(): ChartCoordinationState {
    return {
      selectedRegion: this.currentRegion,
      selectedYear: this.currentYear,
      selectedGrouping: this.currentGrouping,
      displayMode: this.currentDisplayMode,
      filterType: this.currentFilterType
    };
  }
}