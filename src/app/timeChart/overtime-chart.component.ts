// enhanced-overtime-chart.component.ts

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { distinctUntilChanged, map, Observable, skip, Subject, takeUntil } from 'rxjs';
import * as d3 from 'd3';
import { UnifiedDataService } from '../service/chart-data-service';
import { OvertimeChartService } from './overtime-chart.service';
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
import { GroupingType } from './../feasible/feasible-chart-model';

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
  @Input() chartWidth: number = 1342;
  @Input() chartHeight: number = 650;
  @Input() customConfig?: Partial<ChartConfig>;
  @Input() showCacheStatus: boolean = false;
  @Input() showDebugInfo: boolean = false;

  // Output events
  @Output() categoryToggled = new EventEmitter<{category: string, isVisible: boolean}>();
  @Output() nodeClicked = new EventEmitter<TooltipData>();
  @Output() nodeHovered = new EventEmitter<TooltipData>();
  @Output() dataUpdated = new EventEmitter<RemappedDataPoint[]>();
  @Output() chartDataLoaded = new EventEmitter<{dataCount: number, maxValue: number}>();

  // Component state
  private destroy$ = new Subject<void>();
  private svg: any;
  private chartGroup: any;
  private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null = null;
  private xScale: d3.ScaleLinear<number, number> | null = null;
  private yScale: d3.ScaleLinear<number, number> | null = null;
  private yAxis: any;
  private colorScale: d3.ScaleOrdinal<string, string> | null = null;
  private stackGenerator: d3.Stack<any, any, string> | null = null;
  private areaGenerator: d3.Area<any> | null = null;

  // NEW: Interactive elements
  private verticalLine: any;
  private horizontalTopLine: any;
  private horizontalBottomLine: any;
  private yearLabel: any;
  private topValueLabel: any;
  private bottomValueLabel: any;
  private interactionOverlay: any;

  private data: ChartDataPoint[] = [];
  private originalData: RawDataItem[] = [];
  private rawData: RawDataItem[] = [];
  private config!: ChartConfig;
  private dataTableInstance: any = null;

  // Product group filtering
  private enabledProductGroups: any[] = [];
  private currentGrouping: GroupingType = GroupingType.HS4;

  // Chart dimensions
  private chartWidthCalculated: number = 0;
  private chartHeightCalculated: number = 0;
  private margin = { top: 20, right: 0, bottom: 30, left: 50 };

  // State from unified service
  loading = false;
  error: string | null = null;
  currentRegion: string = '';
  currentYear: string = '';


  constructor(
    private unifiedDataService: UnifiedDataService,
    private overtimeService: OvertimeChartService,
    private coordinationService: ChartCoordinationService
  ) {}

  ngOnInit(): void {
    this.initializeConfig();
    this.subscribeToUnifiedService();
    this.subscribeToCoordinationService();
    this.coordinationService.setGrouping(GroupingType.HS2);
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

  private subscribeToUnifiedService(): void {
    this.unifiedDataService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    this.unifiedDataService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.error = error;
      });

    this.coordinationService.grouping$
      .pipe(
        skip(1), 
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(grouping => {
        this.currentGrouping = grouping;
        this.loadData();
      });

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
    this.coordinationService.region$
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => {
        this.unifiedDataService.setCurrentRegion(region as any);
      });

    this.coordinationService.productGroups$
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        this.enabledProductGroups = productGroups.filter(group => group.enabled);
        console.log('Product groups changed in overtime chart:', this.enabledProductGroups);
        this.updateDisplay();
      });
  }

  private loadData(): void {
    const region = this.coordinationService.currentRegion || this.unifiedDataService.getCurrentRegion();

    this.unifiedDataService.getOvertimeChartData(region as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.rawData = result.rawData;
          this.originalData = [...result.rawData];
          this.processDataWithFiltering();
        },
        error: (error) => {
          console.error("Error loading overtime chart data:", error);
          this.error = `Failed to load chart data: ${error.message}`;
        }
      });
  }

  private processDataWithFiltering(): void {
    try {
      let filteredData = this.rawData;
      
      if (this.enabledProductGroups && this.enabledProductGroups.length > 0) {
        const allProductGroups = this.coordinationService.currentProductGroups || [];
        const allEnabled = this.enabledProductGroups.length === allProductGroups.length;
        
        if (!allEnabled) {
          filteredData = this.overtimeService.filterByProductGroups(this.rawData, this.enabledProductGroups);
          console.log(`Filtered overtime data: ${this.rawData.length} → ${filteredData.length} items`);
        }
      }

      this.data = this.overtimeService.processRawDataToChart(filteredData);

      this.renderChart();

    } catch (error) {
      this.handleError(`Failed to process data: ${error}`);
    }
  }

  private updateDisplay(): void {
    if (this.rawData && this.rawData.length > 0) {
      this.processDataWithFiltering();
    }
  }

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
    this.setupInteractiveElements();
  }

  private clearChart(): void {
    if (this.svg) {
      this.svg.selectAll("*").remove();
    }
  }

  private setupChart(): void {
    if (!this.svg) return;

    const innerWidth = this.chartWidthCalculated - this.margin.left;
    const innerHeight = this.chartHeightCalculated - this.margin.top - this.margin.bottom;

    const maxTotal = this.overtimeService.getMaxTotal(this.data);

    this.xScale = OvertimeChartUtils.createXScale(this.data, innerWidth);
    this.yScale = OvertimeChartUtils.createYScale(maxTotal, innerHeight);
    
    this.areaGenerator = d3.area<any>()
      .x((d: any) => this.xScale!(d.data.Date))
      .y0((d: any) => this.yScale!(d[0]))
      .y1((d: any) => this.yScale!(d[1]))
      .curve(d3.curveMonotoneX);

    this.setupTooltip();
    this.addAxes();
  }

  private setupTooltip(): void {
    d3.select('#overtime-tooltip-container').selectAll('.tooltip').remove();
    
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

    this.chartGroup = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // Y axis
    this.yAxis = this.chartGroup.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(this.yScale).tickFormat((d: any) => {
        return this.formatAxisValue(d);
      }));

    // X axis
    this.chartGroup.append("g")
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

    const stackedData = this.stackGenerator(this.data);

    if (!stackedData || stackedData.length === 0) {
      console.warn('No stacked data generated');
      return;
    }

    if (!this.chartGroup) {
      this.chartGroup = this.svg.append('g')
        .attr('class', 'chart-group')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

    const areas = this.chartGroup
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
      });
  }

  // NEW: Setup interactive elements
  private setupInteractiveElements(): void {
    if (!this.chartGroup || !this.xScale || !this.yScale) return;

    const innerHeight = this.chartHeightCalculated - this.margin.top - this.margin.bottom;

    // Create vertical line (initially hidden)
    this.verticalLine = this.chartGroup
      .append("line")
      .attr("class", "vertical-guide-line")
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .style("stroke", "#2c3e50")
      .style("stroke-width", 2)
      .style("opacity", 0)
      .style("pointer-events", "none");

    // Create horizontal lines (initially hidden)
    this.horizontalTopLine = this.chartGroup
      .append("line")
      .attr("class", "horizontal-guide-line-top")
      .attr("x1", 0)
      .attr("x2", -this.margin.left + 10)
      .style("stroke", "#444")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0)
      .style("pointer-events", "none");

    this.horizontalBottomLine = this.chartGroup
      .append("line")
      .attr("class", "horizontal-guide-line-bottom")
      .attr("x1", 0)
      .attr("x2", -this.margin.left + 10)
      .style("stroke", "#444")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0)
      .style("pointer-events", "none");

    // Create year label (initially hidden)
    this.yearLabel = this.chartGroup
      .append("text")
      .attr("class", "year-label")
      .attr("y", innerHeight + 20)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#2c3e50")
      .style("opacity", 0)
      .style("pointer-events", "none");

    // Create value labels (initially hidden)
    this.topValueLabel = this.chartGroup
      .append("text")
      .attr("class", "top-value-label")
      .attr("x", -10)
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#7f8c8d")
      .style("opacity", 0)
      .style("pointer-events", "none");

    this.bottomValueLabel = this.chartGroup
      .append("text")
      .attr("class", "bottom-value-label")
      .attr("x", -10)
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#7f8c8d")
      .style("opacity", 0)
      .style("pointer-events", "none");

    // Create invisible overlay for mouse interactions
    this.interactionOverlay = this.chartGroup
      .append("rect")
      .attr("class", "interaction-overlay")
      .attr("width", this.chartWidthCalculated - this.margin.left)
      .attr("height", innerHeight)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", (event: MouseEvent) => this.handleChartMouseMove(event))
      .on("mouseleave", () => this.hideInteractiveElements())
  }

  // NEW: Handle mouse movement over chart
  private handleChartMouseMove = (event: MouseEvent): void => {
    if (!this.xScale || !this.yScale || !this.stackGenerator) return;

    const [mouseX, mouseY] = d3.pointer(event, this.chartGroup.node());
    
    // Snap to nearest year
    const year = Math.round(this.xScale.invert(mouseX));
    const snappedX = this.xScale(year);
    
    // Find data for this year
    const dataPoint = this.data.find(d => d.Date === year);
    if (!dataPoint) return;

    // Generate stacked data to find which segment we're hovering over
    const stackedData = this.stackGenerator(this.data);
    const stackedDataPoint = stackedData.map(layer => 
      layer.find(d => d.data.Date === year)
    ).filter(d => d !== undefined);

    // Find which segment the mouse is over
    let hoveredSegment: any = null;
    let segmentKey = '';
    
    for (let i = 0; i < stackedDataPoint.length; i++) {
      const segment = stackedDataPoint[i];
      if (segment) {
        const y0 = this.yScale(segment[0]);
        const y1 = this.yScale(segment[1]);
        
        if (mouseY >= y1 && mouseY <= y0) {
          hoveredSegment = segment;
          segmentKey = stackedData[i].key;
          break;
        }
      }
    }

    if (hoveredSegment && segmentKey) {
      this.showInteractiveElements(snappedX, year, hoveredSegment, segmentKey, dataPoint);
    }
  };

  // NEW: Show interactive elements
  private showInteractiveElements(x: number, year: number, segment: any, segmentKey: string, dataPoint: ChartDataPoint): void {
    if (!this.yScale) return;

    const topY = this.yScale(segment[1]);
    const bottomY = this.yScale(segment[0]);
    const segmentValue = segment[1] - segment[0];
    const midY = (topY + bottomY) / 2;

    // Show vertical line
    this.verticalLine
      .attr("x1", x)
      .attr("x2", x)
      .style("opacity", 0.8);

    // Show horizontal lines extending from y-axis to current mouse position
    this.horizontalTopLine
      .attr("x1", -this.margin.left + 5)
      .attr("x2", x)
      .attr("y1", topY)
      .attr("y2", topY)
      .style("opacity", 0.9);

    this.horizontalBottomLine
      .attr("x1", -this.margin.left + 5)
      .attr("x2", x)
      .attr("y1", bottomY)
      .attr("y2", bottomY)
      .style("opacity", 0.9);

    // Show year label
    this.yearLabel
      .attr("x", x)
      .text(year.toString())
      .style("opacity", 1);

    // Show single value label for the segment value at the middle
    this.topValueLabel
      .attr("x", -15)
      .attr("y", midY + 4)
      .text(this.overtimeService.abbreviateNumber(segmentValue))
      .style("opacity", 1);

    // Hide bottom value label since we're only showing one value
    this.bottomValueLabel.style("opacity", 0);

    // Update tooltip
    if (this.tooltip && this.showTooltips) {
      const tooltipData: TooltipData = {
        category: segmentKey,
        value: segmentValue,
        year: year
      };

      this.tooltip
        .html(`
          <div><strong>${segmentKey}</strong></div>
          <div>Value: ${this.overtimeService.abbreviateNumber(segmentValue)}</div>
          <div>Year: ${year}</div>
        `)
        .style("left", (x + this.margin.left + 10) + "px")
        .style("top", (midY + this.margin.top) + "px")
        .style("opacity", 0.9);

      this.nodeHovered.emit(tooltipData);
    }
  }

  // NEW: Hide interactive elements
  private hideInteractiveElements(): void {
    if (this.verticalLine) this.verticalLine.style("opacity", 0);
    if (this.horizontalTopLine) this.horizontalTopLine.style("opacity", 0);
    if (this.horizontalBottomLine) this.horizontalBottomLine.style("opacity", 0);
    if (this.yearLabel) this.yearLabel.style("opacity", 0);
    if (this.topValueLabel) this.topValueLabel.style("opacity", 0);
    if (this.bottomValueLabel) this.bottomValueLabel.style("opacity", 0);
    if (this.tooltip) this.tooltip.style("opacity", 0);
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

  // Public API methods
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