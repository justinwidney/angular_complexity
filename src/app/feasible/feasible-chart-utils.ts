// feasible-chart.utils.ts

import * as d3 from 'd3';
import { 
  FeasibleChartConfig, 
  FeasibleScales,
  IconMapping,
  IconColorMapping,
  IconTruthMapping,
  QuadrantInfo,
  FeasiblePoint,
  GroupingType
} from './feasible-chart-model';

export class FeasibleChartUtils {

  // Chart configuration
  public static getChartConfig(): FeasibleChartConfig {
    return {
      width: 1272,
      height: 700,
      background: "#F9FBFB",
      margins: {
        top: 20,
        right: 20,
        bottom: 80,
        left: 80
      },
      zoom: {
        scaleExtent: [0.5, 2]
      }
    };
  }

  // Icon mappings for product categories
  public static getIconMapping(): IconMapping {
    return {
      "ph ph-horse": [100, 1599], // Agricultural Products
      "ph ph-bowl-food": [1600, 2499], // Food Products
      "ph ph-sketch-logo": [2500, 3899], // Mineral Products
      "ph ph-graph": [3900, 4999], // Chemical Products
      "ph ph-sneaker": [5000, 6799], // Textiles and Apparel
      "ph ph-hammer": [6800, 8399], // Metals and Metal Products
      "ph ph-factory": [8400, 8599], // Machinery and Equipment
      "ph ph-car": [8600, 8999], // Transportation Equipment
      "ph ph-scissors": [9000, 9999] // Miscellaneous Manufactured Products
    };
  }

  // Icon color mappings
  public static getIconColorMapping(): IconColorMapping {
    return {
      "ph ph-horse": "#FF0000", // Agricultural Products - Red
      "ph ph-bowl-food": "#00FF00", // Food Products - Lime
      "ph ph-sketch-logo": "#0000FF", // Mineral Products - Blue
      "ph ph-graph": "#FFFF00", // Chemical Products - Yellow
      "ph ph-factory": "#FF00FF", // Machinery and Equipment - Magenta
      "ph ph-sneaker": "#00FFFF", // Textiles and Apparel - Cyan
      "ph ph-hammer": "#800000", // Metals and Metal Products - Maroon
      "ph ph-car": "#008000", // Transportation Equipment - Green
      "ph ph-scissors": "#000080" // Miscellaneous Manufactured Products - Navy
    };
  }

  // Default icon truth mapping (all enabled)
  public static getDefaultIconTruthMapping(): IconTruthMapping {
    return {
      "ph ph-horse": true,
      "ph ph-bowl-food": true,
      "ph ph-sketch-logo": true,
      "ph ph-graph": true,
      "ph ph-factory": true,
      "ph ph-sneaker": true,
      "ph ph-hammer": true,
      "ph ph-car": true,
      "ph ph-scissors": true
    };
  }

  // Create all scales for the chart
  public static createScales(data: FeasiblePoint[], bounds: any): FeasibleScales {
    const config = this.getChartConfig();

    // X scale (distance)
    const x = d3.scaleLinear()
      .domain([bounds.minDistance, bounds.maxDistance])
      .range([0, config.width - config.margins.left - config.margins.right]);

    // Y scale (PCI)
    const y = d3.scaleLinear()
      .domain([bounds.minPci, bounds.maxPci])
      .range([config.height - config.margins.top - config.margins.bottom, 0]);

    // Radius scale
    const maxValue = d3.max(data, d => d.value) || 1000000000;
    const radius = d3.scaleLinear()
      .domain([0, 1000000000, maxValue])
      .range([4, 23, 60]);

    // Color scales
    const color = d3.scaleThreshold<number, string>()
      .domain([1, 16, 25, 39, 50, 68, 84, 86, 90, 100])
      .range([
        "#FFFFFF", // White
        "#FF0000", // Red
        "#00FF00", // Lime
        "#0000FF", // Blue
        "#FFFF00", // Yellow
        "#FF00FF", // Magenta
        "#00FFFF", // Cyan
        "#800000", // Maroon
        "#008000", // Green
        "#000080"  // Navy
      ]);

    const hs4Color = d3.scaleThreshold<number, string>()
      .domain([1, 1599, 2499, 3899, 4999, 6799, 8399, 8599, 8999, 9999])
      .range([
        "#FFFFFF", // White
        "#FF0000", // Red
        "#00FF00", // Lime
        "#0000FF", // Blue
        "#FFFF00", // Yellow
        "#FF00FF", // Magenta
        "#00FFFF", // Cyan
        "#800000", // Maroon
        "#008000", // Green
        "#000080"  // Navy
      ]);

    const naicsColor = d3.scaleThreshold<number, string>()
      .domain([1111, 1131, 1151, 2111, 2131, 2211, 2361, 2381, 3111, 3151, 3211, 3241, 3361, 3391, 5111, 5191])
      .range([
        "#FF0000", // Red
        "#C0C0C0", // Silver
        "#00FF00", // Lime
        "#0000FF", // Blue
        "#FFFF00", // Yellow
        "#FF00FF", // Magenta
        "#00FFFF", // Cyan
        "#800000", // Maroon
        "#008000", // Green
        "#000080", // Navy
        "#808000", // Olive
        "#800080", // Purple
        "#008080", // Teal
        "#808080", // Gray
        "#FFA500", // Orange
        "#FFC0CB"  // Pink
      ]);

    return {
      x,
      y,
      radius,
      color,
      hs4Color,
      naicsColor
    };
  }

