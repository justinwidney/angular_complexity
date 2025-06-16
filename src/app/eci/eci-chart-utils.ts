// eci-chart.utils.ts

import * as d3 from 'd3';
import { 
  ECIChartConfig, 
  ECILineData, 
  ECIDataPoint, 
  ECIScales,
  ECIChartStats,
  ECIMousePosition 
} from './eci-chart.models';

export class ECIChartUtils {

  /**
   * Get default chart configuration
   */
  static getDefaultConfig(): ECIChartConfig {
    return {
      margin: {
        top: 10,
        right: 60,
        bottom: 30,
        left: 60
      },
      width: 1440,
      height: 650,
      colors: [...d3.schemeCategory10],
      defaultPadding: 0.05,
      strokeWidth: 3,
      circleRadius: 5,
      legendSpacing: 25,
      transitionDuration: 750
    };
  }

  /**
   * Merge user config with defaults
   */
  static mergeConfigs(defaultConfig: ECIChartConfig, userConfig: Partial<ECIChartConfig>): ECIChartConfig {
    return {
      ...defaultConfig,
      ...userConfig,
      margin: { ...defaultConfig.margin, ...userConfig.margin }
    };
  }

  /**
   * Calculate chart dimensions
   */
  static getChartDimensions(config: ECIChartConfig): { width: number; height: number } {
    return {
      width: config.width - config.margin.left - config.margin.right,
      height: config.height - config.margin.top - config.margin.bottom
    };
  }

  /**
   * Create D3 scales for the chart
   */
  static createScales(lineData: ECILineData[], config: ECIChartConfig): ECIScales {
    const dimensions = this.getChartDimensions(config);
    
    // Get data ranges
    let allYears: number[] = [];
    let allECIs: number[] = [];

    lineData.forEach(line => {
      line.values.forEach(point => {
        allYears.push(point.year);
        allECIs.push(point.eci);
      });
    });

    const minYear = d3.min(allYears) || 0;
    const maxYear = d3.max(allYears) || 0;
    const minECI = d3.min(allECIs) || 0;
    const maxECI = d3.max(allECIs) || 0;

    const yearRange = maxYear - minYear;
    const eciRange = maxECI - minECI;
    
    const yearPadding = yearRange * config.defaultPadding;
    const eciPadding = eciRange * 0.1;

    // X Scale (years)
    const xScale = d3.scaleLinear()
      .domain([minYear - yearPadding, maxYear + yearPadding])
      .range([0, dimensions.width - 100]);

    // Y Scale (ECI values)
    const yScale = d3.scaleLinear()
      .domain([minECI - eciPadding, maxECI + eciPadding])
      .range([dimensions.height, 0]);

    // Color Scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(lineData.map(line => line.name))
      .range(config.colors);

    return {
      x: xScale,
      y: yScale,
      color: colorScale
    };
  }

  /**
   * Create line generator
   */
  static createLineGenerator(scales: ECIScales): d3.Line<ECIDataPoint> {
    return d3.line<ECIDataPoint>()
      .x(d => scales.x(d.year))
      .y(d => scales.y(d.eci));
  }

