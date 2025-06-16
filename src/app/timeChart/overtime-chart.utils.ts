// overtime-chart.utils.ts

import * as d3 from 'd3';
import { ChartConfig, ChartDimensions } from './overtime-chart.model';

export class OvertimeChartUtils {
  
  /**
   * Default chart configuration
   */
  static getDefaultConfig(): ChartConfig {
    return {
      keys: [
        "Agricultural Products", 
        "Food Products", 
        "Industrial Products", 
        "Raw Materials", 
        "Machinery and Equipment", 
        "Textiles and Apparel", 
        "Metals and Metal Products", 
        "Transportation Equipment", 
        "Miscellaneous Manufactured Products"
      ],
      
      iconMapping: {
        "Agricultural Products": { min: 10, max: 15 },
        "Food Products": { min: 16, max: 24 },
        "Industrial Products": { min: 25, max: 27 },
        "Raw Materials": { min: 28, max: 49 },
        "Machinery and Equipment": { min: 84, max: 85 },
        "Textiles and Apparel": { min: 50, max: 71 },
        "Metals and Metal Products": { min: 72, max: 83 },
        "Transportation Equipment": { min: 86, max: 89 },
        "Miscellaneous Manufactured Products": { min: 90, max: 96 }
      },
      
      iconCategoryMapping: {
        "ph ph-horse": "Agricultural Products",
        "ph ph-bowl-food": "Food Products",
        "ph ph-sketch-logo": "Industrial Products",
        "ph ph-graph": "Raw Materials",
        "ph ph-factory": "Machinery and Equipment",
        "ph ph-sneaker": "Textiles and Apparel",
        "ph ph-hammer": "Metals and Metal Products",
        "ph ph-car": "Transportation Equipment",
        "ph ph-scissors": "Miscellaneous Manufactured Products"
      },
      
      dimensions: {
        margin: { top: 10, right: 60, bottom: 30, left: 60 },
        width: 1440,
        height: 650
      },
      
      colors: [
        '#e41a1c', '#377eb8', '#4daf4a', '#984ea3', 
        '#ff7f00', '#ffff33', '#a65628', '#f781bf'
      ],
      
      siSymbols: ["", "k", "M", "B", "T", "P", "E"]
    };
  }

  /**
   * Calculate actual chart dimensions
   */
  static getChartDimensions(config: ChartConfig): { width: number; height: number } {
    return {
      width: config.dimensions.width - config.dimensions.margin.left - config.dimensions.margin.right,
      height: config.dimensions.height - config.dimensions.margin.top - config.dimensions.margin.bottom
    };
  }

  /**
   * Create D3 color scale
   */
  static createColorScale(keys: string[], colors: string[]): d3.ScaleOrdinal<string, string> {
    return d3.scaleOrdinal<string>()
      .domain(keys)
      .range(colors);
  }

  /**
   * Create D3 time scale for X axis
   */
  static createXScale(data: any[], width: number): d3.ScaleLinear<number, number> {
    return d3.scaleLinear()
      .domain(d3.extent(data, (d: any) => d.Date) as [number, number])
      .range([0, width]);
  }

  /**
   * Create D3 linear scale for Y axis
   */
  static createYScale(maxValue: number, height: number): d3.ScaleLinear<number, number> {
    return d3.scaleLinear()
      .domain([0, maxValue + 1000000000])
      .range([height, 0]);
  }

  /**
   * Format Y axis ticks
   */
  static formatYAxisTicks(value: number): string {
    const formatted = d3.format(".2s")(value);
    return `$${formatted.replace('G', 'B')}`;
  }

  /**
   * Create D3 stack generator
   */
  static createStackGenerator(keys: string[]): d3.Stack<any, any, string> {
    return d3.stack<any>()
      .keys(keys);
  }

