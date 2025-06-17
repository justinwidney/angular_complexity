// feasible-chart.component.ts

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { distinctUntilChanged, skip, Subject, takeUntil } from 'rxjs';
import * as d3 from 'd3';
import { UnifiedDataService } from '../service/chart-data-service'; // Import the unified service
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
  @Output() nodeSelected = new EventEmitter<{node: Node, data: GroupedData | undefined}>();
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
  private rawData: any[] = []; // Store raw data for re-processing

  // UI elements
  private trackingLines: { lineX: any, lineY: any } = { lineX: null, lineY: null };
  private trackingText: { textX: any, textY: any } = { textX: null, textY: null };
  private tooltip: any;
  private hideTooltipTimeout: any;

  // State
  private iconTruthMapping: IconTruthMapping = FeasibleChartUtils.getDefaultIconTruthMapping();
  private currentGrouping: GroupingType = GroupingType.HS4;
  private currentDisplayMode: DisplayMode = DisplayMode.DEFAULT;
  private currentFilterType: FilterType = FilterType.ALL;
  pointSelected: any;
  pointHovered: any;

  // Loading and error states
  loading = false;
  error: string | null = null;

  constructor(
    private unifiedDataService: UnifiedDataService, // Inject unified service
    private chartService: FeasibleChartService,
    private coordinationService: ChartCoordinationService
  ) {
    this.config = FeasibleChartUtils.getChartConfig();
  }

  ngOnInit(): void {
    this.subscribeToCoordinationService();
    this.subscribeToUnifiedService();

  }

  ngAfterViewInit(): void {
    this.loadData();
    this.initializeChart()

  }

    public refreshChart(): void {
    this.renderChart()
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.svg) {
      this.svg.remove();
    }
    
    // Clean up tooltips
    d3.selectAll('.tooltip').remove();
    
    if (this.hideTooltipTimeout) {
      clearTimeout(this.hideTooltipTimeout);
    }
  }

  private subscribeToCoordinationService(): void {
    // Subscribe to region changes
    this.coordinationService.region$
      .pipe(takeUntil(this.destroy$))
      .subscribe(region => {
        //this.loadData();
      });

    // Subscribe to year changes
    this.coordinationService.year$
      .pipe(
        skip(1), 
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(year => {
        console.log("coordinationService year change:", year);
        this.loadData();
      });

    // Subscribe to grouping changes
    this.coordinationService.grouping$
      .pipe(takeUntil(this.destroy$))
      .subscribe(grouping => {
        this.currentGrouping = grouping;
        this.loadData();
      });

    // Subscribe to display mode changes
    this.coordinationService.displayMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(displayMode => {
        this.currentDisplayMode = displayMode;
        this.updateDisplayMode();
      });

    // Subscribe to filter type changes
    this.coordinationService.filterType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterType => {
        this.currentFilterType = filterType;
        //this.updateDisplay();
      });
  }

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
        //this.loadData();
      });
  }

  private loadData(): void {
    const region = this.coordinationService.currentRegion || this.unifiedDataService.getCurrentRegion();
    
    console.log(`Loading feasible chart data for region: ${region}`);

    this.unifiedDataService.getFeasibleChartData(region as any)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          console.log("Feasible chart data loaded:", result);
          
          // Store the raw data for reprocessing
          this.rawData = result.rawData;

          // Process the data for current grouping
          this.data = this.processDataForGrouping(result.feasibleData);
          this.eci = result.eci;
          this.bounds = result.bounds;
          this.centerX = result.bounds.centerX;
          this.centerY = result.bounds.centerY;

          // Emit data loaded event
          this.chartDataLoaded.emit({
            dataCount: this.data.length,
            eci: this.eci
          });

          console.log("Refreshing chart with data", this.data);

          this.refreshChart();

        },
        error: (error) => {
          console.error("Error loading feasible chart data:", error);
          this.error = `Failed to load chart data: ${error.message}`;
        }
      });
  }

  private initializeChart(): void {

    console.log("Initializing chart with data count:", this.data.length, "and ECI:", this.eci);

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
    /**
   * Process data for current grouping type
   */
    private processDataForGrouping(feasibleData: any[]): FeasiblePoint[] {
      // If the data is already processed for the current grouping, return it
      // Otherwise, use the chart service to aggregate it properly
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
      .attr("class", "feasible")
      .on("click", () => {
        // Hide info box on background click
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

    console.log("Setting up zoom with centerX:", this.centerX, "centerY:", this.centerY);

    const translateX = (this.config.width / 2 - this.scales.x(this.centerX));
    const translateY = (this.config.height / 2 - this.scales.y(this.centerY));
    const transform = d3.zoomIdentity.scale(1).translate(translateX, translateY);

    this.zoomable = this.svg
      .append("g")
      .attr("class", "zoomable")
      .attr("transform", transform);

    const axes = FeasibleChartUtils.createAxes(this.svg, this.scales, this.config);
    const zoom = FeasibleChartUtils.createZoom(
      this.svg, 
      this.zoomable, 
      this.scales, 
      axes,
      () => this.onZoomUpdate()
    );

    this.svg
      .call(zoom)
      .call(zoom.transform, transform);
  }

  private setupUI(): void {
    // Create tracking lines and text
    this.trackingLines = FeasibleChartUtils.createTrackingLines(this.svg, this.config);
    this.trackingText = FeasibleChartUtils.createTrackingText(this.svg, this.config);

    // Create tooltip
    this.tooltip = d3.select("#feasiblediv")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip3")
      .style("display", "block")
      .style("padding", "10px")
      .attr("position", "relative");

    // Create reference lines
    FeasibleChartUtils.createReferenceLines(
      this.zoomable, 
      this.scales, 
      this.eci, 
      this.centerX, 
      this.centerY
    );

    // Create axis labels
    FeasibleChartUtils.createAxisLabels(this.svg, this.config);
  }

  private renderChart(): void {
    this.renderPoints();
    //this.updateDisplayMode();
  }

  private renderPoints(): void {

    console.log("Rendering points with data count:", this.data.length);
    console.log("Current Data:", this.data);

    const circles = this.zoomable.selectAll(".feasible-point")
      .data(this.data);

    // Enter selection
    circles.enter()
      .append("circle")
      .attr("class", "feasible-point")
      .attr("id", (d: { hs2: string; }) => "circle-" + d.hs2)
      .attr("cx", (d: { distance: any; }) => this.scales.x(d.distance))
      .attr("cy", (d: { pci: any; }) => this.scales.y(d.pci))
      .attr("r", (d: { value: any; }) => this.scales.radius(d.value))
      .style("opacity", 0.8)
      .style("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", (event: any, d: FeasiblePoint) => this.handleMouseover(event, d))
      .on("mousemove", (event: any, d: FeasiblePoint) => this.handleMousemove(event, d))
      .on("mouseout", (event: any, d: FeasiblePoint) => this.handleMouseleave(event, d))
      .on("click", (event: any, d: FeasiblePoint) => this.handleMouseclick(event, d))
      .attr("fill", (d: FeasiblePoint) => this.getPointColor(d));

    // Update selection
    circles.transition()
      .duration(1000)
      .attr("cx", (d: { distance: any; }) => this.scales.x(d.distance))
      .attr("cy", (d: { pci: any; }) => this.scales.y(d.pci))
      .attr("r", (d: { value: any; }) => this.scales.radius(d.value))
      .attr("fill", (d: FeasiblePoint) => this.getPointColor(d));

    // Exit selection
    circles.exit().remove();
  }

  private getPointColor(point: FeasiblePoint): string {
    return FeasibleChartUtils.getPointColor(
      point,
      this.currentGrouping,
      this.iconTruthMapping,
      this.currentFilterType as number,
      this.scales
    );
  }

  private updateDisplayMode(): void {

    
    try{
      this.svg.select('g').selectAll("rect").remove();
    }
    catch{
    }

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
          this.tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
          this.tooltip.html(`
            <div class="quadtip-title">${quad.title}</div>
            <div class="quadtip-text">${quad.text}</div>
          `)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
          this.tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
    });
  }

  private updatePointsWithData(data: FeasiblePoint[]): void {
    this.zoomable.selectAll(".feasible-point")
      .data(data)
      .transition()
      .duration(1000)
      .attr("cx", (d: { distance: any; }) => this.scales.x(d.distance))
      .attr("cy", (d: { pci: any; }) => this.scales.y(d.pci))
      .attr("r", (d: { value: any; }) => this.scales.radius(d.value))
      .attr("fill", (d: FeasiblePoint) => d.color || this.getPointColor(d));
  }

  private refreshDraw(): void {
    // Re-render points with current settings
    this.renderPoints();
  }

  private updateDisplay(): void {
    this.zoomable.selectAll(".feasible-point")
      .attr("fill", (d: FeasiblePoint) => this.getPointColor(d));
  }

  // Event Handlers
  private handleMouseover(event: any, d: FeasiblePoint): void {
    if (d3.select(event.currentTarget).style("fill") !== "rgb(249, 251, 251)") {
      d3.select(event.currentTarget).style("stroke-width", "4");
    }
  }

  private handleMousemove(event: any, d: FeasiblePoint): void {
    if (!this.showTooltips) return;

    const svgElement = this.svg.node();
    
    if (d3.select(event.currentTarget).style("fill") !== "rgb(249, 251, 251)") {
      const point = svgElement.createSVGPoint();
      point.x = this.scales.x(d.distance);
      point.y = this.scales.y(d.pci);

      const transform = d3.zoomTransform(svgElement);
      const transformedX = point.x * transform.k + transform.x;
      const transformedY = point.y * transform.k + transform.y;

      // Create tooltip if it doesn't exist
      if (d3.select("#tooltip-" + d.hs2).empty()) {
        const tooltip = this.createTooltip(d);
        tooltip.style("left", (transformedX - 50) + "px")
               .style("top", (transformedY + 50) + "px");
      }

      // Update tracking lines
      if (this.enableTracking) {
        this.updateTrackingLines(transformedX, transformedY, d);
      }

      // Emit hover event
      this.pointHovered.emit({ point: d, event });
    }
  }

  private handleMouseleave(event: any, d: FeasiblePoint): void {
    // Hide tracking lines
    if (this.enableTracking) {
      this.trackingLines.lineX.style("opacity", 0);
      this.trackingLines.lineY.style("opacity", 0);
      this.trackingText.textX.style("opacity", 0);
      this.trackingText.textY.style("opacity", 0);
    }

    // Remove tooltip if point is not selected
    if (d.state === 0) {
      d3.select(event.currentTarget).style("stroke-width", "1");
      d3.select("#tooltip-" + d.hs2).remove();
    }
  }

  private handleMouseclick(event: any, d: FeasiblePoint): void {
    event.stopPropagation();
    
    // Set point as selected
    d.state = 1;

    // Update info box
    this.updateInfoBox(d);

    // Emit selection event
    this.pointSelected.emit({ point: d, event });

    // Ensure tooltip persists
    const svgElement = this.svg.node();
    const point = svgElement.createSVGPoint();
    point.x = this.scales.x(d.distance);
    point.y = this.scales.y(d.pci);

    const transform = d3.zoomTransform(svgElement);
    const transformedX = point.x * transform.k + transform.x;
    const transformedY = point.y * transform.k + transform.y;

    let tooltip = d3.select("#tooltip-" + d.hs2);
    if (tooltip.empty()) {
      tooltip = this.createTooltip(d);
    }
    
    tooltip.style("left", (transformedX - 50) + "px")
           .style("top", (transformedY + 50) + "px");
  }

  private createTooltip(data: FeasiblePoint): any {
    const isNaics = this.coordinationService.isNaicsGrouping();
    const titleString = isNaics ? `NAICS ${data.hs2}` : `HS ${data.hs2}`;
    const descriptionString = isNaics ? data.description : data.description2;

    const newTooltip = d3.select("#feasiblediv")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip-" + data.hs2)
      .datum(data)
      .style("opacity", 1)
      .style("background-color", "rgba(0, 33, 69, .8)")
      .style("border-width", "1px")
      .style("color", "white")
      .style("max-width", "500px")
      .style("padding", "13px 12px")
      .style("position", "absolute")
      .html(`
        <div style="position: relative;">
          <button class="close-button" 
                  style="position: absolute; top: -13px; right: -9px; background: none; color: white; border: none; border-radius: 50%; cursor: pointer; width: 20px; height: 20px;">X</button>
          <div>${titleString}<br>${descriptionString}</div>
        </div>
      `);

    newTooltip.select(".close-button").on("click", () => {
      d3.select("#tooltip-" + data.hs2).remove();
      data.state = 0;
      d3.select("#circle-" + data.hs2).style("stroke-width", "1");
    });

    return newTooltip;
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

  private updateInfoBox(d: FeasiblePoint): void {
    const infoBox = document.getElementById("info-box");
    if (infoBox) {
      infoBox.style.visibility = "visible";
    }

    const isNaics = this.coordinationService.isNaicsGrouping();
    const titleString = isNaics ? `NAICS ${d.hs2}` : `HS ${d.hs2}`;
    const hsCodes = this.chartService.getHSCodes();
    const descriptionString = isNaics ? d.description : (hsCodes[d.hs2] || d.description2);

    // Update info box elements
    const productTitle = document.getElementById("ProductTitle");
    const productDescription = document.getElementById("ProductDescription");
    const countryTrade = document.getElementById("CountryTrade");
    const rca = document.getElementById("RCA");
    const pci = document.getElementById("PCI");

    if (productTitle) productTitle.innerHTML = titleString;
    if (productDescription) productDescription.innerHTML = descriptionString;
    if (countryTrade) countryTrade.innerHTML = `$${this.chartService.abbreviateNumber(d.value)}`;
    if (rca) rca.innerHTML = `${Math.round(d.rca * 1000) / 1000}`;
    if (pci) pci.innerHTML = `${Math.round(d.pci * 1000) / 1000}`;
  }

  private onZoomUpdate(): void {
    // This method is called during zoom events
    // Can be used for additional zoom-related updates
  }

  // Public methods for external control
  public updateIconFilter(iconClass: string, enabled: boolean): void {
    this.iconTruthMapping[iconClass] = enabled;
    this.updateDisplay();
  }

  public search(query: string): void {
    const searchResults = this.chartService.searchData(this.data, query);
    const searchSet = new Set(searchResults);

    this.zoomable.selectAll(".feasible-point")
      .attr("fill", (d: FeasiblePoint) => {
        if (searchSet.has(d)) {
          return this.getPointColor(d);
        } else {
          return "rgb(249, 251, 251)";
        }
      });
  }

  public clearSelections(): void {
    // Reset all point states
    this.data.forEach(point => point.state = 0);

    // Reset visual styles
    this.zoomable.selectAll(".feasible-point")
      .style("stroke-width", "1");

    // Remove all tooltips
    d3.selectAll('.tooltip').remove();
  }

  public resetZoom(): void {
    if (this.svg) {
      this.svg.transition()
        .duration(750)
        .call(d3.zoom().transform, d3.zoomIdentity);
    }
  }
}