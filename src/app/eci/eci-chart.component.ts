// refactored-eci-chart.component.ts

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil, distinctUntilChanged, skip } from 'rxjs';
import * as d3 from 'd3';
import { ECIChartService } from './eci-chart.service';
import { ECIChartUtils } from './eci-chart-utils';
import { ChartCoordinationService } from '../service/chart-coordination.service';
import { CommonModule } from '@angular/common';

import { ChartUtility, NodeColorOptions, TooltipOptions } from '../d3_utility/chart-nodes-utility';
import { 
  D3SvgChartUtility, 
  ChartDimensions, 
  SVGConfig, 
  ZoomConfig 
} from '../d3_utility/svg-utility';

import { 
  ECIRawDataItem,
  ECILineData,
  ECIChartConfig,
  ECIScales,
  ECITooltipData,
  ECIChartStats,
  ECIDisplayMode,
  ECIDataPoint
} from './eci-chart.models';

@Component({
  selector: 'app-eci-chart',
  template: `
    <div #chartContainer class="eci-chart-wrapper" id="eci-chart-div">
      <!-- Loading indicator -->
      <div *ngIf="isLoading" class="loading-overlay">
        <div class="loading-spinner">Loading ECI chart data...</div>
      </div>
      
      <!-- Error overlay -->
      <div *ngIf="errorMessage" class="error-overlay">
        <div class="error-message">{{ errorMessage }}</div>
        <button class="retry-button" (click)="retryDataLoad()">Retry</button>
      </div>

      <div #tooltipContainer id="eci-tooltip-container" class="tooltip-container"></div>
    </div>
  `,
  styleUrls: ['./eci-chart.component.scss'],
  imports: [CommonModule],
})
export class ECIChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @ViewChild('tooltipContainer', { static: true }) tooltipContainer!: ElementRef<HTMLDivElement>;

  // Input properties
  @Input() showControls: boolean = true;
  @Input() showStats: boolean = true;
  @Input() enableTooltips: boolean = true;
  @Input() enableLegend: boolean = true;
  @Input() chartWidth: number = 1342;
  @Input() chartHeight: number = 650;
  @Input() customConfig?: Partial<ECIChartConfig>;
  @Input() selectedProvinces: string[] = [];
  @Input() autoLoadProvinces?: string[];

  // Output events
  @Output() lineHovered = new EventEmitter<ECITooltipData>();
  @Output() lineClicked = new EventEmitter<ECITooltipData>();
  @Output() provinceHighlighted = new EventEmitter<string>();
  @Output() chartDataLoaded = new EventEmitter<ECIChartStats>();
  @Output() provinceSelectionChanged = new EventEmitter<string[]>();
  @Output() dataRefreshed = new EventEmitter<void>();

  // Component state
  private destroy$ = new Subject<void>();
  private svg: any;
  private zoomable: any;
  private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null = null;
  private scales: ECIScales | null = null;
  private config: ECIChartConfig;
  private dimensions: ChartDimensions;
  private zoom: any;

  private rawData: ECIRawDataItem[] = [];
  private lineData: ECILineData[] = [];
  private filteredLineData: ECILineData[] = [];

  // UI state
  isLoading: boolean = false;
  errorMessage: string = '';
  chartStats: ECIChartStats | null = null;
  displayMode: ECIDisplayMode = ECIDisplayMode.ALL_PROVINCES;
  DisplayModes = ECIDisplayMode; // For template access
  availableProvinces: string[] = [];
  currentRegion: string = '';
  highlightedProvince: string = '';

  constructor(
    private eciService: ECIChartService,
    private coordinationService: ChartCoordinationService,
    private chartUtility: ChartUtility, // NEW: Chart utility
    private d3SvgUtility: D3SvgChartUtility // NEW: D3 SVG utility
  ) {
    this.config = ECIChartUtils.mergeConfigs(
      ECIChartUtils.getDefaultConfig(),
      this.customConfig || {}
    );

    // Setup dimensions
    this.dimensions = {
      width: this.chartWidth,
      height: this.chartHeight,
      margins: { 
        top: this.config.margin.top, 
        right: this.config.margin.right, 
        bottom: this.config.margin.bottom, 
        left: this.config.margin.left 
      }
    };
  }

  ngOnInit(): void {
    this.subscribeToServices();
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Use utility cleanup
    this.d3SvgUtility.cleanup('eci-chart-div');
  }

  private subscribeToServices(): void {
    this.subscribeToCoordinationService();
  }

  private subscribeToCoordinationService(): void {
    // Subscribe to region changes
    this.coordinationService.region$
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => {
        this.currentRegion = region;
        this.highlightProvince(region);
      });

    // Subscribe to search queries (ECI chart could highlight provinces based on search)
    this.coordinationService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        console.log('ECI chart received search query:', query);
        this.handleSearch(query);
      });
  }

 
  private loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Check if we should load specific provinces or all
    const loadPromise = this.autoLoadProvinces && this.autoLoadProvinces.length > 0
      ? this.eciService.loadECIDataForProvinces(this.autoLoadProvinces)
      : this.eciService.loadECIData();

    loadPromise
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(`📊 ECI data loaded:`, data);
          
          if (this.eciService.validateData(data)) {
            this.rawData = data;
            this.processData();
          } else {
            this.handleError('Invalid data format received');
          }
        },
        error: (error) => {
          this.handleError(`Failed to load data: ${error.message}`);
        }
      });
  }

  private processData(): void {
    try {
      this.lineData = this.eciService.transformDataToLines(this.rawData);
      this.availableProvinces = this.eciService.getAvailableProvinces(this.lineData);
      this.chartStats = this.eciService.calculateChartStats(this.lineData);
      
      // Apply current filter
      this.applyFilter();

      
      // Initialize chart if not already done
      if (!this.svg) {
        this.initializeChart();
      } else {

      if (this.scales) {
              this.updateDataCoordinates();
            }

        this.renderChart();
      }
      
      // Emit events
      this.chartDataLoaded.emit(this.chartStats);
      this.isLoading = false;

    } catch (error) {
      this.handleError(`Failed to process data: ${error}`);
    }
  }

  // REFACTORED - Using D3 SVG utility
  private initializeChart(): void {
    this.setupSVG();
    this.setupTooltip();
    this.setupZoom();
    this.renderChart();
  }

  // REFACTORED - Using utility
  private setupSVG(): void {
    const svgConfig: SVGConfig = {
      containerId: 'eci-chart-div',
      dimensions: this.dimensions,
      background: this.config.background || '#fff',
      cursor: "crosshair"
    };

    const result = this.d3SvgUtility.createSVG(svgConfig);
    this.svg = result.svg;
    this.zoomable = result.zoomable;

    // Add click handler to clear selections
    this.svg.on("click", (event: any) => this.handleSvgClick(event));
  }

  // REFACTORED - Using ECIChartUtils for tooltip setup
  private setupTooltip(): void {
    this.tooltip = ECIChartUtils.setupTooltip('#eci-tooltip-container');
  }

  // REFACTORED - Using utility
  private setupZoom(): void {
    const zoomConfig: ZoomConfig = {
      scaleExtent: [0.5, 5],
      enablePan: false,
      enableZoom: false,
      onZoom: (transform) => {
        this.handleZoom({ transform });
      }
    };

    //this.zoom = this.d3SvgUtility.setupZoom(this.svg, this.zoomable, zoomConfig);
  }

  private applyFilter(): void {
    switch (this.displayMode) {
      case ECIDisplayMode.ALL_PROVINCES:
        this.filteredLineData = [...this.lineData];
        break;
        
      case ECIDisplayMode.SELECTED_PROVINCES:
      case ECIDisplayMode.COMPARISON:
        if (this.selectedProvinces.length > 0) {
          this.filteredLineData = this.eciService.filterProvinces(this.lineData, this.selectedProvinces);
        } else {
          this.filteredLineData = [...this.lineData];
        }
        break;
        
      default:
        this.filteredLineData = [...this.lineData];
    }
  }

  private renderChart(): void {
    if (!this.svg || this.filteredLineData.length === 0) return;

    // Clear existing chart
    this.clearChart();

    // Create scales
    this.scales = ECIChartUtils.createScales(this.filteredLineData, this.config);

    this.updateDataCoordinates();

    // Create axes and labels
    ECIChartUtils.createAxes(this.svg, this.scales, this.config);
    ECIChartUtils.createAxisLabels(this.svg, this.config);

    // Render lines and points with utility functions
    this.renderLines();
    this.renderPoints();

    // Create legend
    if (this.enableLegend) {
      this.renderLegend();
    }

    // Animate entrance using utility
    this.d3SvgUtility.animateElements(this.zoomable.selectAll('*'), {
      duration: this.config.transitionDuration,
      properties: {
        'opacity': 1
      }
    });
  }

  private renderLines(): void {
    if (!this.svg || !this.scales) return;

    const lineGenerator = ECIChartUtils.createLineGenerator(this.scales);

    // Use chart utility for event handling
    const eventHandlers = this.chartUtility.createEventHandlers({
      svg: this.svg,
      onMouseover: (event, d) => this.handleLineMouseover(event, d),
      onMousemove: (event, d) => this.handleLineMousemove(event, d),
      onMouseleave: (event, d) => this.handleLineMouseleave(event, d),
      //createTooltip: (d) => this.createPointTooltip(d, "lineData.name"),
      onClick: (event, d) => this.handleLineClick(event, d),
      enableSelection: true
    });

    const chartGroup = this.zoomable.append('g')
      .attr('class', 'chart-content')
      .attr('transform', `translate(${this.config.margin.left}, ${this.config.margin.top})`);

    const lines = chartGroup.selectAll("path.eci-line")
      .data(this.filteredLineData);

    lines.enter()
      .append("path")
      .attr("class", "eci-line")
      .attr("d", (d: any) => lineGenerator(d.values))
      .attr("stroke", (d: any) => this.scales!.color(d.name))
      .style("stroke-width", this.config.strokeWidth)
      .style("fill", "none")
      .style("cursor", "pointer")
      .on("mouseover", eventHandlers.mouseover)
      .on("mousemove", eventHandlers.mousemove)
      .on("mouseout", eventHandlers.mouseleave)
      .on("click", eventHandlers.click);
  }

  private renderPoints(): void {
    if (!this.svg || !this.scales) return;

    const chartGroup = this.zoomable.select('.chart-content');

    // Create point groups for each line
    const pointGroups = chartGroup.selectAll("g.point-group")
      .data(this.filteredLineData);

    const pointGroupsEnter = pointGroups.enter()
      .append("g")
      .attr("class", "point-group");

    const pointGroupsMerged = pointGroupsEnter.merge(pointGroups as any);

    // Create circles for each data point with utility event handlers
    pointGroupsMerged.each((lineData: any, i: number, nodes: any) => {
      const group = d3.select(nodes[i]);
      
      const eventHandlers = this.chartUtility.createEventHandlers({
        svg: this.svg,
        onMouseover: (event, d) => this.handlePointMouseover(event, d, lineData.name),
        onMouseleave: (event, d) => this.handlePointMouseleave(event, d),
        onMousemove: (event, d) => this.handleLineMousemove(event, d),
        onClick: (event, d) => this.handlePointClick(event, d, lineData.name),
        createTooltip: (d) => this.createPointTooltip(d, lineData.name),
        enableSelection: false
      });
      
      const circles = group.selectAll("circle.eci-point")
        .data(lineData.values);

      circles.enter()
        .append("circle")
        .attr("class", "eci-point")
        .attr("cx", (d: any) => this.scales!.x(d.year))
        .attr("cy", (d: any) => this.scales!.y(d.eci))
        .attr("r", this.config.circleRadius)
        .attr("fill", this.scales!.color(lineData.name))
        .attr("data-province", lineData.name)
        .style("cursor", "pointer")
        .on("mouseover", eventHandlers.mouseover)
        .on("mouseout", eventHandlers.mouseleave)
        .on("mousemove", eventHandlers.mousemove)
        .on("click", eventHandlers.click);
    });

    pointGroups.exit().remove();
  }

