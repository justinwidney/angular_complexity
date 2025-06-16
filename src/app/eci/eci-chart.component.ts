// eci-chart.component.ts

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import * as d3 from 'd3';
import { ECIChartService } from './eci-chart.service';
import { ECIChartUtils } from './eci-chart-utils';
import { ChartCoordinationService } from '../service/chart-coordination.service';
import { UnifiedDataService } from '../service/chart-data-service';
import { CommonModule } from '@angular/common';

import { 
  ECIRawDataItem,
  ECILineData,
  ECIChartConfig,
  ECIScales,
  ECITooltipData,
  ECIChartStats,
  ECIDisplayMode,
  ECIChartEvents,
  ECIDataPoint
} from './eci-chart.models';

@Component({
  selector: 'app-eci-chart',
  template: `
    <div #chartContainer class="eci-chart-wrapper">
      <!-- Chart Container -->
      <div class="chart-container">
        <svg #svgContainer [attr.width]="chartWidth" [attr.height]="chartHeight"></svg>
      </div>
      
      <!-- Tooltip Container -->
      <div #tooltipContainer id="eci-tooltip-container" class="tooltip-container"></div>
     
    </div>
  `,
  styleUrls: ['./eci-chart.component.scss'],
  imports: [CommonModule],
})
export class ECIChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef<SVGElement>;
  @ViewChild('tooltipContainer', { static: true }) tooltipContainer!: ElementRef<HTMLDivElement>;

  // Input properties
  @Input() showControls: boolean = true;
  @Input() showStats: boolean = true;
  @Input() showCacheStatus: boolean = true;
  @Input() enableTooltips: boolean = true;
  @Input() enableLegend: boolean = true;
  @Input() chartWidth: number = 1440;
  @Input() chartHeight: number = 650;
  @Input() customConfig?: Partial<ECIChartConfig>;
  @Input() selectedProvinces: string[] = [];
  @Input() autoLoadProvinces?: string[]; // Specific provinces to load on init

  // Output events
  @Output() lineHovered = new EventEmitter<ECITooltipData>();
  @Output() lineClicked = new EventEmitter<ECITooltipData>();
  @Output() provinceHighlighted = new EventEmitter<string>();
  @Output() chartDataLoaded = new EventEmitter<ECIChartStats>();
  @Output() provinceSelectionChanged = new EventEmitter<string[]>();
  @Output() dataRefreshed = new EventEmitter<void>();

  // Component state
  private destroy$ = new Subject<void>();
  private svg: any
  private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any> | null = null;
  private scales: ECIScales | null = null;
  private config: ECIChartConfig;

  private rawData: ECIRawDataItem[] = [];
  private lineData: ECILineData[] = [];
  private filteredLineData: ECILineData[] = [];

  // UI state
  isLoading: boolean = false;
  unifiedLoading: boolean = false;
  errorMessage: string = '';
  unifiedError: string | null = null;
  chartStats: ECIChartStats | null = null;
  displayMode: ECIDisplayMode = ECIDisplayMode.ALL_PROVINCES;
  DisplayModes = ECIDisplayMode; // For template access
  availableProvinces: string[] = [];
  currentRegion: string = '';
  highlightedProvince: string = '';
  isCached: boolean = false;
  loadingProvinces: number = 0;

  constructor(
    private eciService: ECIChartService,
    private coordinationService: ChartCoordinationService,
    private unifiedDataService: UnifiedDataService
  ) {
    this.config = ECIChartUtils.mergeConfigs(
      ECIChartUtils.getDefaultConfig(),
      this.customConfig || {}
    );
  }

  ngOnInit(): void {
    this.subscribeToServices();
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

  private subscribeToServices(): void {
    // Subscribe to coordination service
    this.subscribeToCoordinationService();
    
    // Subscribe to unified data service
    this.subscribeToUnifiedDataService();
  }

  private subscribeToCoordinationService(): void {
    // Subscribe to region changes (though ECI typically shows all provinces)
    this.coordinationService.region$
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => {
        this.currentRegion = region;
        // ECI chart typically doesn't filter by region, but you could highlight it
        this.highlightProvince(region);
      });
  }

  private subscribeToUnifiedDataService(): void {
    // Subscribe to loading state
    this.unifiedDataService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.unifiedLoading = loading;
      });

    // Subscribe to error state
    this.unifiedDataService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.unifiedError = error;
      });
  }

  private initializeChart(): void {
    try {
      // Create D3 SVG selection
      this.svg = d3.select(this.svgContainer.nativeElement);
      
      // Setup tooltip
      this.tooltip = ECIChartUtils.setupTooltip('#eci-tooltip-container');

    } catch (error) {
      //this.handleError(`Failed to initialize chart: ${error}`);
    }
  }

  private loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Check if we should load specific provinces or all
    const loadPromise = this.autoLoadProvinces && this.autoLoadProvinces.length > 0
      ? this.eciService.loadECIDataForProvinces(this.autoLoadProvinces)
      : this.eciService.loadECIData();

    // Update loading message
    this.loadingProvinces = this.autoLoadProvinces?.length || this.unifiedDataService.getAvailableRegions().length;

    loadPromise
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(`📊 ECI data loaded: ${data.length} data points`);
          
          if (this.eciService.validateData(data)) {
            this.rawData = data;
            this.checkCacheStatus();
            this.processData();
          } else {
            //this.handleError('Invalid data format received');
          }
        },
        error: (error) => {
          //this.handleError(`Failed to load data: ${error.message}`);
        }
      });
  }

  private checkCacheStatus(): void {
    // Check if data came from cache
    const cacheStatus = this.unifiedDataService.getCacheStatus();
    this.isCached = cacheStatus.some(status => status.cached);
  }

  private processData(): void {
    try {

      this.lineData = this.eciService.transformDataToLines(this.rawData);
      this.availableProvinces = this.eciService.getAvailableProvinces(this.lineData);
      
      // Apply current filter
      this.applyFilter();
      this.renderChart();
          
      this.isLoading = false;

    } catch (error) {
      //this.handleError(`Failed to process data: ${error}`);
    }
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

    this.scales = ECIChartUtils.createScales(this.filteredLineData, this.config);

    ECIChartUtils.createAxes(this.svg, this.scales, this.config);
    ECIChartUtils.createAxisLabels(this.svg, this.config);

    // Render lines and points
    this.renderLines();
    this.renderPoints();

    // Create legend
    if (this.enableLegend) {
      this.renderLegend();
    }

    // Animate entrance
    ECIChartUtils.animateChartEntrance(this.svg, this.config);
  }

  private renderLines(): void {
    if (!this.svg || !this.scales) return;

    const lineGenerator = ECIChartUtils.createLineGenerator(this.scales);

    const lines = this.svg.selectAll("path.eci-line")
      .data(this.filteredLineData);

    lines.enter()
      .append("path")
      .attr("class", "eci-line")
      .attr("d", (d: { values: Iterable<ECIDataPoint> | ECIDataPoint[]; }) => lineGenerator(d.values))
      .attr("stroke", (d: { name: string; }) => this.scales!.color(d.name))
      .style("stroke-width", this.config.strokeWidth)
      .style("fill", "none")
      .attr("transform", `translate(${this.config.margin.left}, ${this.config.margin.top})`)
      .on("mouseover", (event: MouseEvent, d: ECILineData) => this.handleLineMouseover(event, d))
      .on("mousemove", (event: MouseEvent, d: ECILineData) => this.handleLineMousemove(event, d))
      .on("mouseout", (event: MouseEvent, d: ECILineData) => this.handleLineMouseleave(event, d))
      .on("click", (event: MouseEvent, d: ECILineData) => this.handleLineClick(event, d));

    // Update existing lines
    lines.transition()
      .duration(this.config.transitionDuration)
      .attr("d", (d: { values: Iterable<ECIDataPoint> | ECIDataPoint[]; }) => lineGenerator(d.values))
      .attr("stroke", (d: { name: string; }) => this.scales!.color(d.name));

    // Remove old lines
    lines.exit().remove();
  }

  private renderPoints(): void {
    if (!this.svg || !this.scales) return;

    // Create point groups for each line
    const pointGroups = this.svg.selectAll("g.point-group")
      .data(this.filteredLineData);

    const pointGroupsEnter = pointGroups.enter()
      .append("g")
      .attr("class", "point-group")
      .attr("transform", `translate(${this.config.margin.left}, ${this.config.margin.top})`);

    const pointGroupsMerged = pointGroupsEnter.merge(pointGroups as any);

    // Create circles for each data point
    pointGroupsMerged.each((lineData: any, i: number, nodes:any ) => {
      const group = d3.select(nodes[i]);
      
      const circles = group.selectAll("circle.eci-point")
        .data(lineData.values);

      circles.enter()
        .append("circle")
        .attr("class", "eci-point")
        .attr("cx", (d) => this.scales!.x((d as { year: number; eci: number }).year))
        .attr("cy", d => this.scales!.y((d as { year: number; eci: number }).eci))
        .attr("r", this.config.circleRadius)
        .attr("fill", this.scales!.color(lineData.name))
        .attr("data-province", lineData.name)
        .on("mouseover", (event, d) => this.handlePointMouseover(event, d, lineData.name))
        .on("mouseout", (event, d) => this.handlePointMouseleave(event, d));

      circles.exit().remove();
    });

    pointGroups.exit().remove();
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
    if (this.svg) {
      this.svg.selectAll("*").remove();
    }
  }

  // Event handlers
  private handleLineMouseover = (event: MouseEvent, d: ECILineData): void => {
    if (!this.enableTooltips) return;
    
    this.highlightProvince(d.name);
  };

  private handleLineMousemove = (event: MouseEvent, d: ECILineData): void => {
    if (!this.enableTooltips || !this.tooltip || !this.scales) return;

    const mousePos = ECIChartUtils.getMousePosition(event, this.scales, this.config);
    const closestPoint = this.eciService.findClosestDataPoint(this.filteredLineData, mousePos.year, d.name);

    if (closestPoint) {
      const tooltipContent = ECIChartUtils.formatTooltipContent(
        closestPoint.province,
        closestPoint.year,
        closestPoint.eci,
        this.eciService['provinceMapping']
      );

      ECIChartUtils.updateTooltipPosition(this.tooltip, event, tooltipContent);

      // Emit hover event
      this.lineHovered.emit({
        provinceName: closestPoint.province,
        year: closestPoint.year,
        eci: closestPoint.eci,
        fullProvinceName: closestPoint.province
      });
    }
  };

  private handleLineMouseleave = (event: MouseEvent, d: ECILineData): void => {
    if (this.tooltip) {
      ECIChartUtils.hideTooltip(this.tooltip);
    }
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

  private handlePointMouseover = (event: MouseEvent, d: any, provinceName: string): void => {
    if (!this.enableTooltips || !this.tooltip) return;

    const tooltipContent = ECIChartUtils.formatTooltipContent(
      provinceName,
      d.year,
      d.eci,
      this.eciService['provinceMapping']
    );

    ECIChartUtils.updateTooltipPosition(this.tooltip, event, tooltipContent);
  };

  private handlePointMouseleave = (event: MouseEvent, d: any): void => {
    if (this.tooltip) {
      ECIChartUtils.hideTooltip(this.tooltip);
    }
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

  public refreshAllData(): void {
    // Clear cache before refreshing
    this.unifiedDataService.clearCache();
    this.loadData();
    this.dataRefreshed.emit();
  }

  public refreshProvinceData(province: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.eciService.refreshProvinceData(province)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newData) => {
          console.log(`📊 Refreshed data for ${province}:`, newData.length, 'points');
          
          // Merge new data with existing data
          const otherData = this.rawData.filter(d => d.origin !== province);
          this.rawData = [...otherData, ...newData];
          
          this.processData();
        },
        error: (error) => {
          //this.handleError(`Failed to refresh ${province} data: ${error.message}`);
        }
      });
  }

  public retryDataLoad(): void {
    this.errorMessage = '';
    this.unifiedError = null;
    this.loadData();
  }

  public clearSelections(): void {
    this.resetHighlighting();
    this.highlightedProvince = '';
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

  public updateRegion(region: string): void {
    this.currentRegion = region;
    this.highlightProvince(region);
  }

  public exportData(): string {
    return this.eciService.exportToCSV(this.lineData);
  }

  public getChartData(): ECILineData[] {
    return ECIChartUtils.cloneLineData(this.lineData);
  }

  public isChartReady(): boolean {
    return !this.isLoading && !this.unifiedLoading && !this.errorMessage && !this.unifiedError && this.lineData.length > 0;
  }

  public hasData(): boolean {
    return this.lineData && this.lineData.length > 0;
  }

  public getCacheStatus(): { region: string; cached: boolean; lastUpdated?: Date }[] {
    return this.unifiedDataService.getCacheStatus();
  }

  // UI event handlers
  public onDisplayModeChange(): void {
    this.applyFilter();
    this.renderChart();
  }

  public toggleProvinceSelection(province: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    
    if (target.checked) {
      if (!this.selectedProvinces.includes(province)) {
        this.selectedProvinces.push(province);
      }
    } else {
      const index = this.selectedProvinces.indexOf(province);
      if (index > -1) {
        this.selectedProvinces.splice(index, 1);
      }
    }

    this.provinceSelectionChanged.emit([...this.selectedProvinces]);
    this.applyFilter();
    this.renderChart();
  }

  public isProvinceSelected(province: string): boolean {
    return this.selectedProvinces.includes(province);
  }

  public getProvinceShortName(province: string): string {
    return this.eciService.getProvinceShortName(province);
  }

 

  private destroyChart(): void {
    this.clearChart();
    
    if (this.tooltip) {
      this.tooltip.remove();
    }
  }
}