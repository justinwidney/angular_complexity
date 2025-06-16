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
      
      <!-- Category Icons -->
      <div class="icons">
        <div class="icon-row">
          <i class="ph ph-horse" title="Agricultural Products" 
             [class.active]="isCategoryVisible('Animal & Food Products')"
             (click)="toggleCategoryFromIcon('ph-horse')"></i>
          <i class="ph ph-bowl-food" title="Food Products"
             [class.active]="isCategoryVisible('Animal & Food Products')"
             (click)="toggleCategoryFromIcon('ph-bowl-food')"></i>
          <i class="ph ph-sketch-logo" title="Industrial Products"
             [class.active]="isCategoryVisible('Chemicals & Plastics')"
             (click)="toggleCategoryFromIcon('ph-sketch-logo')"></i>
          <i class="ph ph-graph" title="Raw Materials"
             [class.active]="isCategoryVisible('Raw Materials')"
             (click)="toggleCategoryFromIcon('ph-graph')"></i>
          <i class="ph ph-factory" title="Machinery and Equipment"
             [class.active]="isCategoryVisible('Machinery & Electronics')"
             (click)="toggleCategoryFromIcon('ph-factory')"></i>
          <i class="ph ph-sneaker" title="Textiles and Apparel"
             [class.active]="isCategoryVisible('Textiles')"
             (click)="toggleCategoryFromIcon('ph-sneaker')"></i>
          <i class="ph ph-hammer" title="Metals and Metal Products"
             [class.active]="isCategoryVisible('Metals')"
             (click)="toggleCategoryFromIcon('ph-hammer')"></i>
          <i class="ph ph-car" title="Transportation Equipment"
             [class.active]="isCategoryVisible('Transportation')"
             (click)="toggleCategoryFromIcon('ph-car')"></i>
          <i class="ph ph-scissors" title="Miscellaneous Manufactured Products"
             [class.active]="isCategoryVisible('Miscellaneous')"
             (click)="toggleCategoryFromIcon('ph-scissors')"></i>
        </div>
      </div>
      
      <!-- Data Cache Status (optional debug info) -->
      <div *ngIf="showCacheStatus" class="cache-status">
        <small>Data cached: {{ isDataCached() ? 'Yes' : 'No' }} | 
               Current region: {{ getCurrentRegion() }}</small>
      </div>
      
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
  @Input() chartWidth: number = 1440;
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

  // Chart dimensions
  private chartWidthCalculated: number = 0;
  private chartHeightCalculated: number = 0;
  private margin = { top: 20, right: 80, bottom: 30, left: 50 };

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
    // Initialize service with custom config
    this.overtimeService.initializeWithConfig(this.customConfig);
    
    // Get the merged config from service
    this.config = this.overtimeService.getConfig();

    // Use config dimensions or fallback to component inputs
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
        // Set the region in unified service which will trigger data loading
        this.unifiedDataService.setCurrentRegion(region as any);
      });

    // Subscribe to year changes
    this.coordinationService.year$
      .pipe(takeUntil(this.destroy$))
      .subscribe(year => {
        console.log('🔍 Year changed to:', year);
        this.currentYear = year;
        
        // For overtime charts, year changes typically shouldn't filter the data
        // since overtime charts show trends over multiple years
        // Only reprocess if you specifically want year filtering
        if (this.shouldFilterByYear()) {
          console.log('🔍 Reprocessing data due to year change');
          this.reprocessData();
        } else {
          console.log('🔍 Year change ignored for overtime chart - showing all years');
        }
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
          
          // Store raw data for reprocessing
          this.rawData = result.rawData;
          this.originalData = [...result.rawData]; // Clone data
        
          // Use the processed data
          this.data = result.chartData;

          // Emit data loaded event
          const maxValue = this.overtimeService.getMaxTotal(this.data);
          this.debugInfo.maxValue = maxValue;
          this.debugInfo.dataLength = this.data.length;
          
          this.chartDataLoaded.emit({
            dataCount: this.data.length,
            maxValue: maxValue
          });

          this.renderChart();
        },
        error: (error) => {
          console.error("Error loading overtime chart data:", error);
          this.error = `Failed to load chart data: ${error.message}`;
        }
      });
  }

  /**
   * Reprocess data when year changes or other filters change
   */
  private reprocessData(): void {
    if (!this.rawData || this.rawData.length === 0) {
      this.loadData();
      return;
    }

    // For overtime charts, we typically want ALL years, not just the current year
    // Only filter by year if specifically requested
    let filteredData = this.rawData;
    
    if (this.currentYear && this.currentYear !== '' && this.shouldFilterByYear()) {
      filteredData = this.rawData.filter(item => {
        const itemYear = new Date(item.Date).getFullYear().toString();
        return itemYear === this.currentYear;
      });
    } 
    

    this.processData(filteredData);
  }

  /**
   * Determine if we should filter by year for overtime charts
   * Overtime charts typically show trends over time, so filtering by year is usually not desired
   */
  private shouldFilterByYear(): boolean {
    // For now, let's NOT filter by year for overtime charts since they show trends
    // You can change this logic based on your requirements
    return false;
  }

  /**
   * Process raw data into chart format
   */
  private processData(rawData: RawDataItem[]): void {

    try {
      // Store original data
      this.originalData = [...rawData]; // Clone data
      
      // Process data using service
      const groupedData = this.overtimeService.groupByYearAndCategory(rawData);
      this.data = this.overtimeService.transformDataByDate(groupedData);


      // Emit data loaded event
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

  /**
   * Get current region
   */
  public getCurrentRegion(): string {
    return this.unifiedDataService.getCurrentRegion();
  }

  /**
   * Check if a category is currently visible
   */
  public isCategoryVisible(category: string): boolean {
    return this.data.some(d => d[category] && d[category] > 0);
  }

  /**
   * Toggle category from icon click
   */
  public toggleCategoryFromIcon(iconClass: string): void {
    const category = this.overtimeService.getCategoryFromIcon(iconClass);
    if (category) {
      this.toggleCategory(category);
    }
  }

  private initializeChart(): void {
    try {
      // Create D3 SVG selection
      this.svg = d3.select(this.svgContainer.nativeElement);

      // Initialize scales and generators
      this.initializeScales();

    } catch (error) {
      this.handleError(`Failed to initialize chart: ${error}`);
    }
  }

  private initializeScales(): void {
    // Initialize color scale
    this.colorScale = OvertimeChartUtils.createColorScale(this.config.keys, this.config.colors);
    this.stackGenerator = OvertimeChartUtils.createStackGenerator(this.config.keys);

  }

  private renderChart(): void {
    if (!this.data || this.data.length === 0) {
      console.warn('No data to render');
      return;
    }

    console.log('Starting chart render with data:', this.data);

    // Clear existing chart
    this.clearChart();

    // Setup chart elements
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

    console.log('Setting up chart with dimensions:', {
      chartWidth: this.chartWidthCalculated,
      chartHeight: this.chartHeightCalculated,
      margin: this.margin
    });

    // Calculate inner dimensions
    const innerWidth = this.chartWidthCalculated - this.margin.left - this.margin.right;
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

    // Handle single data point case
    if (this.data.length === 1) {
      this.renderSinglePointChart(chartGroup, stackedData);
      return;
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
        console.log(`Area ${d.key} color:`, color);
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

  private renderSinglePointChart(chartGroup: any, stackedData: any[]): void {
    console.log('Rendering single data point as bar chart');
    
    const innerWidth = this.chartWidthCalculated - this.margin.left - this.margin.right;
    const barWidth = Math.min(100, innerWidth * 0.3); // Max 100px or 30% of width
    const xPosition = innerWidth / 2 - barWidth / 2; // Center the bar

    // Create bars instead of areas for single data point
    const bars = chartGroup
      .selectAll(".bar")
      .data(stackedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", xPosition)
      .attr("y", (d: any) => this.yScale!(d[0][1]))
      .attr("width", barWidth)
      .attr("height", (d: any) => {
        const height = this.yScale!(d[0][0]) - this.yScale!(d[0][1]);
        return Math.max(0, height); // Ensure non-negative height
      })
      .style("fill", (d: any) => this.colorScale!(d.key))
      .style("stroke", "#fff")
      .style("stroke-width", 1)
      .on("mouseover", (event: MouseEvent, d: any) => this.handleMouseover(event, d))
      .on("mousemove", (event: MouseEvent, d: any) => this.handleSinglePointMousemove(event, d))
      .on("mouseout", (event: MouseEvent, d: any) => this.handleMouseleave(event, d))
      .on("click", (event: MouseEvent, d: any) => this.handleSinglePointClick(event, d));

    // Update debug info
    this.debugInfo.areasCount = bars.size();
    this.debugInfo.dataLength = this.data.length;
    this.debugInfo.maxValue = this.overtimeService.getMaxTotal(this.data);
    
    console.log(`Rendered ${this.debugInfo.areasCount} bars for single data point`);

    // Add year label
    chartGroup.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', this.chartHeightCalculated - this.margin.top - this.margin.bottom + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('fill', '#333')
      .text(this.data[0].Date);

    // Add warning message
    this.showSinglePointWarning();
  }

  private handleSinglePointMousemove = (event: MouseEvent, d: any): void => {
    if (!this.tooltip || !this.showTooltips) return;

    const dataPoint = this.data[0]; // Only one data point
    const tooltipData: TooltipData = {
      category: d.key,
      value: dataPoint[d.key] || 0,
      year: dataPoint.Date
    };

    // Update tooltip content and position
    this.tooltip
      .html(`${tooltipData.category}: ${this.overtimeService.abbreviateNumber(tooltipData.value)} (${tooltipData.year})`)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 10) + "px")
      .style("opacity", 0.9);

    // Emit hover event
    this.nodeHovered.emit(tooltipData);
  };

  private handleSinglePointClick = (event: MouseEvent, d: any): void => {
    const dataPoint = this.data[0]; // Only one data point
    const tooltipData: TooltipData = {
      category: d.key,
      value: dataPoint[d.key] || 0,
      year: dataPoint.Date
    };

    this.updateInfoBox(tooltipData);
    this.nodeClicked.emit(tooltipData);
  };

  private showSinglePointWarning(): void {
    if (!this.showDebugInfo) return;
    
    // Add warning message to the chart
    const warningGroup = this.svg.select('.warning-group');
    if (warningGroup.empty()) {
      const warning = this.svg.append('g')
        .attr('class', 'warning-group')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top - 5})`);
      
      warning.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .style('font-size', '12px')
        .style('fill', '#ff6600')
        .style('font-weight', 'bold')
        .text('⚠️ Single data point - showing as bar chart. Need multiple years for area chart.');
    }
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

  public clearSelections(): void {
    // Reset any selections
  }

  public updateData(newData: RawDataItem[]): void {
    this.originalData = [...newData];
    this.processData(newData);
  }

  public updateRegion(region: string): void {
    this.coordinationService.setRegion(region);
  }

  public updateYear(year: string): void {
    this.coordinationService.setYear(year);
  }

  public toggleCategory(category: string): boolean {
    if (!this.overtimeService.isValidCategory(category)) {
      console.warn(`Invalid category: ${category}`);
      return false;
    }

    const wasVisible = this.data.some(d => d[category] && d[category] > 0);
    this.data = this.overtimeService.toggleCategory(this.data, this.originalData, category);
    this.updateChart();

    this.categoryToggled.emit({ category, isVisible: !wasVisible });

    return !wasVisible;
  }

  public getChartData(): ChartDataPoint[] {
    return [...this.data];
  }

  public isChartReady(): boolean {
    return !this.loading && !this.error && this.data.length > 0;
  }

  public hasData(): boolean {
    return this.data && this.data.length > 0;
  }

  // New methods for unified service integration
  public getAvailableRegions(): string[] {
    return this.unifiedDataService.getAvailableRegions();
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