  /**
   * Create D3 area generator
   */
  static createAreaGenerator(
    xScale: d3.ScaleLinear<number, number>, 
    yScale: d3.ScaleLinear<number, number>
  ): d3.Area<any> {
    return d3.area<any>()
      .x((d: any) => xScale(d.data.Date))
      .y0((d: any) => yScale(d[0]))
      .y1((d: any) => yScale(d[1]));
  }

  /**
   * Setup chart tooltip
   */
  static setupTooltip(container: string): d3.Selection<HTMLDivElement, unknown, HTMLElement, any> {
    // Remove existing tooltip
    d3.select(container).select(".tooltip2").remove();
    
    return d3.select(container)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip2")
      .style("display", "none")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("position", "absolute")
      .style("pointer-events", "none");
  }

  /**
   * Create hover line for tooltip
   */
  static createHoverLine(
    svg: d3.Selection<any, unknown, null, undefined>,
    height: number
  ): d3.Selection<SVGLineElement, unknown, null, undefined> {
    return svg.append("line")
      .attr("id", "hover-line")
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", "black")
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3, 3")
      .style("opacity", 0);
  }

  /**
   * Update hover line position
   */
  static updateHoverLine(x: number): void {
    d3.select("#hover-line")
      .attr("x1", x)
      .attr("x2", x)
      .style("opacity", 1);
  }

  /**
   * Hide hover line
   */
  static hideHoverLine(): void {
    d3.select("#hover-line").style("opacity", 0);
  }

  /**
   * DataTable configuration for export functionality
   */
  static getDataTableConfig() {
    return {
      dom: 'Bfrtip',
      bDestroy: true,
      columns: [
        { data: 'Date', title: 'Date', className: 'dt-body-right' },
        { data: 'Grouping', title: 'Grouping', className: 'dt-body-right' },
        { data: 'Mapping', title: 'HS Mapping', className: 'dt-body-right' },
        { data: 'Value', title: 'Value', className: 'dt-body-right' }
      ],
      columnDefs: [
        {
          render: function (data: number) {
            return data.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
          targets: 3
        }
      ],
      layout: {
        topStart: {
          buttons: {
            extend: 'collection',
            text: 'Export',
            buttons: ['copy', 'excel', 'csv', 'pdf', 'print']
          }
        }
      }
    };
  }

  /**
   * Get chart transform values
   */
  static getChartTransform(): { translateX: number; translateY: number } {
    return {
      translateX: 35,
      translateY: 15
    };
  }

  /**
   * Calculate mouse position relative to chart
   */
  static getMousePosition(
    event: MouseEvent, 
    xScale: d3.ScaleLinear<number, number>
  ): { x: number; year: number; index: number } {
    const [xcord] = d3.pointer(event);
    const adjustedX = xcord - 170; // Adjust for transform
    const year = Math.round(xScale.invert(adjustedX));
    const index = year - 2009; // Assuming data starts from 2009
    
    return { x: xcord, year, index };
  }

  /**
   * Validate chart data
   */
  static validateChartData(data: any[]): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Chart data is empty or invalid');
      return false;
    }
    
    // Check if data has required Date property
    const hasValidDates = data.every(d => d.Date && !isNaN(d.Date));
    if (!hasValidDates) {
      console.warn('Chart data contains invalid dates');
      return false;
    }
    
    return true;
  }

  /**
   * Deep clone chart data
   */
  static cloneData<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * Merge chart configurations
   */
  static mergeConfigs(defaultConfig: ChartConfig, userConfig: Partial<ChartConfig>): ChartConfig {
    return {
      ...defaultConfig,
      ...userConfig,
      dimensions: {
        ...defaultConfig.dimensions,
        ...userConfig.dimensions
      },
      iconMapping: {
        ...defaultConfig.iconMapping,
        ...userConfig.iconMapping
      },
      iconCategoryMapping: {
        ...defaultConfig.iconCategoryMapping,
        ...userConfig.iconCategoryMapping
      }
    };
  }
}