private updateDataCoordinates(): void {
  if (!this.scales || !this.filteredLineData) return;

  // Update coordinates for all line data points
  this.filteredLineData = this.filteredLineData.map(lineData => ({
    ...lineData,
    values: lineData.values.map(point => ({
      ...point,
      x: this.scales!.x(point.year),
      y: this.scales!.y(point.eci)
    }))
  }));
}

  private renderLegend(): void {
    if (!this.svg || !this.scales) return;

    ECIChartUtils.createLegend(
      this.svg,
      this.filteredLineData,
      this.scales,
      this.config,
      this.eciService['provinceMapping'],
      (provinceName: string) => this.onLegendHover(provinceName),
      (provinceName: string) => this.onLegendClick(provinceName)
    );
  }

  private clearChart(): void {
    if (this.zoomable) {
      this.zoomable.selectAll('.chart-content').remove();
      this.zoomable.selectAll('.axis').remove();
      this.zoomable.selectAll('.axis-label').remove();
      this.zoomable.selectAll('.legend').remove();
    }
  }


  private createPointTooltip(d: any, provinceName: string): any {


    console.log('Creating tooltip for point:', d, 'Province:', provinceName);



    const tooltipOptions: TooltipOptions = {
      title: `${this.eciService.getProvinceShortName(provinceName)} - ${d.year}`,
      description: `${provinceName}, ${d.year}`,
      eci: d.eci,
      additionalInfo: {
        'Province': provinceName,
      },
      showCloseButton: false
    };

    return this.chartUtility.createTooltip("#eci-chart-div", d, tooltipOptions);
  }

  private handleSearch(query: string): void {
    if (!query || query.trim().length === 0) {
      this.resetHighlighting();
      return;
    }

    // Search for province names that match the query
    const matchingProvinces = this.availableProvinces.filter(province => 
      province.toLowerCase().includes(query.toLowerCase()) ||
      this.eciService.getProvinceShortName(province).toLowerCase().includes(query.toLowerCase())
    );

    if (matchingProvinces.length > 0) {
      // Highlight the first matching province
      this.highlightProvince(matchingProvinces[0]);
    } else {
      this.resetHighlighting();
    }
  }

  // Event handlers using utility functions
  private handleZoom(event: any): void {

    return 
    // Handle tooltip repositioning during zoom using utility
    const tooltips = d3.selectAll('#eci-chart-div .tooltip');
    tooltips.each((d: any, i: number, nodes: any) => {
      if (d && d.x !== undefined && d.y !== undefined) {
        const [tx, ty] = this.d3SvgUtility.applyTransform(event.transform, d.x, d.y);
        d3.select(nodes[i])
          .style('left', `${tx}px`)
          .style('top', `${ty}px`);
      }
    });
  }

  private handleSvgClick(event: any): void {
    // Clear selections and hide info box
    this.clearSelections();
    const infoBox = document.getElementById("info-box");
    if (infoBox) {
      infoBox.style.visibility = "hidden";
    }
  }

  private handleLineMouseover = (event: MouseEvent, d: ECILineData): void => {
    this.highlightProvince(d.name);
  };

  private handleLineMousemove = (event: MouseEvent, d: ECILineData): void => {
    if (!this.enableTooltips || !this.scales) return;
  };

  private handleLineMouseleave = (event: MouseEvent, d: ECILineData): void => {
    this.resetHighlighting();
  };

  private handleLineClick = (event: MouseEvent, d: ECILineData): void => {
    if (!this.scales) return;

    const mousePos = ECIChartUtils.getMousePosition(event, this.scales, this.config);
    const closestPoint = this.eciService.findClosestDataPoint(this.filteredLineData, mousePos.year, d.name);

    if (closestPoint) {
      this.updateInfoBox(closestPoint);

      // Emit click event
      this.lineClicked.emit({
        provinceName: closestPoint.province,
        year: closestPoint.year,
        eci: closestPoint.eci,
        fullProvinceName: closestPoint.province
      });
    }
  };

  private handlePointMouseover = (event: MouseEvent, d: ECIDataPoint, provinceName: string): void => {
    this.highlightProvince(provinceName);
  };

  private handlePointMouseleave = (event: MouseEvent, d: ECIDataPoint): void => {
    this.resetHighlighting();
  };

  private handlePointClick = (event: MouseEvent, d: ECIDataPoint, provinceName: string): void => {
    this.updateInfoBox({
      province: provinceName,
      year: d.year,
      eci: d.eci
    });

    this.lineClicked.emit({
      provinceName: provinceName,
      year: d.year,
      eci: d.eci,
      fullProvinceName: provinceName
    });
  };

  private onLegendHover(provinceName: string): void {
    if (provinceName) {
      this.highlightProvince(provinceName);
    } else {
      this.resetHighlighting();
    }
  }

  private onLegendClick(provinceName: string): void {
    this.provinceHighlighted.emit(provinceName);
  }

  private updateInfoBox(data: { province: string; year: number; eci: number }): void {
    // Keep existing info box logic
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
      elements.title.innerHTML = `${this.eciService.getProvinceShortName(data.province)} - ${data.year}`;
    }
    
    if (elements.description) {
      elements.description.innerHTML = `Economic Complexity Index for ${data.province}`;
    }
    
    if (elements.trade) {
      elements.trade.innerHTML = `ECI: ${data.eci.toFixed(4)}`;
    }
    
    if (elements.rca) {
      const trend = this.eciService.getTrendDirection(this.lineData, data.province);
      const trendIcon = trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '→';
      elements.rca.innerHTML = `Trend: ${trendIcon}`;
    }
    
    if (elements.pci) {
      const avgECI = this.eciService.getAverageECI(this.lineData, data.province);
      elements.pci.innerHTML = `Avg ECI: ${avgECI.toFixed(4)}`;
    }
  }

  // Public API methods
  public refreshChart(): void {
    this.loadData();
  }

  public clearSelections(): void {
    this.resetHighlighting();
    this.highlightedProvince = '';
    
    // Use utility to remove tooltips
    this.chartUtility.removeAllTooltips();
  }

  public highlightProvince(provinceName: string): void {
    if (!this.svg) return;

    this.highlightedProvince = provinceName;
    
    if (provinceName) {
      ECIChartUtils.highlightProvince(this.svg, provinceName, this.filteredLineData, this.config);
    } else {
      this.resetHighlighting();
    }

    this.provinceHighlighted.emit(provinceName);
  }

  public resetHighlighting(): void {
    if (this.svg) {
      ECIChartUtils.resetHighlighting(this.svg, this.config);
    }
    this.highlightedProvince = '';
  }




  public getProvinceShortName(province: string): string {
    return this.eciService.getProvinceShortName(province);
  }

  public retryDataLoad(): void {
    this.errorMessage = '';
    this.loadData();
  }

  public isChartReady(): boolean {
    return !this.isLoading && !this.errorMessage && this.lineData.length > 0;
  }

  public hasData(): boolean {
    return this.lineData && this.lineData.length > 0;
  }

  private handleError(message: string): void {
    this.isLoading = false;
    this.errorMessage = message;
    console.error('ECI Chart Error:', message);
  }
}