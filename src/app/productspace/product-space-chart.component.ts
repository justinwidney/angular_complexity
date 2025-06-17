// product-space-chart.component.ts

interface TooltipDatum { x: number; y: number; }

import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { ProductSpaceChartService } from './product-space-chart-service';
import { ProductSpaceChartUtils } from './product-space-chart-utils';
import { Link, Node, GroupedData , GroupLabel} from './product-space-chart.models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-space-chart',
  template: `<div #chartContainer id="graphdiv"></div>`,
  styleUrls: ['./product-space-chart.component.scss']
})
export class ProductSpaceChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() showGroupLabels: boolean = true;
  @Input() customGroupLabels?: Partial<GroupLabel>[];
  @Input() tooltipEnabled: boolean = true;
  @Input() highlightConnections: boolean = true;

  // Event emitters for parent component interaction
  @Output() nodeSelected = new EventEmitter<{node: Node, data: GroupedData | undefined}>();
  @Output() nodeHovered = new EventEmitter<{node: Node, data: GroupedData | undefined}>();
  @Output() rowHighlight = new EventEmitter<number>();
  @Output() chartDataLoaded = new EventEmitter<{totalSum: number, nodeCount: number, dataCount: number}>();

  private svg: any;
  private zoomable: any;
  private tooltip: any;
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

  constructor(private chartService: ProductSpaceChartService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Chart will be initialized after data is loaded
  }

  ngOnDestroy(): void {

    if (this.svg) {
      this.svg.remove();
    }

    d3.selectAll('.tooltip').remove();
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
      .on("mouseover", (event, d) => this.handleMouseover(event, d))
      .on("mousemove", (event, d) => this.handleMousemove(event, d))
      .on("mouseout",  (event, d) => this.handleMouseleave(event, d))
      .on("click",    (event, d) => this.handleMouseclick(event, d));

  // 5. MERGE enter + update, then apply both initial & transition attributes
  enterSel.merge(nodesSel as any)  // cast so TS knows it's compatible
    .transition()
      .duration(1000)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r",  d => {
        const obj = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
        return obj ? this.radiusScale(obj.Value) : 20;
      })
      .attr("fill", d => {
        const rca = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
        return (rca && rca.Value > 0)
          ? this.colorScale(parseInt(d.id, 10))
          : "rgb(249, 251, 251)";
      })
      .style("opacity", 1);
}

 private renderGroupLabels(): void {
    if (this.showGroupLabels) {
      ProductSpaceChartUtils.createGroupLabels(this.zoomable, this.customGroupLabels);
    }
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
            .style('top',  `${ty + 50}px`);
        
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
    console.log('Mouseover on node:', d);
  }

  private handleMousemove(event: any, d: Node): void {

    if (!this.tooltipEnabled) return;

    let value = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
    const displayValue = value !== undefined ? value.Value : 0;
    
    // Emit hover event
    this.nodeHovered.emit({ node: d, data: value });
    
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

    // Create tooltip if it doesn't exist (key part from your original code)
    if (d3.select("#tooltip-" + d.id).empty()) {
      const tooltip = this.createTooltip(d);
      tooltip
        .style("left", (transformedX - 50) + "px")
        .style("top", (transformedY + 50) + "px");
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
    this.nodeSelected.emit({ node: d, data: value });
    
    this.changeInfoBox(d);
    
    if (this.highlightConnections) {
      const edges = this.links.filter((x) => {
        return (x.source === d.id || x.target === d.id);
      });
      
      const connectedProducts: string[] = [];
      this.highlightRowByProductId(value ? value.product : parseInt(d.id));
      
      edges.forEach((x) => {
        const addon = x.source !== d.id ? x.target : x.source;
        connectedProducts.push(addon);
        
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
    
    // Set node as selected (state = 1) - this makes tooltip "stick"
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
      .style("top", (transformedY + 50) + "px");
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
    });
  
  }

  // Getter for total sum (useful for parent component)
  public getTotalSum(): number {
    return this.totalSum;
  }

  private createTooltip(d: Node): any {
    const value = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
    const displayValue = value !== undefined ? value.Value : 0;
    const description = value?.description || 'No description available';

    const links = this.links
    
    const newTooltip = d3.select("#graphdiv")
      .append("div")
      .attr("id", "tooltip-" + d.id)
      .attr("class", "tooltip")
          .datum(d)               // ← bind the circle’s data object {x,y,…}
      .style("opacity", 0.9)
        .style("background-color", "rgba(0, 33, 69, .8)")
        .style("border-width", "1px")
        .style("color", "white")
        .style("padding", "20px 15px")
        .style("position", "absolute")
      .style("z-index", "1000")
         .html(`
            <div style="position: relative;">
                <button class="close-button" 
                        style="position: absolute; top: -20px; right: -14px; background: none; color: white; border: none; border-radius: 50%; cursor: pointer; width: 20px; height: 20px;">X</button>
                <div>${d.id}<br>  ${description}  </div>
            </div>
        `);

        newTooltip.select(".close-button").on("click", function() {
                d3.select("#tooltip-" + d.id).remove(); // Remove the tooltip when "X" is clicked
                
                d.state = 0

                //clearRowHighlight(d.id)
            
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
    // Implement your info box update logic here
    console.log('Updating info box for node:', d);
    const value = this.chartService.findGroupedDataByProduct(this.grouped, d.id);
    console.log('Node data:', value);
    
    // Emit event for parent component to handle
    this.nodeSelected.emit({ node: d, data: value });
  }

  private highlightRowByProductId(productId: number): void {
    // Implement your data table row highlighting logic here
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