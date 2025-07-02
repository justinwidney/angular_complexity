// treemap-chart.component.ts

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as d3 from 'd3';
import { UnifiedDataService } from '../service/chart-data-service';
import { ChartCoordinationService } from '../service/chart-coordination.service';
import { TreemapChartUtils } from './treemap-chart.utils';
import { 
  TreemapConfig, 
  TreemapNode, 
  TreemapTooltipData,
  RawTreemapItem,
  TreemapDimensions,
  TreemapState
} from './treemap-chart.model';
import { CommonModule } from '@angular/common';

import { ChartUtility, NodeColorOptions, TooltipOptions, SearchableItem } from '../d3_utility/chart-nodes-utility';
import { 
  D3SvgChartUtility, 
  ChartDimensions, 
  SVGConfig, 
  ScaleConfig
} from '../d3_utility/svg-utility';
import { FilterType } from '../feasible/feasible-chart-model';


@Component({
  selector: 'app-treemap-chart',
  template: `
    <div #chartContainer class="treemap-chart-wrapper" id="treediv">
      <!-- Loading indicator -->
      <div *ngIf="loading" class="loading-overlay">
        <div class="loading-spinner">Loading treemap chart data...</div>
      </div>
      
      <!-- Error overlay -->
      <div *ngIf="error" class="error-overlay">
        <div class="error-message">{{ error }}</div>
        <button class="retry-button" (click)="retryLoad()">Retry</button>
      </div>
      
      <!-- Tooltip Container -->
      <div #tooltipContainer id="treemap-tooltip-container" class="tooltip-container"></div>
    </div>
  `,
  styleUrls: ['./treemap-chart.component.scss'],
  imports: [CommonModule]
})
export class TreemapChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef<SVGElement>;
  @ViewChild('tooltipContainer', { static: true }) tooltipContainer!: ElementRef<HTMLDivElement>;

  // Input properties
  @Input() showTooltips: boolean = true;
  @Input() showControls: boolean = true;
  @Input() customConfig?: Partial<TreemapConfig>;
  @Input() showCacheStatus: boolean = false;
  @Input() showDebugInfo: boolean = false;
  @Input() initialDepth: number = 2;

  // Output events
  @Output() nodeClicked = new EventEmitter<TreemapTooltipData>();
  @Output() nodeHovered = new EventEmitter<TreemapTooltipData>();
  @Output() dataUpdated = new EventEmitter<TreemapNode[]>();
  @Output() chartDataLoaded = new EventEmitter<{dataCount: number, totalValue: number}>();

  // Component state
  private destroy$ = new Subject<void>();
  private svg: any;
  private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null = null;
  private treemap: d3.TreemapLayout<any> | null = null;
  private colorScale: d3.ScaleOrdinal<string, string> | null = null;

  private data: any = [];
  private rawData: any = [];
  private hierarchyData: d3.HierarchyRectangularNode<any> | null = null;
  private config!: TreemapConfig;
  private dimensions!: ChartDimensions;


  // Component state
  loading = false;
  error: string | null = null;
  currentRegion: string = '';
  currentYear: string = '';

  // Treemap-specific state
  currentState: TreemapState = {
    currentDepth: 2,
    selectedNode: null,
    hoveredNode: null,
    isAnimating: false
  };

  // Debug info
  debugInfo = {
    nodesCount: 0,
    totalValue: 0,
    dataLength: 0
  };

  constructor(
    private unifiedDataService: UnifiedDataService,
    private coordinationService: ChartCoordinationService,
    private chartUtility: ChartUtility, // NEW: Chart utility
    private d3SvgUtility: D3SvgChartUtility // NEW: D3 SVG utility
  ) {}

  ngOnInit(): void {
    this.initializeConfig();
    this.subscribeToUnifiedService();
    this.subscribeToCoordinationService();
  }

  ngAfterViewInit(): void {
    this.initializeChart();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroyChart();
  }

  /**
   * Initialize configuration using utilities
   */
  private initializeConfig(): void {
    const defaultConfig = TreemapChartUtils.getDefaultConfig();

    this.config = this.customConfig ? 
      TreemapChartUtils.mergeConfigs(defaultConfig, this.customConfig) : 
      defaultConfig;

    // Set initial state
    this.currentState.currentDepth = this.initialDepth;

    // Calculate dimensions
        // Calculate dimensions using utility interface
    const treemapDimensions = TreemapChartUtils.calculateDimensions({
      ...this.config,
    });

    // Convert to utility dimensions format
    this.dimensions = {
      width: this.config.width,
      height: this.config.height,
      margins: {
        top: treemapDimensions.margin.top,
        right: treemapDimensions.margin.right,
        bottom: treemapDimensions.margin.bottom,
        left: treemapDimensions.margin.left
      }
    };
  }

  /**
   * Subscribe to unified data service
   */
  private subscribeToUnifiedService(): void {
    this.unifiedDataService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);

    this.unifiedDataService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => this.error = error);

    this.unifiedDataService.currentRegion$
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => {
        this.currentRegion = region;
        this.loadData();
      });
  }

  /**
   * Subscribe to coordination service
   */
  private subscribeToCoordinationService(): void {
    this.coordinationService.region$
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => {
        this.unifiedDataService.setCurrentRegion(region as any);
      });

    this.coordinationService.year$
      .pipe(takeUntil(this.destroy$))
      .subscribe(year => {
        if (year) {
          this.currentYear = year.toString();
          this.loadData();
        }
      });

    // NEW: Subscribe to product group changes (same as feasible chart)
    this.coordinationService.productGroups$
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        this.updateDisplay(); // Re-render treemap with new product group filtering
      });
  }

  public refreshChart(): void {
    console.log('🔄 Refreshing treemap chart');
    this.loadData();
  }

  /**
   * Load data using unified service - now uses dedicated treemap method
   */
  private loadData(): void {
    const region = this.coordinationService.currentRegion || this.unifiedDataService.getCurrentRegion();
    
    // Use the new dedicated treemap method
    this.unifiedDataService.getTreemapData(region as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.rawData = TreemapChartUtils.cloneData(result.rawData);
          this.processTreemapData(this.rawData);
        },
        error: (error) => {
          console.error("Error loading treemap data:", error);
          this.error = `Failed to load treemap data: ${error.message}`;
        }
      });
  }

  /**
   * NEW: Helper method to check if treemap item belongs to enabled product group
   */
  private isItemInEnabledProductGroup(item: RawTreemapItem): boolean {
    // Get all product groups and filter for enabled ones
    const enabledGroups = this.coordinationService.currentProductGroups.filter(group => group.enabled);
    
    // If all product groups are enabled or none specified, show all items
    if (enabledGroups.length === 0 || enabledGroups.length === this.coordinationService.currentProductGroups.length) {
      return true;
    }

    console.log(item) 
   
    const hs2Code = item.product;

    // Check if item's HS2 code falls within any enabled product group's ranges
    return enabledGroups.some(group => {
      return group.hsCodeRanges.some((range: any) => 
        hs2Code >= range.min && hs2Code <= range.max
      );
    });
  }



  /**
   * Process raw data for treemap - now with product group filtering
   */
  private processTreemapData(rawData: RawTreemapItem[]): void {
    try {
      // Validate data
      if (!TreemapChartUtils.validateTreemapData(rawData)) {
        this.handleError('Invalid treemap data structure');
        return;
      }

      // NEW: Filter data based on enabled product groups
      const filteredData = rawData.filter(item => this.isItemInEnabledProductGroup(item));

      // Group by NAICS (equivalent to your groupBy function)
      const groupedData = TreemapChartUtils.groupByNaics(filteredData);
      const hierarchyRoot = TreemapChartUtils.createTreemapHierarchy(groupedData);
      
      // Create D3 treemap layout
      this.hierarchyData = TreemapChartUtils.createTreemapLayout(
        hierarchyRoot,
        this.dimensions.width - this.dimensions.margins.left - this.dimensions.margins.right,
        this.dimensions.height - this.dimensions.margins.top - this.dimensions.margins.bottom,
        this.config
      );

      // Extract nodes for component use
      this.data = this.hierarchyData.children || [];

      // Calculate debug info
      this.debugInfo.dataLength = filteredData.length; // Use filtered data length
      this.debugInfo.nodesCount = this.data.length;
      this.debugInfo.totalValue = TreemapChartUtils.calculateTotalValue(filteredData);

      // Emit events
      this.chartDataLoaded.emit({
        dataCount: this.data.length,
        totalValue: this.debugInfo.totalValue
      });

      this.dataUpdated.emit(this.data);

      // Render the chart
      this.renderTreemap();

    } catch (error) {
      this.handleError(`Failed to process treemap data: ${error}`);
    }
  }

  /**
   * NEW: Update display when product groups change
   */
  private updateDisplay(): void {
    if (this.rawData && this.rawData.length > 0) {
      // Reprocess data with new product group filters
      this.processTreemapData(this.rawData);
    }
  }


  /**
   * Initialize D3 chart
   */
  private initializeChart(): void {
    try {
      this.svg = d3.select("#treediv")
            .append('svg')
            .attr('width', "100%")
            .attr('height', this.config.height)
            .style("background", this.config.background)
            .attr("class", "feasible")

      this.initializeScales();
      this.setupTooltip();
    } catch (error) {
      this.handleError(`Failed to initialize treemap: ${error}`);
    }
  }

  /**
   * Initialize scales and generators
   */
  private initializeScales(): void {
    this.colorScale = d3.scaleOrdinal<string>()
      .range(this.config.colors);
  }

  /**
   * Setup tooltip
   */
  private setupTooltip(): void {
    this.tooltip = TreemapChartUtils.setupTooltip('#treemap-tooltip-container');
  }

  /**
   * Render the treemap with improved text handling
   */
  private renderTreemap(): void {
    if (!this.hierarchyData || !this.svg) {
      console.warn('No data or SVG to render treemap');
      return;
    }

    // Clear existing content
    this.clearChart();

    // Create main group
    const chartGroup = this.svg.append('g')
      .attr('class', 'treemap-group')
      .attr('transform', `translate(${this.dimensions.margins.left}, ${this.dimensions.margins.top})`);

    // Get leaf nodes (the actual rectangles to display)
    const leaves = this.hierarchyData.leaves();

    // Create rectangles
    const nodes = chartGroup
      .selectAll('.treemap-node')
      .data(leaves)
      .enter()
      .append('g')
      .attr('class', 'treemap-node')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    // Add rectangles
    nodes.append('rect')
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', (d: any) => TreemapChartUtils.getNodeColor(d, this.config.colors))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseover', (event: MouseEvent, d: any) => this.handleMouseover(event, d))
      .on('mousemove', (event: MouseEvent, d: any) => this.handleMousemove(event, d))
      .on('mouseout', (event: MouseEvent, d: any) => this.handleMouseleave(event, d))
      .on('click', (event: MouseEvent, d: any) => this.handleMouseclick(event, d));

    // Add improved labels with clipping and wrapping
    if (this.config.showLabels) {
      TreemapChartUtils.addResponsiveText(nodes, this.config);
    }

    // Update debug info
    this.debugInfo.nodesCount = leaves.length;
    
    console.log(`✅ Treemap rendered: ${this.debugInfo.nodesCount} nodes for year ${this.currentYear}`);

    // Add animation
    if (this.config.animationDuration > 0) {
      nodes.style('opacity', 0)
        .transition()
        .duration(this.config.animationDuration)
        .style('opacity', 1);
    }
  }

  /**
   * Clear chart content
   */
  private clearChart(): void {
    if (this.svg) {
      this.svg.selectAll("*").remove();
    }
  }

  /**
   * Handle mouse events
   */
  private handleMouseover = (event: MouseEvent, d: any): void => {
    if (!this.showTooltips || !this.tooltip) return;
    
    this.tooltip.style('opacity', 1);
  };

  private handleMousemove = (event: MouseEvent, d: any): void => {
    if (!this.showTooltips || !this.tooltip) return;

    const containerElement = this.chartContainer.nativeElement;
    const [containerX, containerY] = d3.pointer(event, containerElement);
    
    const tooltipData: TreemapTooltipData = {
      title: d.data.Title,
      value: d.value || 0,
      naics: d.data.naics,
      description: d.data.Title,
      percentage: this.debugInfo.totalValue > 0 ? 
        ((d.value || 0) / this.debugInfo.totalValue * 100) : 0
    };

    // Position tooltip
    const containerRect = containerElement.getBoundingClientRect();
    const tooltipWidth = 300;
    const tooltipHeight = 120;
    
    let tooltipX = containerX + 15;
    let tooltipY = containerY - 10;
    
    if (tooltipX + tooltipWidth > containerRect.width - 10) {
      tooltipX = containerX - tooltipWidth - 15;
    }
    
    if (tooltipY < 10) {
      tooltipY = containerY + 25;
    }

    // Update tooltip
    this.tooltip
      .html(TreemapChartUtils.createTooltipContent(d, this.debugInfo.totalValue))
      .style('left', tooltipX + 'px')
      .style('top', tooltipY + 'px')
      .style('opacity', 0.9);

    // Emit hover event
    this.nodeHovered.emit(tooltipData);
  };

  private handleMouseleave = (event: MouseEvent, d: any): void => {
    if (this.tooltip) {
      this.tooltip.style('opacity', 0);
    }
  };

  private handleMouseclick = (event: MouseEvent, d: any): void => {
    const tooltipData: TreemapTooltipData = {
      title: d.data.Title,
      value: d.value || 0,
      naics: d.data.naics,
      description: d.data.Title,
      percentage: this.debugInfo.totalValue > 0 ? 
        ((d.value || 0) / this.debugInfo.totalValue * 100) : 0
    };

    this.currentState.selectedNode = d;
    this.nodeClicked.emit(tooltipData);
  };

  /**
   * Depth change handler
   */
  public onDepthChange(): void {
    console.log('Depth changed to:', this.currentState.currentDepth);
    this.renderTreemap();
  }

  /**
   * Reset selection
   */
  public resetSelection(): void {
    this.currentState.selectedNode = null;
    this.renderTreemap();
  }

  /**
   * Error handling
   */
  private handleError(message: string): void {
    this.loading = false;
    this.error = message;
    console.error(message);
  }

  private destroyChart(): void {
    this.clearChart();
    if (this.tooltip) {
      this.tooltip.remove();
    }
  }

  /**
   * Public API methods
   */
  public retryLoad(): void {
    this.error = null;
    this.loadData();
  }

  public refreshData(): void {
    const currentRegion = this.unifiedDataService.getCurrentRegion();
    this.unifiedDataService.clearCache(currentRegion as any);
    this.loadData();
  }

  public isDataCached(): boolean {
    const currentRegion = this.unifiedDataService.getCurrentRegion();
    return this.unifiedDataService.getCachedData(currentRegion as any) !== null;
  }

  public getCurrentRegion(): string {
    return this.unifiedDataService.getCurrentRegion();
  }

  public getCurrentYear(): string {
    return this.currentYear;
  }

  public getChartData(): TreemapNode[] {
    return TreemapChartUtils.cloneData(this.data);
  }

  public isChartReady(): boolean {
    return !this.loading && !this.error && this.data.length > 0;
  }

  public hasData(): boolean {
    return this.data && this.data.length > 0;
  }
}