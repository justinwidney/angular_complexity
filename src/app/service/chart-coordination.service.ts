// chart-coordination.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupingType, DisplayMode, FilterType, ChartCoordinationState } from '../feasible/feasible-chart-model';

@Injectable({
  providedIn: 'root'
})
export class ChartCoordinationService {
  
  setYear(year: string) {
     
  }
  setRegion(region: string) {
  }
  
  private readonly initialState: ChartCoordinationState = {
    selectedRegion: 'Alberta',
    selectedYear: '2023',
    selectedGrouping: GroupingType.HS4,
    displayMode: DisplayMode.DEFAULT,
    filterType: FilterType.ALL
  };

  // State subjects
  private stateSubject = new BehaviorSubject<ChartCoordinationState>(this.initialState);
  private regionSubject = new BehaviorSubject<string>(this.initialState.selectedRegion);
  private yearSubject = new BehaviorSubject<string>(this.initialState.selectedYear);
  private groupingSubject = new BehaviorSubject<GroupingType>(this.initialState.selectedGrouping);
  private displayModeSubject = new BehaviorSubject<DisplayMode>(this.initialState.displayMode);
  private filterTypeSubject = new BehaviorSubject<FilterType>(this.initialState.filterType);

  // Observables for components to subscribe to
  public readonly state$: Observable<ChartCoordinationState> = this.stateSubject.asObservable();
  public readonly region$: Observable<string> = this.regionSubject.asObservable();
  public readonly year$: Observable<string> = this.yearSubject.asObservable();
  public readonly grouping$: Observable<GroupingType> = this.groupingSubject.asObservable();
  public readonly displayMode$: Observable<DisplayMode> = this.displayModeSubject.asObservable();
  public readonly filterType$: Observable<FilterType> = this.filterTypeSubject.asObservable();

  constructor() {}

  // Getters for current state
  public get currentState(): ChartCoordinationState {
    return this.stateSubject.value;
  }

  public get currentRegion(): string {
    return this.regionSubject.value;
  }

  public get currentYear(): string {
    return this.yearSubject.value;
  }

  public get currentGrouping(): GroupingType {
    return this.groupingSubject.value;
  }

  public get currentDisplayMode(): DisplayMode {
    return this.displayModeSubject.value;
  }

  public get currentFilterType(): FilterType {
    return this.filterTypeSubject.value;
  }

  // Update methods
  public updateRegion(region: string): void {
    const newState = { ...this.currentState, selectedRegion: region };
    this.updateState(newState);
    this.regionSubject.next(region);
  }

  public updateYear(year: string): void {
    const newState = { ...this.currentState, selectedYear: year };
    this.updateState(newState);
    this.yearSubject.next(year);
  }

  public updateGrouping(grouping: GroupingType): void {
    const newState = { ...this.currentState, selectedGrouping: grouping };
    this.updateState(newState);
    this.groupingSubject.next(grouping);
  }

  public updateDisplayMode(displayMode: DisplayMode): void {
    const newState = { ...this.currentState, displayMode: displayMode };
    this.updateState(newState);
    this.displayModeSubject.next(displayMode);
  }

  public updateFilterType(filterType: FilterType): void {
    const newState = { ...this.currentState, filterType: filterType };
    this.updateState(newState);
    this.filterTypeSubject.next(filterType);
  }

  public updateState(state: ChartCoordinationState): void {
    this.stateSubject.next(state);
  }

  // Utility methods
  public resetToDefaults(): void {
    this.updateState(this.initialState);
    this.regionSubject.next(this.initialState.selectedRegion);
    this.yearSubject.next(this.initialState.selectedYear);
    this.groupingSubject.next(this.initialState.selectedGrouping);
    this.displayModeSubject.next(this.initialState.displayMode);
    this.filterTypeSubject.next(this.initialState.filterType);
  }

  // Method to get display title for grouping
  public getGroupingTitle(grouping: GroupingType): string {
    switch (grouping) {
      case GroupingType.HS2:
        return 'HS2';
      case GroupingType.HS4:
        return 'HS4';
      case GroupingType.NAICS2:
        return 'NAICS2';
      case GroupingType.NAICS4:
        return 'NAICS4';
      default:
        return 'HS4';
    }
  }

  // Method to check if grouping is NAICS-based
  public isNaicsGrouping(grouping?: GroupingType): boolean {
    const currentGrouping = grouping || this.currentGrouping;
    return currentGrouping === GroupingType.NAICS2 || currentGrouping === GroupingType.NAICS4;
  }

  // Method to check if grouping is aggregated (2-digit)
  public isAggregatedGrouping(grouping?: GroupingType): boolean {
    const currentGrouping = grouping || this.currentGrouping;
    return currentGrouping === GroupingType.HS2 || currentGrouping === GroupingType.NAICS2;
  }

  // Method to convert string to GroupingType enum
  public parseGroupingType(value: string): GroupingType {
    switch (value.toLowerCase()) {
      case 'hs2':
        return GroupingType.HS2;
      case 'hs4':
        return GroupingType.HS4;
      case 'naics2':
        return GroupingType.NAICS2;
      case 'naics4':
        return GroupingType.NAICS4;
      default:
        return GroupingType.HS4;
    }
  }

  // Method to convert string to DisplayMode enum
  public parseDisplayMode(value: string): DisplayMode {
    switch (value.toLowerCase()) {
      case 'frontier':
        return DisplayMode.FRONTIER;
      case 'four_quads':
        return DisplayMode.FOUR_QUADS;
      default:
        return DisplayMode.DEFAULT;
    }
  }

  // Method to convert string to FilterType enum
  public parseFilterType(value: string): FilterType {
    const numValue = parseInt(value);
    switch (numValue) {
      case 1:
        return FilterType.ALL;
      case 2:
        return FilterType.RCA_ABOVE_1;
      case 3:
        return FilterType.RCA_BETWEEN;
      case 4:
        return FilterType.FRONTIER;
      default:
        return FilterType.ALL;
    }
  }
}