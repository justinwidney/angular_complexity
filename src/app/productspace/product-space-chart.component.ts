// product-space-chart.component.ts - Refactored with D3SvgChartUtility

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil, distinctUntilChanged, skip } from 'rxjs';
import * as d3 from 'd3';
import { ProductSpaceChartService } from './product-space-chart-service';
import { ProductSpaceChartUtils } from './product-space-chart-utils';
import { ChartCoordinationService } from '../service/chart-coordination.service';
import { Link, Node, GroupedData , GroupLabel} from './product-space-chart.models';
import { FilterType } from '../feasible/feasible-chart-model';

import { ChartUtility, NodeColorOptions, TooltipOptions } from '../d3_utility/chart-nodes-utility';
import { 
  D3SvgChartUtility, 
  ChartDimensions, 
  SVGConfig, 
  ZoomConfig 
} from '../d3_utility/svg-utility';

interface TooltipDatum { x: number; y: number; }

@Component({
  selector: 'app-product-space-chart',
  template: `<div #chartContainer id="graphdiv"></div>`,
  styleUrls: ['./product-space-chart.component.scss']
})
export class ProductSpaceChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() showGroupLabels: boolean = true;
  @Input() customGroupLabels?: Partial<GroupLabel>[];
  @Input() highlightConnections: boolean = true;

  // Event emitters for parent component interaction
  @Output() nodeSelected = new EventEmitter<{node: Node, data: GroupedData | undefined, connectedProducts: string[]}>();
  @Output() nodeHovered = new EventEmitter<{node: Node, data: GroupedData | undefined}>();
  @Output() rowHighlight = new EventEmitter<number>();
  @Output() chartDataLoaded = new EventEmitter<{totalSum: number, nodeCount: number, dataCount: number}>();

  private destroy$ = new Subject<void>();
  private svg: any;
  private zoomable: any;
  private links: Link[] = [];
  private nodes: Node[] = [];
  private grouped: GroupedData[] = [];
  private totalSum: number = 0;
  private selectedRegion: "Alberta" | "British Columbia" | "Manitoba" | "New Brunswick" | "Newfoundland and Labrador" | "Nova Scotia" | "Ontario" | "Prince Edward Island" | "Quebec" | "Saskatchewan" = 'Alberta';
  private colorScale: any;
  private radiusScale: any;
  private zoom: any;
  private clickMeGroup: any;
  private filterType: FilterType = FilterType.ALL;
  private dimensions: ChartDimensions;

  // Search state
  private currentSearchQuery: string = '';
  private searchResults: GroupedData[] = [];

  constructor(
    private chartService: ProductSpaceChartService,
    private coordinationService: ChartCoordinationService,
    private chartUtility: ChartUtility,
    private d3SvgUtility: D3SvgChartUtility  // NEW - D3 SVG utility
  ) {
    // Setup dimensions from config
    const config = ProductSpaceChartUtils.getChartConfig();
    this.dimensions = {
      width: config.width || 1440, // Default width
      height: config.height,
      margins: { top: 20, right: 20, bottom: 20, left: 20 } // Default margins
    };
  }

  ngOnInit(): void {
    this.subscribeToCoordinationService();
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Chart will be initialized after data is loaded
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Use utility cleanup
    this.d3SvgUtility.cleanup('graphdiv');
  }

  private subscribeToCoordinationService(): void {
    // Search using utility
    this.coordinationService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        console.log('Product space chart received search query:', query);
        this.currentSearchQuery = query;
        this.performSearch(query);
      });

    // Keep all existing subscriptions
    this.coordinationService.region$
      .pipe(skip(1), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(region => {
        this.selectedRegion = region as any;
        this.reloadData();
      });

    this.coordinationService.displayMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(displayMode => {
        this.applyDisplayMode();
      });

    this.coordinationService.filterType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filterType => {
        this.filterType = filterType;
        this.applyDisplayMode();
      });

    this.coordinationService.productGroups$
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        this.applyDisplayMode();
      });
  }

  private loadData(): void {
    this.chartService.getAllData(this.selectedRegion).subscribe(({ nodes, links, grouped, totalSum }) => {
      this.nodes = nodes;
      this.links = links;
      this.grouped = grouped;
      this.totalSum = totalSum;
      
      this.chartDataLoaded.emit({
        totalSum: totalSum,
        nodeCount: nodes.length,
        dataCount: grouped.length
      });

      this.initializeChart();
      
      // Re-apply current search if active
      const currentQuery = this.chartUtility.getCurrentSearchQuery();
      if (currentQuery) {
        this.performSearch(currentQuery);
      }
    });
  }

  private reloadData(): void {
    this.chartService.getAllData(this.selectedRegion).subscribe(({ nodes, links, grouped, totalSum }) => {
      this.nodes = nodes;
      this.links = links;
      this.grouped = grouped;
      this.totalSum = totalSum;
      
      this.chartDataLoaded.emit({
        totalSum: totalSum,
        nodeCount: nodes.length,
        dataCount: grouped.length
      });
    });
  }

  // REFACTORED - Using D3 SVG utility
  private initializeChart(): void {
    this.setupSVG();
    this.setupScales();
    this.setupZoom();
    this.renderLinks();
    this.renderNodes();
    this.renderGroupLabels();
  }

  // REFACTORED - Using utility
  private setupSVG(): void {
    const config = ProductSpaceChartUtils.getChartConfig();
    
    const svgConfig: SVGConfig = {
      containerId: 'graphdiv',
      dimensions: this.dimensions,
      background: config.background,
      cursor: "grab"
    };

    const result = this.d3SvgUtility.createSVG(svgConfig);
    this.svg = result.svg;
    this.zoomable = result.zoomable;

    // Add click handler
    this.svg.on("click", (event: any) => this.handleSvgClick(event));
    this.zoomable.on("mouseover", () => this.handleZoomableMouseover());
  }

  private setupScales(): void {
    this.colorScale = ProductSpaceChartUtils.getColorScale();
    this.radiusScale = ProductSpaceChartUtils.getRadiusScale();
  }

  // REFACTORED - Using utility
  private setupZoom(): void {
    const config = ProductSpaceChartUtils.getChartConfig();
    
    const zoomConfig: ZoomConfig = {
      scaleExtent: config.zoom.scaleExtent,
      enablePan: true,
      enableZoom: true,
      onZoom: (transform) => {
        this.handleZoom({ transform });
      }
    };

    this.zoom = this.d3SvgUtility.setupZoom(this.svg, this.zoomable, zoomConfig);

    // Apply initial transform
    const initialTransform = d3.zoomIdentity
      .translate(config.transform.x, config.transform.y)
      .scale(config.transform.scale);
    
    this.svg.call(this.zoom.transform, initialTransform);
  }

  // Keep existing render methods
  private renderLinks(): void {
    d3.select("svg g")
      .selectAll(".link")
      .data(this.links)
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", (d) => {
        const sourceNode = this.chartService.findNodeById(this.nodes, d.source);
        return sourceNode?.x || 0;
      })
      .attr("y1", (d) => {
        const sourceNode = this.chartService.findNodeById(this.nodes, d.source);
        return sourceNode?.y || 0;
      })
      .attr("x2", (d) => {
        const targetNode = this.chartService.findNodeById(this.nodes, d.target);
        return targetNode?.x || 0;
      })
      .attr("y2", (d) => {
        const targetNode = this.chartService.findNodeById(this.nodes, d.target);
        return targetNode?.y || 0;
      })
      .attr("stroke-width", 1)
      .attr("stroke", "gray");
  }

  private renderNodes(): void {
    const svgGroup = d3.select<SVGGElement, unknown>("svg g");

    const nodesSel = svgGroup.selectAll<SVGCircleElement, Node>(".node")
      .data(this.nodes, (d: Node) => d.id);

    nodesSel.exit()
      .transition()
        .duration(500)
        .style("opacity", 0)
      .remove();

    const eventHandlers = this.chartUtility.createEventHandlers({
      svg: this.svg,
      onMouseover: (event, d) => this.handleMouseover(event, d),
      onMousemove: (event, d) => this.handleMousemove(event, d),
      onMouseleave: (event, d) => this.handleMouseleave(event, d),
      onClick: (event, d) => this.handleMouseclick(event, d),
      createTooltip: (d) => this.createNodeTooltip(d),
      enableSelection: true
    });

    const enterSel = nodesSel.enter()
      .append("circle")
      .attr("class", "node")
      .style("stroke", "black")
      .style("cursor", "pointer")
      .on("mouseover", eventHandlers.mouseover)
      .on("mousemove", eventHandlers.mousemove)
      .on("mouseout", eventHandlers.mouseleave)
      .on("click", eventHandlers.click);

    // Use utility animation for updates
    this.d3SvgUtility.animateElements(enterSel.merge(nodesSel as any), {
      duration: 100,
      properties: {
        "cx": (d: unknown) => (d as Node).x,
        "cy": (d: unknown) => (d as Node).y,
        "r": (d: any) => {
          const obj = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
          return obj ? this.radiusScale(obj.Value) : 20;
        },
        "fill": (d: any) => this.getNodeColor(d as Node)
      }
    });

    enterSel.merge(nodesSel as any).style("opacity", 1);
  }

  private renderGroupLabels(): void {
    if (this.showGroupLabels) {
      ProductSpaceChartUtils.createGroupLabels(this.zoomable, this.customGroupLabels);
    }
  }

  private performSearch(query: string): void {
    const searchFilter = this.chartUtility.createSearchFilter(query, this.grouped);
    this.updateNodesForSearch(searchFilter.highlightFunction);
  }

  private updateNodesForSearch(highlightFunction: (item: any) => boolean): void {
    const colorOptions: NodeColorOptions = {
      searchQuery: this.chartUtility.getCurrentSearchQuery(),
      searchResults: this.chartUtility.getCurrentSearchResults(),
      colorScale: this.colorScale,
      defaultColor: 'rgb(249, 251, 251)',
      dimmedColor: 'rgb(249, 251, 251)',
      filterType: this.filterType,
      enabledProductGroups: this.coordinationService.currentProductGroups.filter(g => g.enabled)
    };

    this.chartUtility.updateSelectionColors(
      d3.select("svg g").selectAll<SVGCircleElement, Node>(".node"),
      this.grouped,
      {
        ...colorOptions,
        getItemById: (id: string) => this.chartService.findGroupedDataByProduct(this.grouped, id)
      }
    );
  }

  private getNodeColor(d: Node): string {
    const groupedData = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
    if (!groupedData) return 'rgb(249, 251, 251)';

    return this.chartUtility.getNodeColor(groupedData, {
      searchQuery: this.chartUtility.getCurrentSearchQuery(),
      searchResults: this.chartUtility.getCurrentSearchResults(),
      colorScale: this.colorScale,
      defaultColor: 'rgb(249, 251, 251)',
      dimmedColor: 'rgb(249, 251, 251)',
      filterType: this.filterType,
      enabledProductGroups: this.coordinationService.currentProductGroups.filter(g => g.enabled)
    });
  }

  private createNodeTooltip(d: Node): any {
    const value = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
    const description = value?.description || 'No description available';

    const tooltipOptions: TooltipOptions = {
      title: `Product ${d.id}`,
      description: description,
      value: value?.Value,
      additionalInfo: {
        'RCA': value?.rca?.toFixed(2)
      },
      showCloseButton: true,
      onClose: (data: any) => {
        data.state = 0;
        
        this.links.filter(x => x.source === data.id || x.target === data.id)
          .forEach(x => x.state = 0);
        
        d3.selectAll('line')
          .filter((x: any) => x && (x.source === data.id || x.target === data.id))
          .style("stroke", "gray")
          .style("stroke-width", "1");
      }
    };

    const tooltip = this.chartUtility.createTooltip("#graphdiv", d, tooltipOptions);

    tooltip.select(".close-button").on("click", () => {
      d.state = 0;
      this.links.filter(x => x.source === d.id || x.target === d.id)
        .forEach(x => x.state = 0);
      
      d3.selectAll('line').filter((x: any) => 
        x && ((x.source === d.id || x.target === d.id))
      ).style("stroke", "gray").style("stroke-width", "1");
    });

    return tooltip;
  }

  private applyDisplayMode(): void {
    this.renderNodes();
  }

  public clearSearchQuery(): void {
    this.coordinationService.clearSearch();
  }

  // Event handlers (keep existing logic)
  private handleZoom(event: any): void {
    // Existing zoom logic using utility's transform handling
    d3.selectAll<HTMLDivElement, TooltipDatum>('div.tooltip')
      .each((d, i, nodes) => {
        const el = nodes[i] as HTMLDivElement;
        
        if (d !== undefined) {
          const [tx, ty] = this.d3SvgUtility.applyTransform(event.transform, d.x, d.y);
          d3.select(el)
            .style('left', `${tx - 50}px`)
            .style('top',  `${ty - 75}px`);
        }
      });
  }

  private handleSvgClick(event: any): void {
    const infoBox = document.getElementById("info-box");
    if (infoBox) {
      infoBox.style.visibility = "hidden";
    }
  }

  private handleZoomableMouseover(): void {
    if (this.clickMeGroup) {
      this.clickMeGroup.style("display", "none");
    }
  }

  private handleMouseover(event: any, d: Node): void {
    // Keep existing logic
  }

  private handleMousemove(event: any, d: Node): void {
    if (this.highlightConnections) {
      const edges = this.links.filter((x) => {
        return x.source === d.id || x.target === d.id;
      });

      edges.forEach((edgeData) => {
        const lines = d3.selectAll('line').filter((x: any) => {
          if (!x) return false;
          return ((x.source === edgeData.source && x.target === edgeData.target) || 
                  (x.target === edgeData.source && x.source === edgeData.target)) && 
                  (x.state === 0);
        });
        lines.style("stroke", "red").style("stroke-width", "2");
      });
    }
  }

  private handleMouseleave(event: any, d: Node): void {
    d3.selectAll('line').filter((x: any) => {
      if (!x) return false;
      return x.state === 0;
    })
    .style("stroke", "gray")
    .style("stroke-width", "1");
  }

  private handleMouseclick(event: any, d: Node): void {
    event.stopPropagation();
    
    const value = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
    
    this.changeInfoBox(d);
    let connectedProducts: string[] = [];
    const connectedProductsSet = new Set<string>();

    if (this.highlightConnections) {
      const edges = this.links.filter((x) => {
        return (x.source === d.id || x.target === d.id);
      });
      
      this.highlightRowByProductId(value ? value.product : parseInt(d.id));
      
      edges.forEach((x) => {
        const addon = x.source !== d.id ? x.source : x.target;
        connectedProductsSet.add(addon);

        const lines = d3.selectAll('line').filter((t: any) => {
          if (!t) return false;
          return (t.source === x.source && t.target === x.target);
        });
        
        lines.each((t: any) => {
          t.state = 1;
        });
        
        lines.style("stroke", "black").style("stroke-width", "3");
      });
    }
    
    connectedProducts = Array.from(connectedProductsSet);
    this.nodeSelected.emit({ node: d, data: value, connectedProducts: connectedProducts });
    d.state = 1;
  }

  // Keep all other existing methods
  public refreshChart(): void {
    this.chartService.getAllData(this.selectedRegion).subscribe(({ nodes, links, grouped, totalSum }) => {
      this.nodes = nodes;
      this.links = links;
      this.grouped = grouped;
      this.totalSum = totalSum;
      
      this.chartDataLoaded.emit({
        totalSum: totalSum,
        nodeCount: nodes.length,
        dataCount: grouped.length
      });

      this.renderNodes();
      
      if (this.currentSearchQuery) {
        this.performSearch(this.currentSearchQuery);
      }
    });
  }

  public getTotalSum(): number {
    return this.totalSum;
  }

  private changeInfoBox(d: Node): void {
    const value = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
    this.nodeSelected.emit({ node: d, data: value, connectedProducts: [] });
  }

  private highlightRowByProductId(productId: number): void {
    console.log('Highlighting row for product:', productId);
    this.rowHighlight.emit(productId);
  }

  public clearSelections(): void {
    this.nodes.forEach(node => {
      node.state = 0;
    });

    this.links.forEach(link => {
      link.state = 0;
    });

    d3.selectAll('.node')
      .style("stroke-width", "1");

    d3.selectAll('line')
      .style("stroke", "gray")
      .style("stroke-width", "1");

    this.chartUtility.removeAllTooltips();
  }

  public getDataCount(): number {
    return this.grouped.length;
  }
}