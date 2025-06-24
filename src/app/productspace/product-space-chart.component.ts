import { distinctUntilChanged, filter, skip } from 'rxjs';
// product-space-chart.component.ts

interface TooltipDatum { x: number; y: number; }

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as d3 from 'd3';
import { ProductSpaceChartService } from './product-space-chart-service';
import { ProductSpaceChartUtils } from './product-space-chart-utils';
import { ChartCoordinationService } from '../service/chart-coordination.service';
import { Link, Node, GroupedData , GroupLabel} from './product-space-chart.models';
import { FilterType } from '../feasible/feasible-chart-model';

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
  @Output() nodeSelected = new EventEmitter<{node: Node, data: GroupedData | undefined,   connectedProducts: string[]  }>();
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
  // Search state
  private currentSearchQuery: string = '';
  private searchResults: GroupedData[] = [];
  private enabledProductGroups: any[] = [];

  constructor(
    private chartService: ProductSpaceChartService,
    private coordinationService: ChartCoordinationService
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
    // Subscribe to search query changes
    this.coordinationService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        console.log('Product space chart received search query:', query);
        this.currentSearchQuery = query;
        this.performSearch(query);
      });

    // Subscribe to other coordination service changes
    this.coordinationService.region$
      .pipe(       
         skip(1), 
         distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(region => {
        // Handle region changes if needed
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

        console.log('Product space chart received filter type:', filterType);

        this.filterType = filterType;
        this.applyDisplayMode();

      });

        // NEW: Subscribe to product group changes
      this.coordinationService.productGroups$
      .pipe(takeUntil(this.destroy$))
      .subscribe(productGroups => {
        this.enabledProductGroups = productGroups.filter(group => group.enabled);
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
      if (this.currentSearchQuery) {
        this.performSearch(this.currentSearchQuery);
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
    this.renderNodes();
    this.renderGroupLabels();
  }

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

    const enterSel = nodesSel.enter()
      .append("circle")
        .attr("class", "node")
        .style("stroke", "black")
        .style("cursor", "pointer")
        .on("mouseover", (event, d) => this.handleMouseover(event, d))
        .on("mousemove", (event, d) => this.handleMousemove(event, d))
        .on("mouseout",  (event, d) => this.handleMouseleave(event, d))
        .on("click",    (event, d) => this.handleMouseclick(event, d));

    // Merge enter + update, then apply both initial & transition attributes
    enterSel.merge(nodesSel as any)
      .transition()
        .duration(1000)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r",  d => {
          const obj = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
          return obj ? this.radiusScale(obj.Value) : 20;
        })
        .attr("fill", d => this.getNodeColor(d))
        .style("opacity", 1);
  }

  private renderGroupLabels(): void {
    if (this.showGroupLabels) {
      ProductSpaceChartUtils.createGroupLabels(this.zoomable, this.customGroupLabels);
    }
  }

  // Search functionality
  private performSearch(query: string): void {
    if (!query.trim()) {
      this.clearSearch();
      return;
    }

    const trimmedQuery = query.trim();

    const lowercaseQuery = trimmedQuery.toLowerCase();
    const isNumericQuery = /^\d+$/.test(trimmedQuery);

    let searchResults: any[] = [];

    // Search in grouped data based on description
    if (isNumericQuery) {
      // Search by HS codes
      searchResults = this.searchByHSCode(trimmedQuery);
      console.log(`📊 HS Code search found ${searchResults.length} results`);
    } else {
      // Search by description (your existing logic)
      searchResults = this.searchByDescription(lowercaseQuery);
      console.log(`📝 Description search found ${searchResults.length} results`);
    }
    
    this.searchResults = searchResults;
    this.updateNodesForSearch();
    
    // Update coordination service with results
    this.coordinationService.setSearchResults(this.searchResults);
  }

 private searchByDescription(lowercaseQuery: string): any[] {

  const cleanQuery = lowercaseQuery
  .replace(/^\d+[\.\s]*-\s*/, '') // Remove "2711 - " pattern
  .toLowerCase();

  return this.grouped.filter(item => {
    if (!item.description) return false;
    
    const originalDescription = item.description.toLowerCase();
    
    // Match against both original and cleaned descriptions
    return originalDescription.includes(lowercaseQuery) || 
          originalDescription.includes(cleanQuery);
  });
}

  private searchByHSCode(hsCode: string): any[] {
    const currentGrouping = this.coordinationService.currentGrouping;
    console.log(`🏷️ Searching HS codes with grouping: ${currentGrouping}`);

    return this.grouped.filter(item => {
      // Get the appropriate HS field based on current grouping
      const itemHSCode = item['product'];
      
      if (!itemHSCode) {
        return false;
      }

      const itemHSString = itemHSCode.toString();
      const isMatch = itemHSString === hsCode || itemHSString.startsWith(hsCode);
      
    
      
      return isMatch;
    });
  }


  private updateNodesForSearch(): void {
    const searchSet = new Set(this.searchResults.map(result => result.product.toString()));
    
    d3.select("svg g").selectAll<SVGCircleElement, Node>(".node")
      .attr("fill", (d: Node) => {
        if (this.currentSearchQuery.trim()) {
          // If searching, only show color for matching nodes
          const match = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
          if (match && searchSet.has(match.product.toString())) {
            return this.getNodeColorNormal(d);
          } else {
            return "rgb(249, 251, 251)"; // Gray for non-matching
          }
        } else {
          // Normal coloring when not searching
          return this.getNodeColorNormal(d);
        }
      });
  }

  private getNodeColor(d: Node): string {

    if (this.currentSearchQuery.trim()) {
      // Search mode coloring
      const match = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
      if (match) {
        const searchSet = new Set(this.searchResults.map(result => result.product.toString()));

        if (searchSet.has(match.product.toString())) {
          return this.getNodeColorNormal(d);
        }
      }
      return "rgb(249, 251, 251)";
    } else {

      // Normal coloring
      return this.getNodeColorNormal(d);
    }
  }

  private getNodeColorNormal(d: Node): string {

    const rca = this.chartService.findGroupedDataByProduct(this.grouped, d.id);


    if (!this.isNodeInEnabledProductGroup(d)) {
      return "rgb(249, 251, 251)"; // Gray out if product group is disabled
    }



    let baseRCAValue: number;
    let topValue: number = 10000;

    switch(this.filterType) {
      case FilterType.ALL:
        baseRCAValue = 0;
        break;
      case FilterType.RCA_ABOVE_1:
        baseRCAValue = 1;
        break;  
      case FilterType.RCA_BETWEEN:
        baseRCAValue = 0.5; // Example value for between 0.5 and 1
        topValue = 1;
        break;
      default:
        baseRCAValue = 0;
    }
    


    return (rca && rca.Value > 0 && (rca.rca! > baseRCAValue && rca.rca! < topValue))
      ? this.colorScale(parseInt(d.id, 10))
      : "rgb(249, 251, 251)";
  }

  // NEW: Helper method to check if node belongs to enabled product group
  private isNodeInEnabledProductGroup(node: Node): boolean {
    // If all product groups are enabled, show all nodes
    const allProductGroups = this.coordinationService.currentProductGroups;
    const enabledGroups = allProductGroups.filter(group => group.enabled);
    
    if (enabledGroups.length === 0 || enabledGroups.length === allProductGroups.length) {
      return true;
    }

    // Get the product from grouped data
    const groupedData = this.chartService.findGroupedDataByProduct(this.grouped, node.id);
    if (!groupedData) {
      return false;
    }

    const productCode = parseInt(groupedData.product?.toString() || '0');
    const hs2Code = Math.floor(productCode );

    // Check if product's HS2 code falls within any enabled product group's ranges
    return enabledGroups.some(group => {
      return group.hsCodeRanges.some((range: any) => 
        hs2Code >= range.min && hs2Code <= range.max
      );
    });
  }


  private clearSearch(): void {
    this.searchResults = [];
    this.updateNodesForSearch();
    this.coordinationService.setSearchResults([]);
  }

  private applyDisplayMode(): void {
    this.renderNodes();
  }

  // Public search methods
  public search(query: string): void {
    this.coordinationService.setSearchQuery(query);
  }

  public clearSearchQuery(): void {
    this.coordinationService.clearSearch();
  }

  public getSearchResults(): GroupedData[] {
    return this.searchResults;
  }

  // Event Handlers
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

    
    const svgElement = this.svg.node()

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

    const point = svgElement.createSVGPoint();
    point.x = d.x;
    point.y = d.y;

    const transform = d3.zoomTransform(svgElement);
    const transformedX = point.x * transform.k + transform.x;
    const transformedY = point.y * transform.k + transform.y;

    // Create tooltip if it doesn't exist
    if (d3.select("#tooltip-" + d.id).empty()) {
      const tooltip = this.createTooltip(d);
      tooltip
        .style("left", (transformedX - 50) + "px")
        .style("top", (transformedY - 75) + "px");
    }
  }

  private handleMouseleave(event: any, d: Node): void {
    // Only remove tooltip and reset styles if node is NOT selected (state = 0)
    if (d.state === 0) {
      d3.select(event.currentTarget).style("stroke-width", "1");
      d3.select("#tooltip-" + d.id).remove();
    }

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

    this.nodeSelected.emit({ node: d, data: value,      connectedProducts: connectedProducts });

    d.state = 1;

    // Update tooltip position for click coordinates
    const transform = d3.zoomTransform(this.svg.node());
    const adjustedXt = (650 - transform.x) + event.pageX;
    const adjustedYt = (390 - transform.y) + event.pageY;
    
    (d as any).originalX = adjustedXt;
    (d as any).originalY = adjustedYt;

    // Ensure tooltip exists and is positioned correctly
    const svgElement = this.svg.node();
    const point = svgElement.createSVGPoint();
    point.x = d.x;
    point.y = d.y;
    const zoomTransform = d3.zoomTransform(svgElement);
    const transformedX = point.x * zoomTransform.k + zoomTransform.x;
    const transformedY = point.y * zoomTransform.k + zoomTransform.y;

    // Create or update tooltip
    let tooltip = d3.select("#tooltip-" + d.id);
    if (tooltip.empty()) {
      tooltip = this.createTooltip(d);
    }
    
    tooltip
      .style("left", (transformedX - 50) + "px")
      .style("top", (transformedY - 75) + "px");
  }

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

  // Getter for total sum (useful for parent component)
  public getTotalSum(): number {
    return this.totalSum;
  }

  private createTooltip(d: Node): any {

    const value = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
    const description = value?.description || 'No description available';

    const links = this.links
    
    const newTooltip = d3.select("#graphdiv")
      .append("div")
      .attr("id", "tooltip-" + d.id)
      .attr("class", "tooltip")
      .datum(d)
      .style("opacity", 0.9)
      .style('background', 'linear-gradient(135deg, #4d94ff 0%, #007bff 100%)')
      .style("border-width", "1px")
      .style("color", "white")
      .style('padding', '12px')
      .style("position", "absolute")
      .style("z-index", "1000")
      .style('border-radius', '6px')
      .style('font-size', '13px')
      .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.3)')
      .style('z-index', '1000')
      .style('max-width', '300px')



      .html(`
        <div style="position: relative;">
          <button class="close-button" 
                  style="position: absolute; top: -13px; right: -9px; 
                  background: none; color: white; border: none; 
                  border-radius: 50%; cursor: pointer; width: 20px; 
                  font-size: 13px;
                  height: 20px;">X</button>
          <div>${description}  </div>
        </div>
      `);

    newTooltip.select(".close-button").on("click", function() {
      d3.select("#tooltip-" + d.id).remove();
      
      d.state = 0

      links.filter(function(x) {
        return (x.source === d.id || x.target === d.id)
      }).forEach(function(x) {
        x.state = 0
      })

      d3.selectAll('line').filter(function(x) { 
        if(!x) return false
        return ((x as Link).source === d.id || (x as Link).target === d.id) 
      }).style("stroke", "gray")
      .style("stroke-width", "1")
    });

    return newTooltip;
  }

  private changeInfoBox(d: Node): void {

    const value = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
    this.nodeSelected.emit({ node: d, data: value, connectedProducts: [] });
  }

  private highlightRowByProductId(productId: number): void {
    console.log('Highlighting row for product:', productId);
    
    // Emit event for parent component to handle
    this.rowHighlight.emit(productId);
  }

  // Method to clear all selections and reset chart state
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

  // Getter for grouped data count
  public getDataCount(): number {
    return this.grouped.length;
  }
}