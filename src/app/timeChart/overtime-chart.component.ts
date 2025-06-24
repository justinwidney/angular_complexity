// debugged-overtime-chart.component.ts

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import * as d3 from 'd3';
import { UnifiedDataService } from '../service/chart-data-service'; // Import unified service
import { OvertimeChartService } from './overtime-chart.service'; // Keep for utility methods
import { OvertimeChartUtils } from './overtime-chart.utils';
import { ChartCoordinationService } from '../service/chart-coordination.service';
import { 
  ChartConfig, 
  ChartDataPoint, 
  RawDataItem, 
  RemappedDataPoint, 
  TooltipData,
  ChartEvents
} from './overtime-chart.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overtime-chart',
  template: `
    <div #chartContainer class="overtime-chart-wrapper">
      <!-- Loading indicator -->
      <div *ngIf="loading" class="loading-overlay">
        <div class="loading-spinner">Loading overtime chart data...</div>
      </div>
      
      <!-- Error display -->
      <div *ngIf="error" class="error-overlay">
        <div class="error-message">{{ error }}</div>
        <button (click)="retryLoad()" class="retry-button">Retry</button>
      </div>

      <!-- Chart Container -->
      <div class="chart-container" [style.opacity]="loading ? 0.5 : 1">
        <svg #svgContainer [attr.width]="chartWidth" [attr.height]="chartHeight"></svg>
      </div>
      
      <!-- Tooltip Container -->
      <div #tooltipContainer id="overtime-tooltip-container" class="tooltip-container"></div>
  `,
  styleUrls: ['./overtime-chart.component.scss'],
  imports: [CommonModule]
})
export class OvertimeChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef<SVGElement>;
  @ViewChild('tooltipContainer', { static: true }) tooltipContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('dataTable', { static: false }) dataTable?: ElementRef<HTMLTableElement>;

  // Input properties
  @Input() showTooltips: boolean = true;
  @Input() enableCategoryToggling: boolean = true;
  @Input() enableDataTable: boolean = true;
  @Input() chartWidth: number = 1342;
  @Input() chartHeight: number = 650;
  @Input() customConfig?: Partial<ChartConfig>;
  @Input() showCacheStatus: boolean = false; // Debug option
  @Input() showDebugInfo: boolean = false; // Debug option

  // Output events
  @Output() categoryToggled = new EventEmitter<{category: string, isVisible: boolean}>();
  @Output() nodeClicked = new EventEmitter<TooltipData>();
  @Output() nodeHovered = new EventEmitter<TooltipData>();
  @Output() dataUpdated = new EventEmitter<RemappedDataPoint[]>();
  @Output() chartDataLoaded = new EventEmitter<{dataCount: number, maxValue: number}>();

  // Component state
  private destroy$ = new Subject<void>();
  private svg: any;
  private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null = null;
  private xScale: d3.ScaleLinear<number, number> | null = null;
  private yScale: d3.ScaleLinear<number, number> | null = null;
  private yAxis: any;
  private colorScale: d3.ScaleOrdinal<string, string> | null = null;
  private stackGenerator: d3.Stack<any, any, string> | null = null;
  private areaGenerator: d3.Area<any> | null = null;

  private data: ChartDataPoint[] = [];
  private originalData: RawDataItem[] = [];
  private rawData: RawDataItem[] = []; // Store raw data for reprocessing
  private config!: ChartConfig;
  private dataTableInstance: any = null;

  // NEW: Product group filtering
  private enabledProductGroups: any[] = [];

  // Chart dimensions
  private chartWidthCalculated: number = 0;
  private chartHeightCalculated: number = 0;
  private margin = { top: 20, right: 0, bottom: 30, left: 50 };

  // State from unified service
  loading = false;
  error: string | null = null;
  currentRegion: string = '';
  currentYear: string = '';

  // Debug info
  debugInfo = {
    areasCount: 0,
    maxValue: 0,
    dataLength: 0
  };

  constructor(
    private unifiedDataService: UnifiedDataService, // Inject unified service
    private overtimeService: OvertimeChartService, // Inject overtime service
    private coordinationService: ChartCoordinationService
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
   * Subscribe to unified data service for loading states and errors
   */
  private subscribeToUnifiedService(): void {
    // Subscribe to loading state
    this.unifiedDataService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    // Subscribe to error state
    this.unifiedDataService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.error = error;
      });

    // Subscribe to current region changes
    this.unifiedDataService.currentRegion$
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => {
        this.currentRegion = region;
        this.loadData();
      });
  }

  private initializeConfig(): void {
    this.overtimeService.initializeWithConfig(this.customConfig);
    this.config = this.overtimeService.getConfig();

    const dimensions = this.overtimeService.getDimensions();
    this.chartWidthCalculated = this.chartWidth || dimensions.width;
    this.chartHeightCalculated = this.chartHeight || dimensions.height;
    this.margin = dimensions.margin;
  }

  private subscribeToCoordinationService(): void {
    // Subscribe to region changes
    this.coordinationService.region$
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => {
        this.unifiedDataService.setCurrentRegion(region as any);
      });

    // NEW: Subscribe to product group changes (same as feasible chart)
    this.coordinationService.productGroups$
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        this.enabledProductGroups = productGroups.filter(group => group.enabled);
        console.log('Product groups changed in overtime chart:', this.enabledProductGroups);
        this.updateDisplay(); // Re-process and re-render chart with new product group filtering
      });
  }

  /**
   * Load data using unified data service
   */
  private loadData(): void {
    const region = this.coordinationService.currentRegion || this.unifiedDataService.getCurrentRegion();

    this.unifiedDataService.getOvertimeChartData(region as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.rawData = result.rawData;
          this.originalData = [...result.rawData]; // Clone data
        
          // NEW: Apply product group filtering if enabled
          this.processDataWithFiltering();
        },
        error: (error) => {
          console.error("Error loading overtime chart data:", error);
          this.error = `Failed to load chart data: ${error.message}`;
        }
      });
  }

  /**
   * NEW: Process data with product group filtering
   */
  private processDataWithFiltering(): void {
    try {
      // Apply product group filtering to raw data
      let filteredData = this.rawData;
      
      if (this.enabledProductGroups && this.enabledProductGroups.length > 0) {
        // Check if all product groups are enabled
        const allProductGroups = this.coordinationService.currentProductGroups || [];
        const allEnabled = this.enabledProductGroups.length === allProductGroups.length;
        
        if (!allEnabled) {
          // Filter data by enabled product groups
          filteredData = this.overtimeService.filterByProductGroups(this.rawData, this.enabledProductGroups);
          console.log(`Filtered overtime data: ${this.rawData.length} → ${filteredData.length} items`);
        }
      }

      // Process filtered data
      this.data = this.overtimeService.processRawDataToChart(filteredData);

      const maxValue = this.overtimeService.getMaxTotal(this.data);
      this.debugInfo.maxValue = maxValue;
      this.debugInfo.dataLength = this.data.length;
      
      this.chartDataLoaded.emit({
        dataCount: this.data.length,
        maxValue: maxValue
      });

      this.renderChart();

    } catch (error) {
      this.handleError(`Failed to process data: ${error}`);
    }
  }

  /**
   * NEW: Update display when product groups change
   */
  private updateDisplay(): void {
    if (this.rawData && this.rawData.length > 0) {
      // Reprocess data with new product group filters
      this.processDataWithFiltering();
    }
  }

  

  /**
   * Retry loading data
   */
  public retryLoad(): void {
    this.error = null;
    this.loadData();
  }

  /**
   * Refresh data by clearing cache
   */
  public refreshData(): void {
    const currentRegion = this.unifiedDataService.getCurrentRegion();
    this.unifiedDataService.clearCache(currentRegion as any);
    this.loadData();
  }

  /**
   * Check if data is cached
   */
  public isDataCached(): boolean {
    const currentRegion = this.unifiedDataService.getCurrentRegion();
    return this.unifiedDataService.getCachedData(currentRegion as any) !== null;
  }

  private initializeChart(): void {
    try {
      this.svg = d3.select(this.svgContainer.nativeElement);
      this.initializeScales();
    } catch (error) {
      this.handleError(`Failed to initialize chart: ${error}`);
    }
  }

  private initializeScales(): void {
    this.colorScale = OvertimeChartUtils.createColorScale(this.config.keys, this.config.colors);
    this.stackGenerator = OvertimeChartUtils.createStackGenerator(this.config.keys);
  }

  private renderChart(): void {
    if (!this.data || this.data.length === 0) {
      console.warn('No data to render');
      return;
    }
    this.clearChart();
    this.setupChart();
    this.renderAreas();
  }

  private clearChart(): void {
    if (this.svg) {
      this.svg.selectAll("*").remove();
    }
  }

  private setupChart(): void {
    if (!this.svg) return;

    // Calculate inner dimensions
    const innerWidth = this.chartWidthCalculated - this.margin.left ;
    const innerHeight = this.chartHeightCalculated - this.margin.top - this.margin.bottom;

    const maxTotal = this.overtimeService.getMaxTotal(this.data);

    this.xScale = OvertimeChartUtils.createXScale(this.data, innerWidth);
    this.yScale = OvertimeChartUtils.createYScale(maxTotal, innerHeight);
    
    // Create area generator
    this.areaGenerator = d3.area<any>()
      .x((d: any) => this.xScale!(d.data.Date))
      .y0((d: any) => this.yScale!(d[0]))
      .y1((d: any) => this.yScale!(d[1]))
      .curve(d3.curveMonotoneX);

    // Setup tooltip
    this.setupTooltip();

    // Add axes
    this.addAxes();
  }

  private setupTooltip(): void {
    // Remove existing tooltip
    d3.select('#overtime-tooltip-container').selectAll('.tooltip').remove();
    
    // Create new tooltip
    this.tooltip = d3.select('#overtime-tooltip-container')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 33, 69, 0.9)')
      .style('color', 'white')
      .style('padding', '10px')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('font-size', '14px')
      .style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)')
      .style('max-width', '300px')
      .style('z-index', '1000');
  }

  private addAxes(): void {
    if (!this.svg || !this.xScale || !this.yScale) return;

    // Create main chart group
    const chartGroup = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Y axis
    this.yAxis = chartGroup.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(this.yScale).tickFormat((d: any) => {
        return this.formatAxisValue(d);
      }));

    // X axis
    chartGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${this.chartHeightCalculated - this.margin.top - this.margin.bottom})`)
      .call(d3.axisBottom(this.xScale)
        .ticks(5)
        .tickFormat(d3.format("d")));

    console.log('Axes added');
  }

  private formatAxisValue(value: number): string {
    return this.overtimeService.abbreviateNumber(value);
  }

  private renderAreas(): void {
    if (!this.svg || !this.stackGenerator || !this.areaGenerator || !this.colorScale) {
      console.error('Missing required components for rendering areas');
      return;
    }

    // Generate stacked data
    const stackedData = this.stackGenerator(this.data);

    if (!stackedData || stackedData.length === 0) {
      console.warn('No stacked data generated');
      return;
    }

    // Create chart group if it doesn't exist
    let chartGroup = this.svg.select('.chart-group');
    if (chartGroup.empty()) {
      chartGroup = this.svg.append('g')
        .attr('class', 'chart-group')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }


    // Create areas for multiple data points
    const areas = chartGroup
      .selectAll(".area")
      .data(stackedData)
      .enter()
      .append("path")
      .attr("class", "area")
      .style("fill", (d: any) => {
        const color = this.colorScale!(d.key);
        return color;
      })
      .style("stroke", "none")
      .attr("d", (d: any) => {
        const path = this.areaGenerator!(d);
        console.log(`Area ${d.key} path:`, path);
        return path;
      })
      .on("mouseover", (event: MouseEvent, d: any) => this.handleMouseover(event, d))
      .on("mousemove", (event: MouseEvent, d: any) => this.handleMousemove(event, d))
      .on("mouseout", (event: MouseEvent, d: any) => this.handleMouseleave(event, d))
      .on("click", (event: MouseEvent, d: any) => this.handleMouseclick(event, d));
  }



  private updateChart(): void {
    if (!this.svg || !this.stackGenerator || !this.areaGenerator || !this.yScale || !this.yAxis) return;

    // Recalculate scales
    const maxTotal = this.overtimeService.getMaxTotal(this.data);
    const innerHeight = this.chartHeightCalculated - this.margin.top - this.margin.bottom;
    
    this.yScale.domain([0, maxTotal]);

    // Update Y axis
    this.yAxis.transition()
      .duration(750)
      .call(d3.axisLeft(this.yScale).tickFormat((d: any) => this.formatAxisValue(d)));

    // Update areas
    const stackedData = this.stackGenerator(this.data);
    
    this.svg.select('.chart-group')
      .selectAll(".area")
      .data(stackedData)
      .transition()
      .duration(750)
      .attr("d", this.areaGenerator);
  }

  // Mouse event handlers
  private handleMouseover = (event: MouseEvent, d: any): void => {
    if (this.tooltip) {
      this.tooltip
        .style("opacity", 1)
        .style("display", "block");
    }
  };

  private handleMousemove = (event: MouseEvent, d: any): void => {
    if (!this.tooltip || !this.xScale || !this.showTooltips) return;

    // Get mouse position relative to the chart container and SVG
    // This approach prevents tooltips from going offscreen by using container-relative positioning
    const svgElement = this.svg.node();
    const containerElement = this.chartContainer.nativeElement;
    
    // Get coordinates relative to SVG for data calculation
    const [mouseX, mouseY] = d3.pointer(event, svgElement);
    const adjustedMouseX = mouseX - this.margin.left;
        
    // Find closest data point
    const year = Math.round(this.xScale.invert(adjustedMouseX));
    const dataPoint = this.data.find(dp => dp.Date === year);

    const stackedData = this.stackGenerator!(this.data);
    const categoryStack = stackedData.find(stack => stack.key === d.key);
    const dataPointInStack = categoryStack?.find(point => point.data.Date === year);

    
    if (dataPoint) {
      const tooltipData: TooltipData = {
        category: d.key,
        value: dataPoint[d.key] || 0,
        year: year
      };

      const point = svgElement.createSVGPoint();
      point.x = this.xScale(year); // X coordinate from year
      point.y = this.yScale!((dataPointInStack![0] + dataPointInStack![1]) / 2); // Y coordinate at middle of stack segment
      
      // Apply any zoom/pan transforms (if you have zoom functionality)
      const transform = d3.zoomTransform(svgElement);
      const transformedX = point.x * transform.k + transform.x + this.margin.left;
      const transformedY = point.y * transform.k + transform.y + this.margin.top;

      // Update tooltip content and position relative to container
      this.tooltip
        .html(`${tooltipData.category}: ${this.overtimeService.abbreviateNumber(tooltipData.value)} (${tooltipData.year})`)
        .style("left", transformedX + "px")
        .style("top", transformedY + "px")
        .style("opacity", 0.9);

      // Update hover line using direct positioning
      const hoverLine = d3.select("#hover-line");
      if (!hoverLine.empty()) {
        hoverLine
          .attr("x1", adjustedMouseX)
          .attr("x2", adjustedMouseX)
          .style("opacity", 1);
      }

      // Emit hover event
      this.nodeHovered.emit(tooltipData);
    }
  };

  private handleMouseleave = (event: MouseEvent, d: any): void => {
    if (this.tooltip) {
      this.tooltip.style("opacity", 0);
    }
  };

  private handleMouseclick = (event: MouseEvent, d: any): void => {
    if (!this.xScale) return;

    // Get mouse position relative to the chart
    const [mouseX] = d3.pointer(event, this.svg.node());
    const adjustedMouseX = mouseX - this.margin.left;
    
    // Find closest data point
    const year = Math.round(this.xScale.invert(adjustedMouseX));
    const dataPoint = this.data.find(dp => dp.Date === year);
    
    if (dataPoint) {
      const tooltipData: TooltipData = {
        category: d.key,
        value: dataPoint[d.key] || 0,
        year: year
      };

      this.updateInfoBox(tooltipData);

      // Emit click event
      this.nodeClicked.emit(tooltipData);
    }
  };

  private updateInfoBox(data: TooltipData): void {
    const infoBox = document.getElementById('info-box');
    if (infoBox) {
      infoBox.style.visibility = "visible";
    }

    const elements = {
      title: document.getElementById("ProductTitle"),
      description: document.getElementById("ProductDescription"),
      trade: document.getElementById("CountryTrade"),
      rca: document.getElementById("RCA"),
      pci: document.getElementById("PCI")
    };

    if (elements.title) {
      elements.title.innerHTML = data.category;
    }
    
    if (elements.description) {
      const mapping = this.config.iconMapping[data.category];
      elements.description.innerHTML = mapping 
        ? `HS ${mapping.min} - ${mapping.max}` 
        : "Unknown mapping";
    }
    
    if (elements.trade) {
      elements.trade.innerHTML = `$${this.overtimeService.abbreviateNumber(data.value)}`;
    }
    
    if (elements.rca) {
      elements.rca.innerHTML = "---";
    }
    
    if (elements.pci) {
      elements.pci.innerHTML = "---";
    }
  }

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

  // Public API methods for parent component
  public refreshChart(): void {
    this.loadData();
  }

  public isChartReady(): boolean {
    return !this.loading && !this.error && this.data.length > 0;
  }

  public getCacheStatus(): any[] {
    return this.unifiedDataService.getCacheStatus();
  }

  public preloadRegions(regions: string[]): void {
    this.unifiedDataService.preloadRegions(regions as any[])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('Regions preloaded for overtime chart');
      });
  }

 

}