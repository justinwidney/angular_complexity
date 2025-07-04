import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, ViewChild, ViewEncapsulation, OnDestroy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProductSpaceChartComponent } from '../productspace/product-space-chart.component';
import { DisplayMode, FeasibleEventData, FilterType, GroupingType } from '../feasible/feasible-chart-model';
import { ChartCoordinationService, FilteredTotals, ProductGroup, SearchSuggestion } from '../service/chart-coordination.service';
import { UnifiedDataService } from '../service/chart-data-service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, filter, skip } from 'rxjs';
import { FeasibleChartComponent } from '../feasible/feasible-chart.component';
import { OvertimeChartComponent } from '../timeChart/overtime-chart.component';
import { ECIChartComponent } from '../eci/eci-chart.component';
import { TreemapChartComponent } from '../treemap/treemap-chart.component';
import { TableComponent } from '../dataTable/data-table.component';
import { EconomicComplexityDefinitionsComponent } from '../definitions/definitions.component';

interface NodeData {
  node: any;
  data: any;
  connectedProducts: string[]
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
    EconomicComplexityDefinitionsComponent
  ],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {

  selectedNode: NodeData | null = null;
  hoveredNode: NodeData | null = null;
  showLabels: boolean = true;
  customLabels?: Partial<GroupLabel>[] = undefined;
  selectedChartType: string = 'ProductSpace';
  

  DisplayMode = DisplayMode;


  // Current selections
  currentRegion: string = 'Alberta';
  currentYear: string = '2023';
  currentGrouping: GroupingType = GroupingType.HS4;

  currentDisplayFilter: 'default' | 'frontier' | 'quadrants' = 'default';
  currentDisplayMode: DisplayMode = DisplayMode.DEFAULT;

  currentFilterType: FilterType = FilterType.ALL;
  filterType : FilterType = FilterType.ALL;
  availableYears: string[] = [];
  
  // Loading states
  isLoadingData: boolean = false;
  dataError: string | null = null;

  // Enhanced dashboard stats with filtered totals
  totalValue: string = '$0';
  productCount: number = 0;


  filteredTotals: FilteredTotals = {
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


  originalTotalValue: string = '$0';
  originalProductCount: number = 0;
  productGroups: ProductGroup[] = [];

  // Search properties (existing)
  currentSearchQuery: string = '';
  searchResultsCount: number = 0;
  searchResults: any[] = [];

  // Enhanced search properties (new)
  searchSuggestions: SearchSuggestion[] = [];
  showSuggestions: boolean = false;
  selectedSuggestionIndex: number = -1;
  isSearchLoading: boolean = false;

  private destroy$ = new Subject<void>();
  private selectionChange$ = new Subject<{type: string, value: string}>();

  // Chart ViewChild references
  @ViewChild('productSpaceChart', { static: false }) productSpaceChart?: ProductSpaceChartComponent;
  @ViewChild('feasibleChart', { static: false }) feasibleChart?: FeasibleChartComponent;
  @ViewChild('overtimeChart', { static: false }) overtimeChart?: OvertimeChartComponent;
  @ViewChild('eciChart', { static: false }) eciChart?: ECIChartComponent;
  @ViewChild('treemapChart', { static: false }) treemapChart?: TreemapChartComponent;

  // Search input reference (new)
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef<HTMLInputElement>;

  // Feasible chart properties
  selectedFeasiblePoint: FeasibleEventData | null = null;
  feasibleStats: { dataCount: number, eci: number } | null = null;

  // Chart data cache for search (new)
  chartData: any[] = [];

  private productGroups$ = this.coordinationService.productGroups$;

  constructor(
    private coordinationService: ChartCoordinationService,
    private unifiedDataService: UnifiedDataService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    //this.chartService.initialize();
    
    // Initialize with default values
    this.initializeServices();
    this.subscribeToServices();
    this.loadAvailableYears();
    
    this.setupSelectionChangeHandler();

    // Load initial data for search
    this.loadChartDataForSearch();
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
    // Existing search query subscription
    this.coordinationService.searchQuery$
      .pipe(
        skip(1),
        takeUntil(this.destroy$))
      .subscribe(query => {
        console.log('Home component received search query:', query);
        this.currentSearchQuery = query;
        this.cdr.markForCheck();
      });

     

    // Existing search results subscription
    this.coordinationService.searchResults$
      .pipe(
        skip(1),
        takeUntil(this.destroy$))
      .subscribe(results => {
        console.log('Home component received search results:', results);
        this.searchResults = results;
        this.searchResultsCount = results.length;
        this.cdr.markForCheck();
      });

    // New search suggestions subscription
    this.coordinationService.searchSuggestions$
      .pipe(
        skip(1),
        takeUntil(this.destroy$))
      .subscribe(suggestions => {
        this.searchSuggestions = suggestions;
        this.showSuggestions = suggestions.length > 0 && this.currentSearchQuery.length > 0;
        this.selectedSuggestionIndex = -1;
        this.cdr.markForCheck();
      });

          // NEW: Subscribe to filtered totals
      this.coordinationService.filteredTotals
      .pipe(
        skip(1),
        takeUntil(this.destroy$))
      .subscribe(filteredTotals => {
        console.log('📊 Home component received filtered totals:', filteredTotals);
        this.filteredTotals = filteredTotals;
        
        // Update dashboard stats with filtered values
        this.updateDashboardStatsFromFilteredTotals();
        this.cdr.markForCheck();
      });

    this.coordinationService.grouping$
      .pipe(
        skip(1), 
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(grouping => {
        this.currentGrouping = grouping;
        this.cdr.detectChanges();
      });


    // NEW: Subscribe to product groups
    this.coordinationService.productGroups
      .pipe(
        skip(1),
        takeUntil(this.destroy$))
      .subscribe(productGroups => {
        console.log('🏷️ Home component received product groups:', productGroups);
        this.productGroups = productGroups;
        this.cdr.markForCheck();
      });


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
        // Reload search data when region/year changes
        this.loadChartDataForSearch();
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
        
        // Refresh the current chart
        this.refreshCurrentChart();
        //this.updateDashboardStats();
      });
  }

  // New method to load chart data for search functionality
  private async loadChartDataForSearch(): Promise<void> {
    try {
      this.isSearchLoading = true;
      
      // Load data based on current chart type
      switch (this.selectedChartType) {
        case 'ProductSpace':
          this.unifiedDataService.getProductSpaceData()
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => {
              this.chartData = data.groupedData || [];
              this.coordinationService.setDataCache(this.chartData);
              this.isSearchLoading = false;
              this.cdr.markForCheck();
            });
          break;

        case 'Feasible':
          this.unifiedDataService.getFeasibleChartData()
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => {
              this.chartData = data.feasibleData || [];
              this.coordinationService.setDataCache(this.chartData);
              this.isSearchLoading = false;
              this.cdr.markForCheck();
            });
          break;

        case 'Exports':
          this.unifiedDataService.getTreemapData()
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => {
              // Flatten treemap data for search
              this.chartData = this.flattenTreemapData(data);
              this.coordinationService.setDataCache(this.chartData);
              this.isSearchLoading = false;
              this.cdr.markForCheck();
            });
          break;

        default:
          // For other chart types, try to get generic data
          this.loadGenericChartData();
          break;
      }
      
    } catch (error) {
      console.error('Error loading chart data for search:', error);
      this.isSearchLoading = false;
      this.cdr.markForCheck();
    }
  }

  private loadGenericChartData(): void {
    // Fallback method to load any available data for search
    this.unifiedDataService.getProductSpaceData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.chartData = data.groupedData || [];
        this.coordinationService.setDataCache(this.chartData);
        this.isSearchLoading = false;
        this.cdr.markForCheck();
      });
  }

  private flattenTreemapData(data: any): any[] {
    // Helper method to flatten hierarchical treemap data for search
    const flattened: any[] = [];
    
    if (data.children) {
      const flattenChildren = (children: any[]) => {
        children.forEach(child => {
          flattened.push(child);
          if (child.children) {
            flattenChildren(child.children);
          }
        });
      };
      flattenChildren(data.children);
    }
    
    return flattened;
  }



  // NEW: Update dashboard stats from filtered totals
  private updateDashboardStatsFromFilteredTotals(): void {
    // Update main display values with filtered totals
    this.totalValue = this.formatCurrency(this.filteredTotals.totalSum);
    this.productCount = this.filteredTotals.productCount;
    
    // Keep track of original values for comparison
    const originalTotal = this.coordinationService.originalTotal;
    this.originalTotalValue = this.formatCurrency(originalTotal);
    this.originalProductCount = this.chartData.length;
    
 
  }


  private updateDashboardStats(): void {
    // Get stats based on current chart type (for original totals)

    switch (this.selectedChartType) {
      case 'ProductSpace':
        this.unifiedDataService.getProductSpaceData()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            // Store original values
            this.originalTotalValue = this.formatCurrency(data.totalSum);
            this.originalProductCount = data.groupedData.length;
            
            // If no filters are active, show original values
            if (!this.filteredTotals.filterSummary.hasActiveFilters) {
              this.totalValue = this.originalTotalValue;
              this.productCount = this.originalProductCount;
            }
            
            this.cdr.markForCheck();
          });
        break;

      case 'Feasible':
        this.unifiedDataService.getFeasibleChartData()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.originalProductCount = data.feasibleData.length;
            const totalValue = data.feasibleData.reduce((sum, item) => sum + (item.Value || 0), 0);
            this.originalTotalValue = this.formatCurrency(totalValue);
            
            if (!this.filteredTotals.filterSummary.hasActiveFilters) {
              this.totalValue = this.originalTotalValue;
              this.productCount = this.originalProductCount;
            }
            
            this.cdr.markForCheck();
          });
        break;

      case 'Exports':

        console.log('Loading treemap data for dashboard stats');

        this.unifiedDataService.getTreemapData()
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.originalTotalValue = this.formatCurrency(data.totalValue);
            this.originalProductCount = data.naicsCount;

            console.log('originalProductCount:', this.originalProductCount);
            
            if (!this.filteredTotals.filterSummary.hasActiveFilters) {
              this.totalValue = this.originalTotalValue;
              this.productCount = this.originalProductCount;
            }
            
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
          'NAICS4': GroupingType.NAICS4,
          'NAICS2': GroupingType.NAICS2,
          'HS2': GroupingType.HS2,
          'HS4': GroupingType.HS4,
        };
        this.currentGrouping = groupingMap[value] || GroupingType.HS2;
        this.coordinationService.setGrouping(this.currentGrouping);
        
        // Trigger selection change
        this.selectionChange$.next({ type: 'grouping', value });
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
    
    // Reload search data when chart refreshes
    this.loadChartDataForSearch();
    
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
  
        }
        break;

      case 'Trends':
        if (this.overtimeChart) {
        }
        break;

      case 'Exports':
        if (this.treemapChart) {
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
    
    // Reload search data for new chart type
    this.loadChartDataForSearch();
    
    // Mark for check to update the view
    this.cdr.markForCheck();
  }



  onRowHighlight(productId: number): void {
    console.log('Highlighting product in table:', productId);
  }

  clearSelection(): void {
    this.selectedNode = null;
    if (this.productSpaceChart) {
      this.productSpaceChart.clearSelections();
    }
    if (this.feasibleChart) {
      this.feasibleChart.clearSelections();
    }
    this.cdr.markForCheck();
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
      case GroupingType.NAICS4:
        return 'NAICS4';
      default:
        return 'HS2';
    }
  }

  onFilterChange(e : Event): void {
    this.currentDisplayFilter =  (e as CustomEvent).detail.value;
    
    switch ((e as CustomEvent).detail.value) {
      case 'frontier':
        break;
      case 'quadrants':

        break;
      case 'advantage':
        this.filterType = FilterType.RCA_ABOVE_1;
        break;
      case 'feasible':
        this.filterType = FilterType.RCA_BETWEEN;
        break;
      case 'default':
        this.filterType = FilterType.ALL;
        break;
      default:
        break;
    }


    // Broadcast the display mode change to all components
    this.coordinationService.setDisplayMode(this.currentDisplayFilter as DisplayMode);
    this.coordinationService.setFilterType(this.filterType);
    
  
  }



  // Enhanced Search event handlers
  onSearchInput(event: any): void {
    const query = event.target?.value || event.detail?.value || '';
    console.log('Search input:', query);
    
    this.currentSearchQuery = query;
    this.selectedSuggestionIndex = -1;
    this.coordinationService.setSearchQuery(query);
    
    // Show suggestions if there's a query
    if (query.trim().length > 0) {
      this.showSuggestions = true;
    } else {
      this.hideSuggestions();
    }
    
    this.cdr.markForCheck();
  }

  onSearchChange(event: any): void {
    const query = event.target?.value || event.detail?.value || '';
    console.log('Search change:', query);
    
    this.coordinationService.setSearchQuery(query);
  }

  // New autocomplete methods
  onSearchKeyDown(event: KeyboardEvent): void {
    if (!this.showSuggestions || this.searchSuggestions.length === 0) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.min(
          this.selectedSuggestionIndex + 1,
          this.searchSuggestions.length - 1
        );
        this.cdr.markForCheck();
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
        this.cdr.markForCheck();
        break;

      case 'Enter':
        event.preventDefault();
        if (this.selectedSuggestionIndex >= 0) {
          this.selectSuggestion(this.searchSuggestions[this.selectedSuggestionIndex]);
        } else {
          this.performSearch();
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.hideSuggestions();
        break;
    }
  }

  selectSuggestion(suggestion: SearchSuggestion): void {
    
    // Update the input field
    this.currentSearchQuery = suggestion.text;
    this.coordinationService.selectSuggestion(suggestion);
    this.hideSuggestions();
    
    // Focus back to input (optional)
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
    
    this.cdr.markForCheck();
  }

  onSuggestionClick(suggestion: SearchSuggestion): void {
    this.selectSuggestion(suggestion);
  }

  onSuggestionMouseEnter(index: number): void {
    this.selectedSuggestionIndex = index;
    this.cdr.markForCheck();
  }

  hideSuggestions(): void {
    this.showSuggestions = false;
    this.selectedSuggestionIndex = -1;
    this.cdr.markForCheck();
  }

  onSearchBlur(): void {
    // Slight delay to allow for suggestion clicks
    setTimeout(() => {
      this.hideSuggestions();
    }, 200);
  }

  onSearchFocus(): void {
    if (this.currentSearchQuery.trim().length > 0 && this.searchSuggestions.length > 0) {
      this.showSuggestions = true;
      this.cdr.markForCheck();
    }
  }

  performSearch(): void {
    this.hideSuggestions();

  }

  clearSearch(): void {
    this.currentSearchQuery = '';
    this.coordinationService.clearSearch();
    this.hideSuggestions();
    
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
    
    this.cdr.markForCheck();
  }

  // Helper methods for suggestions
  getSuggestionDisplayText(suggestion: SearchSuggestion): string {
    switch (suggestion.type) {
      case 'hs_code':
        return `${suggestion.hsCode} - ${suggestion.description}`;
      case 'description':
        return suggestion.description || suggestion.text;
      case 'product_name':
        return suggestion.text;
      default:
        return suggestion.text;
    }
  }


  // Product group toggle methods
  toggleProductGroup(groupId: string): void {
    console.log('🎯 Toggling product group:', groupId);
    this.coordinationService.toggleProductGroup(groupId);
  }

  isProductGroupEnabled(groupId: string): boolean {
    const currentGroups = this.coordinationService.currentProductGroups;
    const group = currentGroups.find(g => g.id === groupId);
    return group ? group.enabled : true;
  }

    // Helper method to get product group color
  getProductGroupColor(groupId: string): string {
    const currentGroups = this.coordinationService.currentProductGroups;
    const group = currentGroups.find(g => g.id === groupId);
    return group?.color || '#ccc';
  }

  // Method to get filter summary for display
  getFilterSummary(): string {
    const filteredTotals = this.coordinationService.currentFilteredTotals;
    const enabledGroups = filteredTotals.filterSummary.enabledProductGroups;
    
    if (enabledGroups.length === 0) {
      return 'No product groups selected';
    } else if (enabledGroups.length === this.coordinationService.currentProductGroups.length) {
      return 'All product groups';
    } else {
      return `${enabledGroups.length} of ${this.coordinationService.currentProductGroups.length} groups`;
    }
  }



  onNodeSelected(event: {node: any, data: any, connectedProducts: string[]}): void {
    console.log('Node selected:', event);
    this.selectedNode = {
      node: event.node,
      data: event.data,
      connectedProducts: event.connectedProducts
    };
    this.cdr.markForCheck();
  }
  
 


  getConnectedProductDescriptions(connectedProductIds: string[]): any[] {
    if (!connectedProductIds || connectedProductIds.length === 0) {
      return [];
    }

    // You'll need access to your chart data here
    // This assumes you have access to the grouped data from your chart service
    return connectedProductIds.map(productId => {
      // Find the product data for each connected product
      const productData = this.chartData.find(item => 
        item.product?.toString() === productId
      );
      
      return {
        id: productId,
        description: productData?.description || `Product ${productId}`,
        value: productData?.Value || 0,
        rca: productData?.rca || 0
      };
    }).slice(0, 5); // Limit to first 5 to avoid overwhelming the UI
  }


  get isNumericSearch(): boolean {
    return /^\d+$/.test(this.currentSearchQuery.trim());
  }

  get searchPlaceholder(): string {
    const grouping = this.coordinationService.currentGrouping;
    const isNumeric = this.isNumericSearch;
    
    if (isNumeric) {
      switch (grouping) {
        case GroupingType.HS2:
          return 'Enter 2-digit HS code (e.g., 01, 02, 03...)';
        case GroupingType.HS4:
          return 'Enter 4-digit HS code (e.g., 0101, 0102...)';
        case GroupingType.HS6:
          return 'Enter 6-digit HS code (e.g., 010121, 010129...)';
        default:
          return 'Enter HS code or product description';
      }
    }
    
    return 'Search for product';
  }
}