// feasible-chart.component.ts - Updated to use ChartUtility

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { distinctUntilChanged, skip, Subject, takeUntil } from 'rxjs';
import * as d3 from 'd3';
import { UnifiedDataService } from '../service/chart-data-service';
import { FeasibleChartService } from './feasible-chart-service';
import { FeasibleChartUtils } from './feasible-chart-utils';
import { ChartCoordinationService } from '../service/chart-coordination.service';
import { 
  FeasiblePoint, 
  FeasibleEventData, 
  FeasibleChartConfig,
  FeasibleScales,
  GroupingType,
  DisplayMode,
  FilterType,
  IconTruthMapping,
  QuadrantInfo
} from './feasible-chart-model';
import { GroupedData } from '../productspace/product-space-chart.models';
import { CommonModule } from '@angular/common';
import { ChartUtility, NodeColorOptions, TooltipOptions } from '../d3_utility/chart-search-utility';

@Component({
  selector: 'app-feasible-chart',
  template: `
  <div #chartContainer id="feasiblediv">
    <!-- Loading indicator -->
    <div *ngIf="loading" class="loading-overlay">
      <div class="loading-spinner">Loading chart data...</div>
    </div>
    
    <!-- Error display -->
    <div *ngIf="error" class="error-overlay">
      <div class="error-message">{{ error }}</div>
    </div>
  </div>
`,
  styleUrls: ['./feasible-chart.component.scss'],
  imports: [CommonModule]
})
export class FeasibleChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  
  // Input properties
  @Input() showTooltips: boolean = true;
  @Input() enableIconFiltering: boolean = true;
  @Input() enableTracking: boolean = true;

  // Event emitters
  @Output() chartDataLoaded = new EventEmitter<{dataCount: number, eci: number}>();
  @Output() nodeSelected = new EventEmitter<{node: Node | FeasiblePoint, data: GroupedData | undefined, connectedProducts: string[]}>();
  @Output() nodeHovered = new EventEmitter<{node: Node, data: GroupedData | undefined}>();

  // Component state
  private destroy$ = new Subject<void>();
  private svg: any;
  private zoomable: any;
  private scales!: FeasibleScales;
  private config!: FeasibleChartConfig;
  private data: FeasiblePoint[] = [];
  private eci: number = 0;
  private centerX: number = 0;
  private centerY: number = 0;
  private bounds: any = {};
  private rawData: any[] = [];

  // UI elements
  private trackingLines: { lineX: any, lineY: any } = { lineX: null, lineY: null };
  private trackingText: { textX: any, textY: any } = { textX: null, textY: null };
  private zoom: any;

  // State
  private iconTruthMapping: IconTruthMapping = FeasibleChartUtils.getDefaultIconTruthMapping();
  private currentGrouping: GroupingType = GroupingType.HS4;
  private currentDisplayMode: DisplayMode = DisplayMode.DEFAULT;
  private currentFilterType: FilterType = FilterType.ALL;
  private enabledProductGroups: any[] = [];

  // Search state - now using utility
  private currentSearchQuery: string = '';

  pointSelected: any;
  pointHovered: any;

  // Loading and error states
  loading = false;
  error: string | null = null;

  constructor(
    private unifiedDataService: UnifiedDataService,
    private chartService: FeasibleChartService,
    private coordinationService: ChartCoordinationService,
    private chartUtility: ChartUtility  // ONLY addition - utility
  ) {
    this.config = FeasibleChartUtils.getChartConfig();
  }

  ngOnInit(): void {
    this.subscribeToCoordinationService();
    this.subscribeToUnifiedService();
  }

  ngAfterViewInit(): void {
    this.loadData();
    this.initializeChart();
  }

  public refreshChart(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.svg) {
      this.svg.remove();
    }
    
    // Clean up tooltips
    d3.selectAll('.tooltip').remove();
  }

  private subscribeToCoordinationService(): void {
    // SIMPLIFIED search using utility
    this.coordinationService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        console.log('Feasible chart received search query:', query);
        this.currentSearchQuery = query;
        this.performSearch(query);
      });

    // Keep all your existing subscriptions
    this.coordinationService.region$
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => {
        this.loadData();
      });

    this.coordinationService.year$
      .pipe(
        skip(1), 
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(year => {
        console.log("coordinationService year change:", year);
        this.loadData();
      });

    this.coordinationService.grouping$
      .pipe(takeUntil(this.destroy$))
      .subscribe(grouping => {
        this.currentGrouping = grouping;
        this.loadData();
      });

    this.coordinationService.displayMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(displayMode => {
        this.currentDisplayMode = displayMode;
        this.updateDisplayMode();
      });

    this.coordinationService.filterType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterType => {
        this.currentFilterType = filterType;
        this.updateDisplay();
      });

    this.coordinationService.productGroups$
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        this.enabledProductGroups = productGroups.filter(group => group.enabled);
        this.updateDisplay();
      });
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

    this.unifiedDataService.currentRegion$
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => {
        // Handle region changes if needed
      });
  }

  // SIMPLIFIED search using utility
  private performSearch(query: string): void {
    const searchFilter = this.chartUtility.createSearchFilter(query, this.data);
    this.updatePointColors(searchFilter.highlightFunction);
  }

  // SIMPLIFIED - just update colors using utility
  private updatePointColors(highlightFunction?: (item: any) => boolean): void {
    const colorOptions: NodeColorOptions = {
      searchQuery: this.chartUtility.getCurrentSearchQuery(),
      searchResults: this.chartUtility.getCurrentSearchResults(),
      colorScale: this.coordinationService.isNaicsGrouping() ? this.scales.naicsColor : this.scales.hs4Color,
      defaultColor: 'rgb(249, 251, 251)',
      dimmedColor: 'rgb(249, 251, 251)',
      filterType: this.currentFilterType,
      enabledProductGroups: this.coordinationService.currentProductGroups.filter(g => g.enabled)
    };

    this.chartUtility.updateSelectionColors(
      this.zoomable.selectAll(".feasible-point"),
      this.data,
      {
        ...colorOptions,
        getItemById: (id: string) => this.data.find(d => d.hs2 === id),
        idAttribute: 'hs2'
      }
    );
  }

  private updateReferenceLines(): void {
    if (!this.zoomable || !this.scales) {
      return;
    }
  
    this.zoomable.selectAll('.eci-line').remove();
    this.zoomable.selectAll('.center-line').remove();
    this.zoomable.selectAll('.eci-label').remove();
  
    FeasibleChartUtils.createReferenceLines(
      this.zoomable, 
      this.scales, 
      this.eci, 
      this.centerX, 
      this.centerY
    );
  }

  private loadData(): void {
    const region = this.coordinationService.currentRegion || this.unifiedDataService.getCurrentRegion();
    
    this.unifiedDataService.getFeasibleChartData(region as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.rawData = result.rawData;
          this.data = this.processDataForGrouping(result.feasibleData);
          this.eci = result.eci;
          this.bounds = result.bounds;
          this.centerX = result.bounds.centerX;
          this.centerY = result.bounds.centerY;

          console.log(this.centerX, this.centerY, "centerX, centerY");

          this.chartDataLoaded.emit({
            dataCount: this.data.length,
            eci: this.eci
          });

          this.updateReferenceLines();
          this.refreshChart();

          setTimeout(() => {
            this.updateZoomForNewCenter();
          }, 100);

          // Re-apply current search if active
          const currentQuery = this.chartUtility.getCurrentSearchQuery();
          if (currentQuery) {
            this.performSearch(currentQuery);
          }
        },
        error: (error) => {
          console.error("Error loading feasible chart data:", error);
          this.error = `Failed to load chart data: ${error.message}`;
        }
      });
  }

  private initializeChart(): void {
    this.clearChart();
    this.setupSVG();
    this.setupScales();
    this.setupZoom();
    this.setupUI();
    this.renderChart();
  }

  private clearChart(): void {
    if (this.svg) {
      this.svg.selectAll("*").remove();
    }
    d3.selectAll('.tooltip').remove();
  }

  private extractNaicsDescriptions(data: any[]): any {
    const naicsDescriptions: any = {};
    data.forEach(item => {
      if (item.naics && item.naics_description) {
        naicsDescriptions[item.naics] = item.naics_description;
      }
    });
    return naicsDescriptions;
  }

  private processDataForGrouping(feasibleData: any[]): FeasiblePoint[] {
    return this.chartService.aggregateData(
      feasibleData,
      this.currentGrouping,
      this.extractNaicsDescriptions(feasibleData)
    );
  }

  private setupSVG(): void {
    this.svg = d3.select("#feasiblediv")
      .append('svg')
      .attr('width', "100%")
      .attr('height', this.config.height)
      .style("background", this.config.background)
      .style("cursor", "grab")
      .attr("class", "feasible")
      .on("click", () => {
        const infoBox = document.getElementById("info-box");
        if (infoBox) {
          infoBox.style.visibility = "hidden";
        }
      });
  }

  private setupScales(): void {
    this.scales = FeasibleChartUtils.createScales(this.data, this.bounds);
  }

  private setupZoom(): void {
    const scale = 0.75;
    const margins = this.config.margins;
    const chartWidth = this.config.width + margins.left + margins.right;
    const chartHeight = this.config.height - margins.top - margins.bottom;
    
    const screenCenterX = margins.left + chartWidth / 2;
    const screenCenterY = margins.top + chartHeight / 2;
  
    const dataCenterX = this.scales.x(this.centerX);
    const dataCenterY = this.scales.y(this.centerY);
    
    const translateX = screenCenterX - dataCenterX * scale;
    const translateY = screenCenterY - dataCenterY * scale;
  
    const transform = d3.zoomIdentity.translate(translateX, translateY).scale(scale);

    this.zoomable = this.svg
      .append("g")
      .attr("class", "zoomable")
      .attr("transform", transform);

    const axes = FeasibleChartUtils.createAxes(this.svg, this.scales, this.config);
    this.zoom = FeasibleChartUtils.createZoom(
      this.svg, 
      this.zoomable, 
      this.scales, 
      axes,
    );

    this.svg
      .call(this.zoom)
      .call(this.zoom.transform, transform);
  }

  private updateZoomForNewCenter(): void {
    if (!this.svg || !this.scales || !this.zoom) return;
  
    const currentTransform = d3.zoomTransform(this.svg.node());
    const scale = currentTransform.k;
    const margins = this.config.margins;
    const chartWidth = this.config.width + margins.left + margins.right;
    const chartHeight = this.config.height - margins.top - margins.bottom;
    
    const screenCenterX = margins.left + chartWidth / 2;
    const screenCenterY = margins.top + chartHeight / 2;

    const dataCenterX = this.scales.x(this.centerX);
    const dataCenterY = this.scales.y(this.centerY);
    
    const translateX = screenCenterX - dataCenterX * scale;
    const translateY = screenCenterY - dataCenterY * scale;

    const newTransform = d3.zoomIdentity.translate(translateX, translateY).scale(scale);

    this.svg.transition()
      .duration(750)
      .call(this.zoom.transform, newTransform);
  }

  private setupUI(): void {
    this.trackingLines = FeasibleChartUtils.createTrackingLines(this.svg, this.config);
    this.trackingText = FeasibleChartUtils.createTrackingText(this.svg, this.config);

    FeasibleChartUtils.createReferenceLines(
      this.zoomable, 
      this.scales, 
      this.eci, 
      this.centerX, 
      this.centerY
    );

    FeasibleChartUtils.createAxisLabels(this.svg, this.config);
  }

  private renderChart(): void {
    this.renderPoints();
  }


  private updateDataCoordinates(): void {
    // Add scaled x,y coordinates for tooltip positioning
    if (this.scales && this.data) {
      this.data = this.data.map(point => ({
        ...point,
        x: this.scales.x(point.distance),  // Convert distance to screen x
        y: this.scales.y(point.pci)        // Convert pci to screen y
      }));
    }
  }


  // UPDATED to use utility event handlers
  private renderPoints(): void {


    this.updateDataCoordinates();


    const circles = this.zoomable.selectAll(".feasible-point")
      .data(this.data);

    // Create event handlers using utility
    const eventHandlers = this.chartUtility.createEventHandlers({
      svg: this.svg,
      onMouseover: (event, d) => this.handleCustomMouseover(event, d),
      onMousemove: (event, d) => this.handleCustomMousemove(event, d),
      onMouseleave: (event, d) => this.handleCustomMouseleave(event, d),
      onClick: (event, d) => this.handleCustomClick(event, d),
      createTooltip: (d) => this.createPointTooltip(d),
      enableSelection: true,
      enableTracking: this.enableTracking
    });

    // Enter selection
    circles.enter()
      .append("circle")
      .attr("class", "feasible-point")
      .attr("id", (d: FeasiblePoint) => "circle-" + d.hs2)
      .attr("cx", (d: FeasiblePoint) => this.scales.x(d.distance))
      .attr("cy", (d: FeasiblePoint) => this.scales.y(d.pci))
      .attr("r", (d: FeasiblePoint) => this.scales.radius(d.value))
      .style("opacity", 0.8)
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseover", eventHandlers.mouseover)
      .on("mousemove", eventHandlers.mousemove)
      .on("mouseout", eventHandlers.mouseleave)
      .on("click", eventHandlers.click)
      .attr("fill", (d: FeasiblePoint) => this.getPointColor(d));

    // Update selection
    circles.transition()
      .duration(1000)
      .attr("cx", (d: FeasiblePoint) => this.scales.x(d.distance))
      .attr("cy", (d: FeasiblePoint) => this.scales.y(d.pci))
      .attr("r", (d: FeasiblePoint) => this.scales.radius(d.value))
      .attr("fill", (d: FeasiblePoint) => this.getPointColor(d));

    // Exit selection
    circles.exit().remove();
  }

  // SIMPLIFIED getPointColor using utility
  private getPointColor(point: FeasiblePoint): string {
    return this.chartUtility.getNodeColor(point, {
      searchQuery: this.chartUtility.getCurrentSearchQuery(),
      searchResults: this.chartUtility.getCurrentSearchResults(),
      colorScale: this.coordinationService.isNaicsGrouping() ? this.scales.naicsColor : this.scales.hs4Color,
      defaultColor: 'rgb(249, 251, 251)',
      dimmedColor: 'rgb(249, 251, 251)',
      filterType: this.currentFilterType,
      enabledProductGroups: this.coordinationService.currentProductGroups.filter(g => g.enabled)
    });
  }

  // NEW - Create tooltip using utility
  private createPointTooltip(d: any): any {
    const isNaics = this.coordinationService.isNaicsGrouping();
    const title = isNaics ? `NAICS ${d.hs2}` : `HS ${d.hs2}`;
    const description = isNaics ? d.description : d.description2;

    d.id = d.hs2; // Ensure id is set for tooltip

    const tooltipOptions: TooltipOptions = {
      title: title,
      description: description,
      value: d.value,
      additionalInfo: {
        'Distance': d.distance?.toFixed(4),
        'PCI': d.pci?.toFixed(4)
      },
      showCloseButton: true,
      onClose: (data: any) => {
        // Reset point state
        data.state = 0;
        d3.select("#circle-" + data.hs2).style("stroke-width", "1");
      }
    };

    console.log("Creating tooltip for point:", d);
    console.log("Tooltip options:", tooltipOptions);

    return this.chartUtility.createTooltip("#feasiblediv", d, tooltipOptions);
  }

  // Custom event handlers for chart-specific behavior
  private handleCustomMouseover(event: any, d: FeasiblePoint): void {
    // Chart-specific mouseover logic
    if (d3.select(event.currentTarget).style("fill") !== "rgb(249, 251, 251)") {
      // Already handled by utility, just add custom logic if needed
    }
  }

  private handleCustomMousemove(event: any, d: FeasiblePoint): void {
    if (!this.showTooltips) return;

    // Update tracking lines if enabled
    if (this.enableTracking && d3.select(event.currentTarget).style("fill") !== "rgb(249, 251, 251)") {
      const svgElement = this.svg.node();
      const transform = d3.zoomTransform(svgElement);
      const transformedX = this.scales.x(d.distance) * transform.k + transform.x;
      const transformedY = this.scales.y(d.pci) * transform.k + transform.y;
      
      this.updateTrackingLines(transformedX, transformedY, d);
    }
  }

  private handleCustomMouseleave(event: any, d: FeasiblePoint): void {
    // Hide tracking lines
    if (this.enableTracking) {
      this.trackingLines.lineX.style("opacity", 0);
      this.trackingLines.lineY.style("opacity", 0);
      this.trackingText.textX.style("opacity", 0);
      this.trackingText.textY.style("opacity", 0);
    }
  }

  private handleCustomClick(event: any, d: FeasiblePoint): void {
    // Set point as selected (handled by utility, but emit custom events)
    this.nodeSelected.emit({ node: d, data: undefined, connectedProducts: [] });
  }

  private updateTrackingLines(x: number, y: number, d: FeasiblePoint): void {
    this.trackingLines.lineX
      .attr("x1", x)
      .attr("y1", 0)
      .attr("x2", x)
      .attr("y2", this.config.height)
      .style("opacity", 1);

    this.trackingLines.lineY
      .attr("x1", 0)
      .attr("y1", y)
      .attr("x2", this.config.width)
      .attr("y2", y)
      .style("opacity", 1);

    this.trackingText.textX
      .attr("x", x)
      .text(d.distance.toFixed(4))
      .style("opacity", 1);

    this.trackingText.textY
      .attr("y", y)
      .text(d.pci.toFixed(4))
      .style("opacity", 1);
  }

  private updateDisplayMode(): void {
    try {
      this.svg.select('g').selectAll("rect").remove();
    } catch {}

    switch (this.currentDisplayMode) {
      case DisplayMode.FRONTIER:
        this.displayFrontier();
        break;
      case DisplayMode.FOUR_QUADS:
        this.displayFourQuads();
        break;
      default:
        this.refreshDraw();
        break;
    }
  }

  private displayFrontier(): void {
    const frontierData = this.chartService.getFrontierData(this.data);
    const frontierSet = new Set(frontierData);

    const coloredData = this.data.map(d => {
      if (frontierSet.has(d)) {
        return {
          ...d,
          color: this.coordinationService.isNaicsGrouping() 
            ? this.scales.naicsColor(d.hs2) 
            : this.scales.hs4Color(d.hs4)
        };
      } else {
        return { ...d, color: "rgb(249, 251, 251)" };
      }
    });

    this.updatePointsWithData(coloredData);
  }

  private displayFourQuads(): void {
    const quadData = this.chartService.getFourQuadrantsData(this.data, this.centerX, this.eci);
    this.updatePointsWithData(quadData);
    this.renderQuadrantLegend();
  }

  private renderQuadrantLegend(): void {
    const quads = FeasibleChartUtils.getQuadrantInfo(
      this.scales.x, 
      this.scales.y, 
      this.centerX, 
      this.eci
    );

    const quadSize = 15;
    
    quads.forEach((quad, i) => {
      this.zoomable.append("rect")
        .attr("class", "quadrant-legend")
        .attr("x", quad.x)
        .attr("y", quad.y)
        .attr("width", quadSize)
        .attr("height", quadSize)
        .attr("fill", quad.color)
        .attr("stroke", "black")
        .on("mouseover", (event: any) => {
          // Create simple tooltip for quadrant
          const quadTooltip = this.chartUtility.createTooltip("#feasiblediv", { id: `quad-${i}` }, {
            customHtml: `
              <div class="quadtip-title">${quad.title}</div>
              <div class="quadtip-text">${quad.text}</div>
            `,
            showCloseButton: false
          });
          
          console.log("Quadrant tooltip created:", quadTooltip);

          const svgElement = this.svg.node()
          const transform = d3.zoomTransform(svgElement);
          const transformedX = quad.x * transform.k + transform.x;
          const transformedY = quad.y * transform.k + transform.y;

          this.chartUtility.positionTooltip(quadTooltip, {
            x: transformedX,
            y: transformedY
          });
        })
        .on("mouseout", () => {
          d3.selectAll(`#tooltip-quad-${i}`).remove();
        });
    });
  }

  private updatePointsWithData(data: FeasiblePoint[]): void {
    this.zoomable.selectAll(".feasible-point")
      .data(data)
      .transition()
      .duration(1000)
      .attr("cx", (d: FeasiblePoint) => this.scales.x(d.distance))
      .attr("cy", (d: FeasiblePoint) => this.scales.y(d.pci))
      .attr("r", (d: FeasiblePoint) => this.scales.radius(d.value))
      .attr("fill", (d: FeasiblePoint) => d.color || this.getPointColor(d));
  }

  private refreshDraw(): void {
    this.renderPoints();
  }

  private updateDisplay(): void {
    this.zoomable.selectAll(".feasible-point")
      .attr("fill", (d: FeasiblePoint) => this.getPointColor(d));
  }

  // Public methods for external control
  public updateIconFilter(iconClass: string, enabled: boolean): void {
    this.iconTruthMapping[iconClass] = enabled;
    this.updateDisplay();
  }

  public search(query: string): void {
    this.performSearch(query);
  }

  public clearSelections(): void {
    this.data.forEach(point => point.state = 0);

    // Reset visual styles
    this.zoomable.selectAll(".feasible-point")
      .style("stroke-width", "1");

    // Remove all tooltips
    this.chartUtility.removeAllTooltips();
  }

  public clearSearchQuery(): void {
    this.coordinationService.clearSearch();
  }

  public getDataCount(): number {
    return this.data.length;
  }
}