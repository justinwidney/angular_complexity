import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FilterSection } from './types';
import { ChartComponent } from '../chart/chart.component';
import { ChartSignalService } from '../chart/chart.service';
import { FilterService } from '../filter/filter.service';
import { AccordionFiltersComponent } from '../filter/accordian-fitlers.component';
import { ChipListComponent } from '../filter/chip-list.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProductSpaceChartComponent } from '../productspace/product-space-chart.component';
import { DisplayMode, FeasibleEventData, FilterType, GroupingType } from '../feasible/feasible-chart-model';
import { ChartCoordinationService } from '../service/chart-coordination.service';
import { UnifiedDataService } from '../service/chart-data-service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { FeasibleChartComponent } from '../feasible/feasible-chart.component';
import { OvertimeChartComponent } from '../timeChart/overtime-chart.component';
import { ECIChartComponent } from '../eci/eci-chart.component';
import { TreemapChartComponent } from '../treemap/treemap-chart.component';
import { TableComponent } from '../dataTable/data-table.component';

interface NodeData {
  node: any;
  data: any;
}

interface ChartStats {
  totalSum: number;
  nodeCount: number;
  dataCount: number;
}

interface GroupLabel {
  name: string;
  text: string;
  x: number;
  y: number;
  fontSize?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    MatChipsModule, 
    CommonModule,  
    MatButtonToggleModule,
    ProductSpaceChartComponent, 
    FeasibleChartComponent, 
    OvertimeChartComponent, 
    ECIChartComponent, 
    TreemapChartComponent,
    TableComponent,
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {

  selectedNode: NodeData | null = null;
  hoveredNode: NodeData | null = null;
  chartStats: ChartStats | null = null;
  showLabels: boolean = true;
  customLabels?: Partial<GroupLabel>[] = undefined;
  selectedChartType: string = 'ProductSpace';
  
  // Current selections
  currentRegion: string = 'Alberta';
  currentYear: string = '2022';
  currentGrouping: GroupingType = GroupingType.HS4;
  currentDisplayMode: DisplayMode = DisplayMode.DEFAULT;
  currentFilterType: FilterType = FilterType.ALL;

  // Available years for the selected region
  availableYears: string[] = [];
  
  // Loading states
  isLoadingData: boolean = false;
  dataError: string | null = null;

  // Dashboard stats
  totalValue: string = '$0';
  productCount: number = 0;

  currentDisplayFilter: 'default' | 'frontier' | 'quadrants' = 'default';

  private destroy$ = new Subject<void>();
  private selectionChange$ = new Subject<{type: string, value: string}>();

  @ViewChild('productSpaceChart', { static: false }) productSpaceChart?: ProductSpaceChartComponent;
  @ViewChild('feasibleChart', { static: false }) feasibleChart?: FeasibleChartComponent;
  @ViewChild('overtimeChart', { static: false }) overtimeChart?: OvertimeChartComponent;
  @ViewChild('eciChart', { static: false }) eciChart?: ECIChartComponent;
  @ViewChild('treemapChart', { static: false }) treemapChart?: TreemapChartComponent;

  // Feasible chart properties
  selectedFeasiblePoint: FeasibleEventData | null = null;
  feasibleStats: { dataCount: number, eci: number } | null = null;

  constructor(
    private router: Router, 
    private chartService: ChartSignalService, 
    private filterSvc: FilterService,
    private coordinationService: ChartCoordinationService,
    private unifiedDataService: UnifiedDataService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.chartService.initialize();
    
    // Initialize with default values
    this.initializeServices();
    
    // Subscribe to services
    this.subscribeToServices();
    
    // Load available years for the default region
    this.loadAvailableYears();
    
    // Setup debounced selection changes
    this.setupSelectionChangeHandler();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeServices(): void {
    // Set initial values in services
    this.unifiedDataService.setCurrentRegion(this.currentRegion as any);
    this.unifiedDataService.setCurrentYear(this.currentYear);
    
    // Update coordination service
    this.coordinationService.setRegion(this.currentRegion);
    this.coordinationService.setYear(this.currentYear);
    this.coordinationService.setGrouping(this.currentGrouping);
  }

  private subscribeToServices(): void {
    // Subscribe to coordination service state
    this.coordinationService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.currentRegion = state.selectedRegion;
        this.currentYear = state.selectedYear;
        this.currentGrouping = state.selectedGrouping;
        this.currentDisplayMode = state.displayMode;
        this.currentFilterType = state.filterType;
        this.cdr.markForCheck();
      });

    // Subscribe to unified data service loading state
    this.unifiedDataService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoadingData = loading;
        this.cdr.markForCheck();
      });

    // Subscribe to unified data service error state
    this.unifiedDataService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.dataError = error;
        this.cdr.markForCheck();
      });

    // Subscribe to data changes for updating dashboard stats
    this.unifiedDataService.currentSelection$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ region, year }) => {
        this.updateDashboardStats();
      });
  }

  private setupSelectionChangeHandler(): void {
    // Debounce selection changes to avoid rapid API calls
    this.selectionChange$
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => 
          prev.type === curr.type && prev.value === curr.value
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(({ type, value }) => {
        console.log(`📊 Selection changed: ${type} = ${value}`);
        
        // Refresh the current chart
        this.refreshCurrentChart();
        this.updateDashboardStats();

      });
  }


  private updateDashboardStats(): void {
    // Get stats based on current chart type
    switch (this.selectedChartType) {
      case 'ProductSpace':
        this.unifiedDataService.getProductSpaceData()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.totalValue = this.formatCurrency(data.totalSum);
            this.productCount = data.groupedData.length;
            this.cdr.markForCheck();
          });
        break;

      case 'Feasible':
        this.unifiedDataService.getFeasibleChartData()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.productCount = data.feasibleData.length;
            const totalValue = data.feasibleData.reduce((sum, item) => sum + (item.Value || 0), 0);
            this.totalValue = this.formatCurrency(totalValue);
            this.cdr.markForCheck();
          });
        break;

      case 'Exports':
        this.unifiedDataService.getTreemapData()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.totalValue = this.formatCurrency(data.totalValue);
            this.productCount = data.naicsCount;
            this.cdr.markForCheck();
          });
        break;
    }
  }


  onChange(event: Event, type: string): void {
    const value = (event as CustomEvent).detail.value;
    console.log('Dropdown changed:', type, value);

    switch (type) {
      case 'region':
        this.currentRegion = value;
        this.unifiedDataService.setCurrentRegion(value);
        this.coordinationService.setRegion(value);
        
        // Load available years for the new region
        this.loadAvailableYears();
        
        // Trigger selection change
        this.selectionChange$.next({ type: 'region', value });
        break;

      case 'year':
        this.currentYear = value;
        this.unifiedDataService.setCurrentYear(value);
        this.coordinationService.setYear(value);
        
        // Trigger selection change
        this.selectionChange$.next({ type: 'year', value });
        break;

      case 'grouping':
        const groupingMap: { [key: string]: GroupingType } = {
          'HS2': GroupingType.HS2,
          'HS4': GroupingType.HS4,
          'HS6': GroupingType.HS6
        };
        this.currentGrouping = groupingMap[value] || GroupingType.HS2;
        this.coordinationService.setGrouping(this.currentGrouping);
        
        // Trigger selection change
        this.selectionChange$.next({ type: 'grouping', value });
        break;

      // Legacy support for other dropdowns
      case 'geoA':
        this.chartService.setDropdownA(value);
        this.filterSvc.setDropdown('geoA', value);
        break;

      case 'geoB':
        this.chartService.setDropdownB(value);
        this.filterSvc.setDropdown('geoB', value);
        break;

      case 'survey':
        this.chartService.setSurvey(value);
        break;
    }

    this.cdr.markForCheck();
  }

  private loadAvailableYears(): void {
    this.unifiedDataService.getAvailableYears(this.currentRegion as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (years) => {
          this.availableYears = years;
          console.log(`📅 Available years for ${this.currentRegion}:`, years);
          
          // If current year is not in available years, select the most recent
          if (!years.includes(this.currentYear)) {
            this.currentYear = years[0] || '2022';
            this.unifiedDataService.setCurrentYear(this.currentYear);
            this.coordinationService.setYear(this.currentYear);
          }
          
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to load available years:', error);
        }
      });
  }



  private refreshCurrentChart(): void {

    console.log(`? Refreshin current chart ?`);
    
    // Each chart component should subscribe to the unified data service
    // and auto-refresh when region/year changes
    switch (this.selectedChartType) {
      case 'ProductSpace':
        if (this.productSpaceChart) {
          this.productSpaceChart.refreshChart();
        }
        break;

      case 'Feasible':
        if (this.feasibleChart) {
          //this.feasibleChart.refreshChart();
          //console.log('Feasible chart refreshed');
        }
        break;

      case 'Trends':
        if (this.overtimeChart) {
          this.overtimeChart.refreshChart();
        }
        break;

      case 'Exports':
        if (this.treemapChart) {
          this.treemapChart.refreshChart();
        }
        break;

      case 'ECI':
        if (this.eciChart) {
          this.eciChart.refreshChart();
        }
        break;
    }
  }

  onChartTypeChange(event: MatButtonToggleChange): void {
    this.selectedChartType = event.value;
    console.log('Chart type changed to:', event.value);
    
    
    // Mark for check to update the view
    this.cdr.markForCheck();
  }

  // Event handlers for chart interactions
  onNodeSelected(event: {node: any, data: any}): void {
    console.log('Node selected:', event);
    this.selectedNode = event;
    this.cdr.markForCheck();
  }

  onNodeHovered(event: {node: any, data: any}): void {
    console.log('Node hovered:', event);
    this.hoveredNode = event;
  }

  onRowHighlight(productId: number): void {
    console.log('Highlighting product in table:', productId);
  }

  clearSelection(): void {
    this.selectedNode = null;
    if (this.productSpaceChart) {
      this.productSpaceChart.clearSelections();
    }
    this.cdr.markForCheck();
  }

  // Feasible Chart Event Handlers
  onFeasiblePointSelected(event: {node: any, data: any}): void {
    console.log('Feasible point selected:', event);
  }

  onFeasiblePointHovered(event: {node: any, data: any}): void {
    console.log('Feasible point hovered:', event);
  }

  // Utility methods
  private formatCurrency(value: number): string {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  }

  clearDataCache(): void {
    console.log('🗑️ Clearing data cache');
    this.unifiedDataService.clearCache();
    this.refreshCurrentChart();
  }

  getCacheStatus(): void {
    const status = this.unifiedDataService.getCacheStatus();
    console.log('📊 Cache status:', status);
  }

  getGroupingValue(): string {
    // Map GroupingType enum to string values
    switch (this.currentGrouping) {
      case GroupingType.HS2:
        return 'HS2';
      case GroupingType.HS4:
        return 'HS4';
      case GroupingType.HS6:
        return 'HS6';
      default:
        return 'HS2';
    }
  }

  onFilterChange(filterType: 'default' | 'frontier' | 'quadrants'): void {
    console.log('Filter changed to:', filterType);
    
    this.currentDisplayFilter = filterType;
    
    // Convert filter type to display mode for coordination service
    let displayMode: DisplayMode;
    
    switch (filterType) {
      case 'frontier':
        displayMode = DisplayMode.FRONTIER;
        break;
      case 'quadrants':
        displayMode = DisplayMode.FOUR_QUADS;
        break;
      default:
        displayMode = DisplayMode.DEFAULT;
        break;
    }
    
    // Broadcast the display mode change to all components
    this.coordinationService.setDisplayMode(displayMode);
    
    // Apply specific filters based on chart type
    this.applyChartSpecificFilters(filterType);
  }

  private applyChartSpecificFilters(filterType: string): void {
    switch (this.selectedChartType) {
      case 'Feasible':
        break;
      case 'ProductSpace':
        break;
      case 'Trends':
        break;
      case 'Exports':
        break;
      case 'ECI':
        break;
    }
  }


}