  // Get quadrant information
  public static getQuadrantInfo(
    x: any, 
    y: any, 
    centerX: number, 
    eci: number
  ): QuadrantInfo[] {
    return [
      {
        x: x(centerX) - 70,
        y: y(eci) - 70,
        color: 'yellow',
        title: 'Let it be',
        text: "diversification is feasible and desirable"
      },
      {
        x: x(centerX) + 55,
        y: y(eci) - 70,
        color: 'red',
        title: 'Wish you were here',
        text: "diversification is difficult yet desirable"
      },
      {
        x: x(centerX) - 70,
        y: y(eci) + 55,
        color: 'green',
        title: 'Long road ahead',
        text: "diversification is feasible, but not attractive in terms of complexity"
      },
      {
        x: x(centerX) + 55,
        y: y(eci) + 55,
        color: 'blue',
        title: 'Stuck in the Mud',
        text: "activities that are neither desirable nor accessible"
      }
    ];
  }

  // Get icon class for a given number
  public static getIconClassForNumber(number: number): string | null {
    const iconMapping = this.getIconMapping();
    
    let adjustedNumber = number;
    if (number < 100) {
      adjustedNumber = number * 100;
    }

    for (const [iconClass, [min, max]] of Object.entries(iconMapping)) {
      if (adjustedNumber >= min && adjustedNumber <= max) {
        return iconClass;
      }
    }
    return null;
  }

  // Get color for point based on various criteria
  public static getPointColor(
    point: FeasiblePoint,
    grouping: GroupingType,
    iconTruthMapping: IconTruthMapping,
    filterType: number,
    scales: FeasibleScales
  ): string {
    // For NAICS grouping, use NAICS color
    if (grouping === GroupingType.NAICS2 || grouping === GroupingType.NAICS4) {
      return scales.naicsColor(point.hs2);
    }

    // Get icon for the point
    const iconClass = this.getIconClassForNumber(point.hs4);
    
    // Check if this icon category is enabled
    if (iconClass && iconTruthMapping[iconClass]) {
      switch (filterType) {
        case 1: // All
          if (grouping === GroupingType.HS4) {
            return scales.hs4Color(point.hs4);
          } else if (grouping === GroupingType.HS2) {
            return scales.color(point.hs2);
          }
          break;
        case 2: // RCA > 1
          if (point.rca > 1) {
            return scales.color(point.hs2);
          }
          break;
        case 3: // RCA between 0.2 and 1
          if (point.rca > 0.2 && point.rca < 1) {
            return scales.color(point.hs2);
          }
          break;
      }
    }

    return "rgb(249, 251, 251)"; // Default gray
  }

  // Create axes
  public static createAxes(svg: any, scales: FeasibleScales, config: FeasibleChartConfig): { xAxis: any, yAxis: any } {
    const xAxis = svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(${config.margins.left}, ${config.height - config.margins.bottom})`)
      .call(d3.axisBottom(scales.x));

    const yAxis = svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${config.margins.left}, ${config.margins.top})`)
      .call(d3.axisLeft(scales.y));

