// product-space-chart.component.ts - SIMPLE FIX - Keep your existing code!

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil, distinctUntilChanged, skip } from 'rxjs';
import * as d3 from 'd3';
import { ProductSpaceChartService } from './product-space-chart-service';
import { ProductSpaceChartUtils } from './product-space-chart-utils';
import { ChartCoordinationService } from '../service/chart-coordination.service';
import { Link, Node, GroupedData , GroupLabel} from './product-space-chart.models';
import { FilterType } from '../feasible/feasible-chart-model';

// Import ONLY the simple search utility
import { ChartUtility, NodeColorOptions, TooltipOptions } from '../d3_utility/chart-search-utility';

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
  private transform: any;
  private clickMeGroup: any;
  private filterType: FilterType = FilterType.ALL;

  // Search state - now using utility
  private currentSearchQuery: string = '';
  private searchResults: GroupedData[] = [];

  constructor(
    private chartService: ProductSpaceChartService,
    private coordinationService: ChartCoordinationService,
    private chartUtility: ChartUtility  // ONLY addition - simple search utility
  ) {}

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

    if (this.svg) {
      this.svg.remove();
    }

    d3.selectAll('.tooltip').remove();
  }

  private subscribeToCoordinationService(): void {
    // Search query changes - SIMPLIFIED using utility
    this.coordinationService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        console.log('Product space chart received search query:', query);
        this.currentSearchQuery = query;
        this.performSearch(query);
      });

    // Keep all your existing subscriptions
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
        this.applyDisplayMode(); // Re-render nodes with new product group filtering
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

  private initializeChart(): void {
    const config = ProductSpaceChartUtils.getChartConfig();
    
    // Setup scales
    this.colorScale = ProductSpaceChartUtils.getColorScale();
    this.radiusScale = ProductSpaceChartUtils.getRadiusScale();

    // Setup transform and zoom
    this.transform = d3.zoomIdentity
      .translate(config.transform.x, config.transform.y)
      .scale(config.transform.scale);

    this.zoom = d3.zoom()
      .scaleExtent(config.zoom.scaleExtent)
      .on("zoom", (event) => this.handleZoom(event));

    // Create SVG
    this.svg = d3.select("#graphdiv")
      .append('svg')
      .attr('width', config.width)
      .attr('height', config.height)
      .style("background", config.background)
      .style("cursor", "grab")
      .on("click", (event) => this.handleSvgClick(event))
      .call(this.zoom)
      .call(this.zoom.transform, this.transform);

    // Create zoomable group
    this.zoomable = this.svg
      .append("g")
      .attr("class", "zoomable")
      .attr("transform", this.transform)
      .on("mouseover", () => this.handleZoomableMouseover());

    this.renderLinks();
    this.renderNodes();  // Keep your existing renderNodes method!
    this.renderGroupLabels();
  }

  // KEEP your existing renderLinks method
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

  // KEEP your existing renderNodes method - just update getNodeColor to use utility
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

    const enterSel =
    nodesSel.enter()
      .append("circle")
      .attr("class", "node")
      .style("stroke", "black")
      .style("cursor", "pointer")
      .on("mouseover", eventHandlers.mouseover)
      .on("mousemove", eventHandlers.mousemove)
      .on("mouseout", eventHandlers.mouseleave)
      .on("click", eventHandlers.click);

    // Merge enter + update, then apply both initial & transition attributes
    enterSel.merge(nodesSel as any)
      .transition()
        .duration(1000)
        .attr("cx", (d: unknown) => (d as Node).x)
        .attr("cy", (d: unknown) => (d as Node).y)
        .attr("r",  d => {
          const obj = this.chartService.findGroupedDataByProduct(this.grouped, (d as Node).id);
          return obj ? this.radiusScale(obj.Value) : 20;
        })
        .attr("fill", d => this.getNodeColor(d as Node))  // ONLY change - use utility for color
        .style("opacity", 1);
  }

  // KEEP your existing renderGroupLabels method
  private renderGroupLabels(): void {
    if (this.showGroupLabels) {
      ProductSpaceChartUtils.createGroupLabels(this.zoomable, this.customGroupLabels);
    }
  }

  // SIMPLIFIED search using utility
  private performSearch(query: string): void {
    const searchFilter = this.chartUtility.createSearchFilter(query, this.grouped);
    
    // Update node colors based on search
    this.updateNodesForSearch(searchFilter.highlightFunction);
  }

  // SIMPLIFIED - just update colors using utility
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

  // SIMPLIFIED getNodeColor using utility
  private getNodeColor(d: Node): string {
    const groupedData = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
    if (!groupedData) return 'rgb(249, 251, 251)';

    const return_color =  this.chartUtility.getNodeColor(groupedData, {
      searchQuery: this.chartUtility.getCurrentSearchQuery(),
      searchResults: this.chartUtility.getCurrentSearchResults(),
      colorScale: this.colorScale,
      defaultColor: 'rgb(249, 251, 251)',
      dimmedColor: 'rgb(249, 251, 251)',
      filterType: this.filterType,
      enabledProductGroups: this.coordinationService.currentProductGroups.filter(g => g.enabled)
    });



    return return_color;

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
        
        // Reset links
        this.links.filter(x => x.source === data.id || x.target === data.id)
          .forEach(x => x.state = 0);
        
        // Reset strokes
        d3.selectAll('line')
          .filter((x: any) => x && (x.source === data.id || x.target === data.id))
          .style("stroke", "gray")
          .style("stroke-width", "1");
      }



    };

    const tooltip = this.chartUtility.createTooltip("#graphdiv", d, tooltipOptions);

    // Add custom close button behavior for links
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



  // KEEP ALL your existing event handlers exactly as they were!
  private handleZoom(event: any): void {
    if (this.zoomable){
      this.zoomable.attr("transform", event.transform);
    }

    d3.selectAll<HTMLDivElement, TooltipDatum>('div.tooltip')
      .each((d, i, nodes) => {
        const el = nodes[i] as HTMLDivElement;
        
        if (d !== undefined) {
          const [tx, ty] = event.transform.apply([d.x, d.y]);
          d3.select(el)
            .style('left', `${tx - 50}px`)
            .style('top',  `${ty - 75}px`);
        }
      })
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
    //pass
  }

  private handleMousemove(event: any, d: Node): void {

    if (this.highlightConnections) {
      const edges = this.links.filter((x) => {
        return x.source === d.id || x.target === d.id;
      });

      // Highlight connected edges (only if not in selected state)
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
   
    // Reset line styles for non-selected links
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
    
    // Emit node selected event
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



  // KEEP all your other existing methods
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
      
      // Re-apply search if active
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
    // Reset all node states
    this.nodes.forEach(node => {
      node.state = 0;
    });

    // Reset all link states
    this.links.forEach(link => {
      link.state = 0;
    });

    // Reset visual styles
    d3.selectAll('.node')
      .style("stroke-width", "1");

    d3.selectAll('line')
      .style("stroke", "gray")
      .style("stroke-width", "1");

    // Remove all tooltips
    d3.selectAll('.tooltip').remove();
  }

  public getDataCount(): number {
    return this.grouped.length;
  }
}