  /**
   * Setup tooltip
   */
  static setupTooltip(containerId: string): d3.Selection<HTMLDivElement, unknown, HTMLElement, any> {
    return d3.select(containerId)
      .append("div")
      .style("opacity", 0)
      .attr("class", "eci-tooltip")
      .style("position", "absolute")
      .style("background-color", "rgba(0, 33, 69, 0.9)")
      .style("color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("pointer-events", "none")
      .style("z-index", "1000");
  }

  /**
   * Create axes
   */
  static createAxes(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    scales: ECIScales,
    config: ECIChartConfig
  ): { xAxis: any, yAxis: any } {
    
    const dimensions = this.getChartDimensions(config);

    // Y Axis
    const yAxis = svg.append("g")
      .attr("transform", `translate(${config.margin.left}, ${config.margin.top})`)
      .call(d3.axisLeft(scales.y).tickFormat(d => Number(d).toFixed(2)));

    // X Axis
    const xAxis = svg.append("g")
      .attr("transform", `translate(${config.margin.left}, ${dimensions.height + config.margin.top})`)
      .call(d3.axisBottom(scales.x).ticks(11).tickFormat(d3.format("d")));

    return { xAxis, yAxis };
  }

  /**
   * Create axis labels
   */
  static createAxisLabels(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    config: ECIChartConfig
  ): void {
    const dimensions = this.getChartDimensions(config);

    // Y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 15)
      .attr("x", -(dimensions.height / 2 + config.margin.top))
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text("Economic Complexity Index (ECI)");

    // X-axis label
    svg.append("text")
      .attr("transform", `translate(${dimensions.width / 2 + config.margin.left}, ${config.height - 5})`)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text("Year");
  }

  /**
   * Get mouse position relative to chart
   */
  static getMousePosition(
    event: MouseEvent,
    scales: ECIScales,
    config: ECIChartConfig
  ): ECIMousePosition {
    const [x, y] = d3.pointer(event);
    
    // Adjust for margins
    const adjustedX = x - config.margin.left;
    const adjustedY = y - config.margin.top;
    
    const year = Math.round(scales.x.invert(adjustedX));
    const eci = scales.y.invert(adjustedY);

    return {
      x: adjustedX,
      y: adjustedY,
      year,
      eci
    };
  }

  /**
   * Highlight province lines
   */
  static highlightProvince(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    selectedProvince: string,
    lineData: ECILineData[],
    config: ECIChartConfig
  ): void {
    
    // Fade out all lines
    svg.selectAll("path.eci-line")
      .style("opacity", (d: any) => {
        return d && d.name === selectedProvince ? 1.0 : 0.1;
      })
      .style("stroke-width", (d: any) => {
        return d && d.name === selectedProvince ? config.strokeWidth + 1 : config.strokeWidth - 1;
      });

    // Fade out all circles
    svg.selectAll("circle.eci-point")
      .style("opacity", function(d: any) {
        const circle = d3.select(this);
        const provinceName = circle.attr("data-province");
        return provinceName === selectedProvince ? 1.0 : 0.1;
      })
      .attr("r", function(d: any) {
        const circle = d3.select(this);
        const provinceName = circle.attr("data-province");
        return provinceName === selectedProvince ? config.circleRadius + 1 : config.circleRadius - 1;
      });
  }

  /**
   * Reset all province highlighting
   */
  static resetHighlighting(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    config: ECIChartConfig
  ): void {
    // Restore all lines
    svg.selectAll("path.eci-line")
      .style("opacity", 1.0)
      .style("stroke-width", config.strokeWidth);

    // Restore all circles
    svg.selectAll("circle.eci-point")
      .style("opacity", 1.0)
      .attr("r", config.circleRadius);
  }

  /**
   * Create legend
   */
  static createLegend(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    lineData: ECILineData[],
    scales: ECIScales,
    config: ECIChartConfig,
    provinceMapping: { [key: string]: string },
    onLegendHover?: (provinceName: string) => void,
    onLegendClick?: (provinceName: string) => void
  ): any {
    
    const dimensions = this.getChartDimensions(config);

    const legend = svg.selectAll(".eci-legend")
      .data(lineData)
      .enter().append("g")
      .attr("class", "eci-legend")
      .attr("transform", (d, i) => 
        `translate(${dimensions.width - 110}, ${50 + (i * config.legendSpacing)})`
      )
      .style("cursor", "pointer");

    // Legend lines
    legend.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 20)
      .attr("y2", 0)
      .style("stroke", d => scales.color(d.name))
      .style("stroke-width", config.strokeWidth);

    // Legend text
    legend.append("text")
      .attr("x", 25)
      .attr("y", 4)
      .style("font-size", "12px")
      .style("font-family", "Arial, sans-serif")
      .text(d => provinceMapping[d.name] || d.name);

    // Add event listeners
    if (onLegendHover) {
      legend
        .on("mouseover", (event, d) => onLegendHover(d.name))
        .on("mouseout", () => onLegendHover(''));
    }

    if (onLegendClick) {
      legend.on("click", (event, d) => onLegendClick(d.name));
    }

    return legend;
  }

  /**
   * Format tooltip content
   */
  static formatTooltipContent(
    provinceName: string,
    year: number,
    eci: number,
    provinceMapping: { [key: string]: string }
  ): string {
    const shortName = provinceMapping[provinceName] || provinceName;
    return `
      <div style="font-weight: bold; margin-bottom: 5px;">${shortName}</div>
      <div>Year: ${year}</div>
      <div>ECI: ${eci.toFixed(4)}</div>
    `;
  }

  /**
   * Update tooltip position
   */
  static updateTooltipPosition(
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
    event: MouseEvent,
    content: string
  ): void {
    tooltip
      .html(content)
      .style("left", (event.pageX + 15) + "px")
      .style("top", (event.pageY - 15) + "px")
      .style("opacity", 0.9);
  }

  /**
   * Hide tooltip
   */
  static hideTooltip(tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>): void {
    tooltip.style("opacity", 0);
  }

  /**
   * Animate chart entrance
   */
  static animateChartEntrance(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>,
    config: ECIChartConfig
  ): void {
    svg.selectAll("path.eci-line")
      .style("opacity", 0)
      .transition()
      .duration(config.transitionDuration)
      .style("opacity", 1);

    svg.selectAll("circle.eci-point")
      .style("opacity", 0)
      .attr("r", 0)
      .transition()
      .duration(config.transitionDuration)
      .delay((d, i) => i * 50)
      .style("opacity", 1)
      .attr("r", config.circleRadius);
  }

  /**
   * Export chart as SVG string
   */
  static exportAsSVG(svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): string {
    const svgNode = svg.node();
    if (!svgNode) return '';
    
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgNode);
  }

  /**
   * Validate chart configuration
   */
  static validateConfig(config: ECIChartConfig): boolean {
    return (
      config.width > 0 &&
      config.height > 0 &&
      config.margin.top >= 0 &&
      config.margin.right >= 0 &&
      config.margin.bottom >= 0 &&
      config.margin.left >= 0 &&
      config.colors.length > 0
    );
  }

  /**
   * Calculate optimal tick count for axes
   */
  static getOptimalTickCount(dataRange: number, chartDimension: number): number {
    const idealTickSpacing = 60; // pixels
    const maxTicks = Math.floor(chartDimension / idealTickSpacing);
    return Math.min(maxTicks, Math.max(3, Math.floor(dataRange / 2)));
  }

  /**
   * Deep clone line data
   */
  static cloneLineData(lineData: ECILineData[]): ECILineData[] {
    return lineData.map(line => ({
      name: line.name,
      values: line.values.map(point => ({
        year: point.year,
        eci: point.eci
      }))
    }));
  }
}