    return { xAxis, yAxis };
  }

  // Create zoom behavior
  public static createZoom(
    svg: any,
    zoomable: any,
    scales: FeasibleScales,
    axes: { xAxis: any, yAxis: any },
    onZoom?: () => void
  ): any {
    const config = this.getChartConfig();

    const zoom = d3.zoom()
      .scaleExtent(config.zoom.scaleExtent)
      .on("zoom", (event) => {
        const transform = event.transform;
        
        // Update zoomable group
        zoomable.attr("transform", transform);
        
        // Update axes
        axes.xAxis.call(d3.axisBottom(transform.rescaleX(scales.x)));
        axes.yAxis.call(d3.axisLeft(transform.rescaleY(scales.y)));
        
        // Update tooltip positions
        this.updateTooltipPositions(svg, scales, transform);
        
        // Call optional callback
        if (onZoom) {
          onZoom();
        }
      });

    return zoom;
  }

  // Update tooltip positions during zoom
  private static updateTooltipPositions(svg: any, scales: FeasibleScales, transform: any): void {
    const svgElement = svg.node();
    
    d3.selectAll('.tooltip').each(function(d: any) {
      const tooltip = d3.select(this);
      
      if (d !== undefined) {
        const point = svgElement.createSVGPoint();
        point.x = scales.x(d.distance);
        point.y = scales.y(d.pci);
        
        const transformedX = point.x * transform.k + transform.x;
        const transformedY = point.y * transform.k + transform.y;
        
        tooltip
          .style("left", (transformedX - 50) + "px")
          .style("top", (transformedY + 50) + "px");
      }
    });
  }

  // Create tracking lines
  public static createTrackingLines(svg: any, config: FeasibleChartConfig): { lineX: any, lineY: any } {
    const lineX = svg.append("line")
      .attr("class", "tracking-line-x")
      .style("stroke", "red")
      .style("stroke-dasharray", "4,4")
      .style("stroke-width", 1)
      .style("opacity", 0);

    const lineY = svg.append("line")
      .attr("class", "tracking-line-y")
      .style("stroke", "red")
      .style("stroke-dasharray", "4,4")
      .style("stroke-width", 1)
      .style("opacity", 0);

    return { lineX, lineY };
  }

  // Create text labels for tracking
  public static createTrackingText(svg: any, config: FeasibleChartConfig): { textX: any, textY: any } {
    const textX = svg.append("text")
      .attr("class", "tracking-text-x")
      .attr("y", config.height - 50)
      .attr("x", 0)
      .style("opacity", 0)
      .style("font-size", "12px");

    const textY = svg.append("text")
      .attr("class", "tracking-text-y")
      .attr("x", 10)
      .attr("y", 0)
      .style("opacity", 0)
      .style("font-size", "12px");

    return { textX, textY };
  }

  // Create reference lines (ECI line and center line)
  public static createReferenceLines(
    zoomable: any,
    scales: FeasibleScales,
    eci: number,
    centerX: number,
    centerY: number
  ): void {
    // ECI horizontal line
    zoomable.append("line")
      .attr("class", "eci-line")
      .style("stroke", "black")
      .style("stroke-dasharray", "3, 3")
      .style("stroke-width", 2)
      .attr("x1", -2000)
      .attr("y1", scales.y(eci))
      .attr("x2", 2000)
      .attr("y2", scales.y(eci));

    // Center vertical line
    zoomable.append("line")
      .attr("class", "center-line")
      .style("stroke", "black")
      .style("stroke-dasharray", "3, 3")
      .style("stroke-width", 2)
      .attr("x1", scales.x(centerX))
      .attr("y1", centerY - 1000)
      .attr("x2", scales.x(centerX))
      .attr("y2", centerY + 1000);

    // ECI label
    zoomable.append("text")
      .attr("class", "eci-label")
      .attr("x", 260)
      .attr("y", 235)
      .attr("dy", "1em")
      .text(`ECI ${Math.round(eci * 100) / 100}`);
  }

  // Create axis labels
  public static createAxisLabels(svg: any, config: FeasibleChartConfig): void {
    // X-axis labels
    svg.append("text")
      .attr("class", "axis-label-left")
      .attr("y", config.height - 25)
      .attr("x", 250)
      .style("fill", "black")
      .style("font-size", "16px")
      .text("More Nearby")
      .style("pointer-events", "none");

    svg.append("text")
      .attr("class", "axis-label-right")
      .attr("y", config.height - 25)
      .attr("x", 850)
      .style("fill", "black")
      .style("font-size", "16px")
      .text("Less Nearby")
      .style("pointer-events", "none");
  }

  // Utility method to format numbers
  public static formatNumber(value: number, decimals: number = 2): string {
    return value.toFixed(decimals);
  }

  // Utility method to format dates
  public static formatDate(date: string): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-CA', { year: 'numeric' });
  }

  // Utility method to pad numbers with leading zeros
  public static padNumber(num: number, size: number = 2): string {
    return String(num).padStart(size, '0');
  }
}