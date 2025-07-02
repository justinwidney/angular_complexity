// feasible-chart.component.ts - Fixed with proper axis rescaling during zoom

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
import { ChartUtility, NodeColorOptions, TooltipOptions } from '../d3_utility/chart-nodes-utility';

// Import the enhanced D3 SVG utility
import { 
  D3SvgChartUtility, 
  ChartDimensions, 
  SVGConfig, 
  ZoomConfig, 
  AxisConfig, 
  ScaleConfig, 
  ReferenceLineConfig,
  TrackingConfig 
} from '../d3_utility/svg-utility';

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
  private scales: any;
  private originalScales: { x?: any; y?: any } = {}; // NEW: Store original scales
  private dimensions: ChartDimensions;
  private data: FeasiblePoint[] = [];
  private eci: number = 0;
  private centerX: number = 0;
  private centerY: number = 0;
  private bounds: any = {};
  private rawData: any[] = [];

  // UI elements - now managed by utility
  private trackingElements: { lineX: any; lineY: any; textX: any; textY: any } | null = null;
  private zoom: any;
  private axes: any; // NEW: Store axis elements for rescaling

  // State
  private iconTruthMapping: IconTruthMapping = FeasibleChartUtils.getDefaultIconTruthMapping();
  private currentGrouping: GroupingType = GroupingType.HS4;
  private currentDisplayMode: DisplayMode = DisplayMode.DEFAULT;
  private currentFilterType: FilterType = FilterType.ALL;
  private enabledProductGroups: any[] = [];

  // Search state
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
    private chartUtility: ChartUtility,
    private d3SvgUtility: D3SvgChartUtility
  ) {
    // Setup dimensions from config
    const config = FeasibleChartUtils.getChartConfig();
    this.dimensions = {
      width: config.width,
      height: config.height,
      margins: config.margins
    };
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
    
    // Use utility cleanup
    this.d3SvgUtility.cleanup('feasiblediv');
  }

  private subscribeToCoordinationService(): void {
    // Search using utility
    this.coordinationService.searchQuery$
      .pipe(
        skip(1), 
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(query => {
        this.currentSearchQuery = query;
        this.performSearch(query);
      });

    // Keep all existing subscriptions...
    this.coordinationService.region$
      .pipe(
        skip(1), 
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(region => this.loadData());

    this.coordinationService.year$
      .pipe(skip(1), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(year => {
        console.log("coordinationService year change:", year);
        this.loadData();
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
        //this.enabledProductGroups = productGroups.filter(group => group.enabled);
        this.updateDisplay();
      });
  }

  private subscribeToUnifiedService(): void {
    this.unifiedDataService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.loading = loading);

    this.unifiedDataService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => this.error = error);
  }

  private performSearch(query: string): void {
    const searchFilter = this.chartUtility.createSearchFilter(query, this.data);
    this.updatePointColors(searchFilter.highlightFunction);
  }

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

          this.chartDataLoaded.emit({
            dataCount: this.data.length,
            eci: this.eci
          });

          // Recreate scales after data loads
          this.createScales();
          this.updateDataCoordinates();
          this.updateReferenceLines();
          this.refreshChart();

          setTimeout(() => {
            this.centerViewOnData();
          }, 100);

          // Re-apply search if active
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

  // REFACTORED - Using D3 SVG utility
  private initializeChart(): void {
    this.setupSVG();
    this.createScales();
    this.setupAxes();
    this.setupZoom(); // MOVED: Setup zoom after axes so we have axis elements
    this.setupUI();
    this.renderChart();
  }

  // REFACTORED - Using utility
  private setupSVG(): void {
    const svgConfig: SVGConfig = {
      containerId: 'feasiblediv',
      dimensions: this.dimensions,
      background: "white",
      cursor: "grab",
      className: "feasible"
    };

    const result = this.d3SvgUtility.createSVG(svgConfig);
    this.svg = result.svg;
    this.zoomable = result.zoomable;

    // Add click handler for info box hiding
    this.svg.on("click", () => {
      const infoBox = document.getElementById("info-box");
      if (infoBox) {
        infoBox.style.visibility = "hidden";
      }
    });
  }

  // FIXED - Use calculated bounds instead of d3.extent()
  private createScales(): void {
    if (!this.data.length || !this.bounds) return;

    console.log("Creating scales with bounds:", this.bounds);

    // Use the CALCULATED BOUNDS from quantiles, not d3.extent()!
    const basicScaleConfig: ScaleConfig = {
      x: {
        type: 'linear',
        domain: [this.bounds.minDistance, this.bounds.maxDistance], // ✅ Use quantile bounds
        range: [this.dimensions.margins.left, this.dimensions.width - this.dimensions.margins.right]
      },
      y: {
        type: 'linear',
        domain: [this.bounds.minPci, this.bounds.maxPci], // ✅ Use quantile bounds
        range: [this.dimensions.height - this.dimensions.margins.bottom, this.dimensions.margins.top]
      }
    };

    const basicScales = this.d3SvgUtility.createScales(basicScaleConfig);

    // PRESERVE ORIGINAL color scales from FeasibleChartUtils - these are domain-specific!
    const fullScales = FeasibleChartUtils.createScales(this.data, this.bounds);

    // Combine utility scales with domain-specific scales
    this.scales = {
      x: basicScales.x,
      y: basicScales.y,
      radius: fullScales.radius,
      color: fullScales.color,           // HS2 threshold scale
      hs4Color: fullScales.hs4Color,     // HS4 threshold scale  
      naicsColor: fullScales.naicsColor  // NAICS threshold scale
    };

    // NEW: Store original scales for zoom rescaling
    this.originalScales = {
      x: this.scales.x.copy(),
      y: this.scales.y.copy()
    };

    // Log for debugging
    console.log("Scale domains:", {
      x: this.scales.x.domain(),
      y: this.scales.y.domain(),
      dataExtent: {
        distance: d3.extent(this.data, d => d.distance),
        pci: d3.extent(this.data, d => d.pci)
      }
    });
  }

  // REFACTORED - Using utility
  private setupAxes(): void {
    const axisConfig: AxisConfig = {
      x: {
        scale: this.scales.x,
        position: 'bottom',
        label: 'Distance',
        labelOffset: 40
      },
      y: {
        scale: this.scales.y,
        position: 'left',
        label: 'Product Complexity Index (PCI)',
        labelOffset: 50
      }
    };

    this.axes = this.d3SvgUtility.createAxes(this.svg, this.scales, axisConfig, this.dimensions);
  }

  // ENHANCED - Setup zoom with axis rescaling
  private setupZoom(): void {
    const zoomConfig: ZoomConfig = {
      scaleExtent: [0.1, 10],
      enablePan: true,
      enableZoom: true,
      enableAxisRescaling: true, // NEW: Enable axis rescaling
      originalScales: this.originalScales, // NEW: Pass original scales
      axisElements: this.axes, // NEW: Pass axis elements
   
    };

    this.zoom = this.d3SvgUtility.setupZoom(this.svg, this.zoomable, zoomConfig);
  }

  // REFACTORED - Using utility
  private setupUI(): void {
    // Create tracking lines using utility
    if (this.enableTracking) {
      const trackingConfig: TrackingConfig = {
        showLines: true,
        showValues: true,
        lineStroke: "black",
        lineStrokeWidth: 1,
        textColor: "red",
        textSize: "12px"
      };

      this.trackingElements = this.d3SvgUtility.createTrackingLines(
        this.svg, 
        this.dimensions, 
        trackingConfig
      );
    }

    this.updateReferenceLines();
  }

  // REFACTORED - Using utility
  private updateReferenceLines(): void {
    if (!this.zoomable || !this.scales) return;

    const referenceConfig: ReferenceLineConfig = {
      x: {
        value: this.centerX,
        stroke: "#666",
        strokeWidth: 2,
        strokeDasharray: "5,5",
      },
      y: {
        value: this.eci,
        stroke: "#666",
        strokeWidth: 2,
        strokeDasharray: "5,5",
        label: `ECI: ${this.eci.toFixed(2)}`
      }
    };

    this.d3SvgUtility.createReferenceLines(this.zoomable, this.scales, referenceConfig);
  }

  // REFACTORED - Using utility
  private centerViewOnData(): void {
    if (!this.svg || !this.scales || !this.zoom) return;

    const targetX = this.scales.x(this.centerX);
    const targetY = this.scales.y(this.eci);

    this.d3SvgUtility.centerView(
      this.svg,
      this.zoom,
      targetX,
      targetY,
      0.75, // scale
      this.dimensions,
      750 // duration
    );
  }

  private updateDataCoordinates(): void {
    if (this.scales && this.data) {
      this.data = this.data.map(point => ({
        ...point,
        x: this.scales.x(point.distance),
        y: this.scales.y(point.pci)
      }));
    }
  }

  private renderChart(): void {
    this.renderPoints();
  }

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
      enableSelection: true
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

    // Update selection using utility animation
    this.d3SvgUtility.animateElements(circles, {
      duration: 1000,
      properties: {
        "cx": (d: FeasiblePoint) => this.scales.x(d.distance),
        "cy": (d: FeasiblePoint) => this.scales.y(d.pci),
        "r": (d: FeasiblePoint) => this.scales.radius(d.value),
        "fill": (d: FeasiblePoint) => this.getPointColor(d)
      }
    });

    // Exit selection
    circles.exit().remove();
  }

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

  private createPointTooltip(d: any): any {
    const isNaics = this.coordinationService.isNaicsGrouping();
    const title = isNaics ? `NAICS ${d.hs2}` : `HS ${d.hs2}`;
    const description = isNaics ? d.description : d.description2;

    d.id = d.hs2;

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
        data.state = 0;
        d3.select("#circle-" + data.hs2).style("stroke-width", "1");
      }
    };

    return this.chartUtility.createTooltip("#feasiblediv", d, tooltipOptions);
  }

  // Custom event handlers
  private handleCustomMouseover(event: any, d: FeasiblePoint): void {
    // Chart-specific behavior
  }

  // FIXED: Mousemove handler using original scales for tracking
  private handleCustomMousemove(event: any, d: FeasiblePoint): void {
    if (!this.showTooltips || !this.trackingElements) return;

    if (this.enableTracking && d3.select(event.currentTarget).style("fill") !== "rgb(249, 251, 251)") {
      const transform = this.d3SvgUtility.getCurrentTransform(this.svg);
      
      // Use original scales to get base coordinates, then apply transform
      const baseX = this.originalScales.x!(d.distance);
      const baseY = this.originalScales.y!(d.pci);
      const [transformedX, transformedY] = this.d3SvgUtility.applyTransform(
        transform, 
        baseX, 
        baseY
      );
      
      // Use utility to update tracking lines
      this.d3SvgUtility.updateTrackingLines(
        this.trackingElements,
        transformedX,
        transformedY,
        this.dimensions,
        {
          xValue: d.distance.toFixed(4),
          yValue: d.pci.toFixed(4)
        }
      );
    }
  }

  private handleCustomMouseleave(event: any, d: FeasiblePoint): void {
    if (this.trackingElements && this.enableTracking) {
      this.d3SvgUtility.hideTrackingLines(this.trackingElements);
    }
  }

  private handleCustomClick(event: any, d: FeasiblePoint): void {
    this.nodeSelected.emit({ node: d, data: undefined, connectedProducts: [] });
  }



  // Keep existing methods for display modes...
  private updateDisplayMode(): void {

    try {
      this.svg.select('g').selectAll("rect").remove();
    } catch {}


    // Your existing display mode logic
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
            x: transformedX - 50 ,
            y: transformedY - 100
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

  // Public methods
  public search(query: string): void {
    this.performSearch(query);
  }

  public clearSelections(): void {
    this.data.forEach(point => point.state = 0);

    this.zoomable.selectAll(".feasible-point")
      .style("stroke-width", "1");

    this.chartUtility.removeAllTooltips();
  }

  public clearSearchQuery(): void {
    this.coordinationService.clearSearch();
  }

  public getDataCount(): number {
    return this.data.length;
  }

  // Optional: Public method to get current outlier stats for debugging
  public getOutlierStats(): any {
    if (this.data.length === 0 || !this.bounds) return null;
    
    const outsideBounds = this.data.filter(d => 
      d.distance < this.bounds.minDistance || d.distance > this.bounds.maxDistance ||
      d.pci < this.bounds.minPci || d.pci > this.bounds.maxPci
    );

    return {
      totalPoints: this.data.length,
      outlierCount: outsideBounds.length,
      outlierPercentage: (outsideBounds.length / this.data.length) * 100,
      bounds: this.bounds,
      dataExtent: {
        distance: d3.extent(this.data, d => d.distance),
        pci: d3.extent(this.data, d => d.pci)
      }
    };
  }

  // Public method to update icon filter
  public updateIconFilter(iconClass: string, enabled: boolean): void {
    this.iconTruthMapping[iconClass] = enabled;
    this.updateDisplay();
  }
}