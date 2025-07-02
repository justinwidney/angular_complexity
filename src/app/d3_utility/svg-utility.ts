// d3-svg-chart-utility.ts - Enhanced with axis rescaling during zoom

import { Injectable } from '@angular/core';
import * as d3 from 'd3';

export interface ChartDimensions {
  width: number ;
  height: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface SVGConfig {
  containerId: string;
  dimensions: ChartDimensions;
  background?: string;
  cursor?: string;
  className?: string;
}

export interface ZoomConfig {
  scaleExtent: [number, number];
  enablePan?: boolean;
  enableZoom?: boolean;
  onZoom?: (transform: any) => void;
  onZoomEnd?: (transform: any) => void;
  // NEW: Enable axis rescaling during zoom
  enableAxisRescaling?: boolean;
  originalScales?: { x?: any; y?: any }; // Store original scales for rescaling
  axisElements?: { xAxis?: any; yAxis?: any }; // Axis elements to update
}

export interface AxisConfig {
  x?: {
    scale: any;
    position: 'top' | 'bottom';
    tickCount?: number;
    tickFormat?: (d: any) => string;
    label?: string;
    labelOffset?: number;
  };
  y?: {
    scale: any;
    position: 'left' | 'right';
    tickCount?: number;
    tickFormat?: (d: any) => string;
    label?: string;
    labelOffset?: number;
  };
}

export interface ScaleConfig {
  x?: {
    type: 'linear' | 'ordinal' | 'time' | 'log';
    domain: any[];
    range: [number, number];
  };
  y?: {
    type: 'linear' | 'ordinal' | 'time' | 'log';
    domain: any[];
    range: [number, number];
  };
  color?: {
    type: 'ordinal' | 'linear';
    domain: any[];
    range: string[];
  };
  radius?: {
    domain: [number, number];
    range: [number, number];
  };
}

export interface ReferenceLineConfig {
  x?: {
    value: number;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    label?: string;
  };
  y?: {
    value: number;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    label?: string;
  };
}

export interface TrackingConfig {
  showLines?: boolean;
  showValues?: boolean;
  lineStroke?: string;
  lineStrokeWidth?: number;
  textColor?: string;
  textSize?: string;
}

@Injectable({
  providedIn: 'root'
})
export class D3SvgChartUtility {

  /**
   * Create and configure SVG element
   */
  createSVG(config: SVGConfig): { svg: any; zoomable: any } {
    // Clear existing SVG
    d3.select(`#${config.containerId}`).selectAll("*").remove();

    const svg = d3.select(`#${config.containerId}`)
      .append('svg')
      .attr('width', config.dimensions.width)
      .attr('height', config.dimensions.height)
      .style("background", config.background || "white")
      .style("cursor", config.cursor || "default");

    if (config.className) {
      svg.attr("class", config.className);
    }

    // Create zoomable group
    const zoomable = svg
      .append("g")
      .attr("class", "zoomable");

    return { svg, zoomable };
  }

  /**
   * Create scales based on configuration
   */
  createScales(config: ScaleConfig, data?: any[]): any {
    const scales: any = {};

    // X Scale
    if (config.x) {
      switch (config.x.type) {
        case 'linear':
          scales.x = d3.scaleLinear()
            .domain(config.x.domain)
            .range(config.x.range);
          break;
        case 'ordinal':
          scales.x = d3.scaleBand()
            .domain(config.x.domain)
            .range(config.x.range)
            .padding(0.1);
          break;
        case 'time':
          scales.x = d3.scaleTime()
            .domain(config.x.domain)
            .range(config.x.range);
          break;
        case 'log':
          scales.x = d3.scaleLog()
            .domain(config.x.domain)
            .range(config.x.range);
          break;
      }
    }

    // Y Scale
    if (config.y) {
      switch (config.y.type) {
        case 'linear':
          scales.y = d3.scaleLinear()
            .domain(config.y.domain)
            .range(config.y.range);
          break;
        case 'ordinal':
          scales.y = d3.scaleBand()
            .domain(config.y.domain)
            .range(config.y.range)
            .padding(0.1);
          break;
        case 'time':
          scales.y = d3.scaleTime()
            .domain(config.y.domain)
            .range(config.y.range);
          break;
        case 'log':
          scales.y = d3.scaleLog()
            .domain(config.y.domain)
            .range(config.y.range);
          break;
      }
    }

    // Color Scale
    if (config.color) {
      if (config.color.type === 'ordinal') {
        scales.color = d3.scaleOrdinal()
          .domain(config.color.domain)
          .range(config.color.range);
      } else if (config.color.type === 'linear') {
        //scales.color = d3.scaleLinear()
        //  .domain(config.color.domain as number[])
         // .range(config.color.range);
      }
    }

    // Radius Scale
    if (config.radius) {
      scales.radius = d3.scaleSqrt()
        .domain(config.radius.domain)
        .range(config.radius.range);
    }

    return scales;
  }

  /**
   * Create and configure axes
   */
  createAxes(svg: any, scales: any, config: AxisConfig, dimensions: ChartDimensions): { xAxis?: any; yAxis?: any } {
    const axes: any = {};

    // X Axis
    if (config.x && scales.x) {
      const xAxisGenerator = config.x.position === 'top' ? d3.axisTop(scales.x) : d3.axisBottom(scales.x);
      
      if (config.x.tickCount) {
        xAxisGenerator.ticks(config.x.tickCount);
      }
      if (config.x.tickFormat) {
        xAxisGenerator.tickFormat(config.x.tickFormat);
      }

      const yPosition = config.x.position === 'top' ? 
        dimensions.margins.top : 
        dimensions.height - dimensions.margins.bottom;

      axes.xAxis = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${yPosition})`)
        .call(xAxisGenerator);

      // Add label
      if (config.x.label) {
        svg.append("text")
          .attr("class", "x-axis-label")
          .attr("text-anchor", "middle")
          .attr("x", dimensions.margins.left + (dimensions.width - dimensions.margins.left - dimensions.margins.right) / 2)
          .attr("y", yPosition + (config.x.labelOffset || 40))
          .text(config.x.label);
      }
    }

    // Y Axis
    if (config.y && scales.y) {
      const yAxisGenerator = config.y.position === 'right' ? d3.axisRight(scales.y) : d3.axisLeft(scales.y);
      
      if (config.y.tickCount) {
        yAxisGenerator.ticks(config.y.tickCount);
      }
      if (config.y.tickFormat) {
        yAxisGenerator.tickFormat(config.y.tickFormat);
      }

      const xPosition = config.y.position === 'right' ? 
        dimensions.width - dimensions.margins.right : 
        dimensions.margins.left;

      axes.yAxis = svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${xPosition}, 0)`)
        .call(yAxisGenerator);

      // Add label
      if (config.y.label) {
        svg.append("text")
          .attr("class", "y-axis-label")
          .attr("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .attr("x", -(dimensions.margins.top + (dimensions.height - dimensions.margins.top - dimensions.margins.bottom) / 2))
          .attr("y", xPosition - (config.y.labelOffset || 40))
          .text(config.y.label);
      }
    }

    return axes;
  }

  /**
   * Setup zoom behavior with enhanced axis rescaling support
   */
  setupZoom(svg: any, zoomable: any, config: ZoomConfig): any {
    const zoom = d3.zoom()
      .scaleExtent(config.scaleExtent);

    if (!config.enablePan) {
      zoom.translateExtent([[0, 0], [0, 0]]);
    }

    zoom.on("zoom", (event) => {
      if (zoomable) {
        zoomable.attr("transform", event.transform);
      }

      // NEW: Handle axis rescaling during zoom
      if (config.enableAxisRescaling && config.originalScales && config.axisElements) {
        this.rescaleAxesDuringZoom(event.transform, config.originalScales, config.axisElements);
      }
      
      if (config.onZoom) {
        config.onZoom(event.transform);
      }

      // Update tooltips if they exist
      this.updateTooltipPositions(event.transform, config.originalScales);
    });

    if (config.onZoomEnd) {
      zoom.on("end", (event) => {
        config.onZoomEnd!(event.transform);
      });
    }

    svg.call(zoom);
    return zoom;
  }

  /**
   * NEW: Rescale axes during zoom operations
   */
  private rescaleAxesDuringZoom(
    transform: any, 
    originalScales: { x?: any; y?: any }, 
    axisElements: { xAxis?: any; yAxis?: any }
  ): void {
    // Rescale X axis
    if (originalScales.x && axisElements.xAxis) {
      const newXScale = transform.rescaleX(originalScales.x);
      axisElements.xAxis.call(d3.axisBottom(newXScale));
    }

    // Rescale Y axis  
    if (originalScales.y && axisElements.yAxis) {
      const newYScale = transform.rescaleY(originalScales.y);
      axisElements.yAxis.call(d3.axisLeft(newYScale));
    }
  }

  /**
   * Create reference lines
   */
  createReferenceLines(container: any, scales: any, config: ReferenceLineConfig): void {
    // Remove existing reference lines
    container.selectAll('.reference-line').remove();
    container.selectAll('.reference-label').remove();

    // X Reference Line
    if (config.x && scales.x) {

      const line = container.append("line")
        .attr("class", "reference-line x-reference")
        .attr("x1", scales.x(config.x.value))
        .attr("y1", scales.y.range()[1]-2000)
        .attr("x2", scales.x(config.x.value))
        .attr("y2", scales.y.range()[0]+2000)
        .attr("stroke", config.x.stroke || "#666")
        .attr("stroke-width", config.x.strokeWidth || 1);

      if (config.x.strokeDasharray) {
        line.attr("stroke-dasharray", config.x.strokeDasharray);
      }

      if (config.x.label) {
        container.append("text")
          .attr("class", "reference-label x-reference-label")
          .attr("x", scales.x(config.x.value) + 5)
          .attr("y", scales.y.range()[1] + 15)
          .attr("fill", config.x.stroke || "#666")
          .style("font-size", "12px")
          .text(config.x.label);
      }
    }

    // Y Reference Line
    if (config.y && scales.y) {
      const line = container.append("line")
        .attr("class", "reference-line y-reference")
        .attr("x1", scales.x.range()[0]-2000)
        .attr("y1", scales.y(config.y.value))
        .attr("x2", scales.x.range()[1]+2000)
        .attr("y2", scales.y(config.y.value))
        .attr("stroke", config.y.stroke || "#666")
        .attr("stroke-width", config.y.strokeWidth || 1);

      if (config.y.strokeDasharray) {
        line.attr("stroke-dasharray", config.y.strokeDasharray);
      }

      if (config.y.label) {
        container.append("text")
          .attr("class", "reference-label y-reference-label")
          .attr("x", scales.x.range()[0] - 5)
          .attr("y", scales.y(config.y.value) - 5)
          .attr("fill", config.y.stroke || "#666")
          .attr("text-anchor", "end")
          .style("font-size", "12px")
          .text(config.y.label);
      }
    }
  }

  /**
   * Create tracking lines for mouse movement
   */
  createTrackingLines(svg: any, dimensions: ChartDimensions, config?: TrackingConfig): {
    lineX: any;
    lineY: any;
    textX: any;
    textY: any;
  } {
    const defaultConfig: TrackingConfig = {
      showLines: true,
      showValues: true,
      lineStroke: "black",
      lineStrokeWidth: 1,
      textColor: "black",
      textSize: "12px",
      ...config
    };

    const trackingGroup = svg.append("g").attr("class", "tracking-group");

    const lineX = trackingGroup.append("line")
      .attr("class", "tracking-line-x")
      .attr("stroke", defaultConfig.lineStroke)
      .attr("stroke-width", defaultConfig.lineStrokeWidth)
      .style("opacity", 0);

    const lineY = trackingGroup.append("line")
      .attr("class", "tracking-line-y")
      .attr("stroke", defaultConfig.lineStroke)
      .attr("stroke-width", defaultConfig.lineStrokeWidth)
      .style("opacity", 0);

    const textX = trackingGroup.append("text")
      .attr("class", "tracking-text-x")
      .attr("y", dimensions.height - 5)
      .attr("text-anchor", "middle")
      .attr("fill", defaultConfig.textColor)
      .style("font-size", defaultConfig.textSize)
      .style("opacity", 0);

    const textY = trackingGroup.append("text")
      .attr("class", "tracking-text-y")
      .attr("x", 5)
      .attr("text-anchor", "start")
      .attr("fill", defaultConfig.textColor)
      .style("font-size", defaultConfig.textSize)
      .style("opacity", 0);

    return { lineX, lineY, textX, textY };
  }

  /**
   * Update tracking lines position
   */
  updateTrackingLines(
    trackingElements: { lineX: any; lineY: any; textX: any; textY: any },
    x: number,
    y: number,
    dimensions: ChartDimensions,
    values?: { xValue?: string | number; yValue?: string | number }
  ): void {
    // Update line positions
    trackingElements.lineX
      .attr("x1", x)
      .attr("y1", dimensions.margins.top)
      .attr("x2", x)
      .attr("y2", dimensions.height - dimensions.margins.bottom)
      .style("opacity", 1);

    trackingElements.lineY
      .attr("x1", dimensions.margins.left)
      .attr("y1", y)
      .attr("x2", dimensions.width - dimensions.margins.right)
      .attr("y2", y)
      .style("opacity", 1);

    // Update text positions and values
    if (values) {
      if (values.xValue !== undefined) {
        trackingElements.textX
          .attr("x", x)
          .text(values.xValue)
          .style("opacity", 1);
      }
      
      if (values.yValue !== undefined) {
        trackingElements.textY
          .attr("y", y)
          .text(values.yValue)
          .style("opacity", 1);
      }
    }
  }

  /**
   * Hide tracking lines
   */
  hideTrackingLines(trackingElements: { lineX: any; lineY: any; textX: any; textY: any }): void {
    trackingElements.lineX.style("opacity", 0);
    trackingElements.lineY.style("opacity", 0);
    trackingElements.textX.style("opacity", 0);
    trackingElements.textY.style("opacity", 0);
  }

  /**
   * Center view on specific coordinates
   */
  centerView(
    svg: any,
    zoom: any,
    targetX: number,
    targetY: number,
    scale: number,
    dimensions: ChartDimensions,
    duration: number = 750
  ): void {
    const centerX = dimensions.margins.left + (dimensions.width - dimensions.margins.left - dimensions.margins.right) / 2;
    const centerY = dimensions.margins.top + (dimensions.height - dimensions.margins.top - dimensions.margins.bottom) / 2;
    
    const translateX = centerX - targetX * scale;
    const translateY = centerY - targetY * scale;
    
    const transform = d3.zoomIdentity.translate(translateX, translateY).scale(scale);
    
    if (duration > 0) {
      svg.transition()
        .duration(duration)
        .call(zoom.transform, transform);
    } else {
      svg.call(zoom.transform, transform);
    }
  }

  /**
   * ENHANCED: Update tooltip positions during zoom with better coordinate handling
   */
  private updateTooltipPositions(transform: any, originalScales?: { x?: any; y?: any }): void {
    d3.selectAll('.tooltip')
      .each(function(d: any) {
        const tooltip = d3.select(this);
        if (d && d.distance !== undefined && d.pci !== undefined && originalScales?.x && originalScales?.y) {
          // Use original scales to get base coordinates, then apply transform
          const baseX = originalScales.x(d.distance);
          const baseY = originalScales.y(d.pci);
          const transformedX = baseX * transform.k + transform.x;
          const transformedY = baseY * transform.k + transform.y;
          
          tooltip
            .style('left', `${transformedX - 50}px`)
            .style('top', `${transformedY - 75}px`);
        }
      });
  }

  /**
   * Create grid lines
   */
  createGrid(container: any, scales: any, dimensions: ChartDimensions, config?: {
    showX?: boolean;
    showY?: boolean;
    xTickCount?: number;
    yTickCount?: number;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
  }): void {
    const defaultConfig = {
      showX: true,
      showY: true,
      xTickCount: 10,
      yTickCount: 10,
      stroke: "#e0e0e0",
      strokeWidth: 1,
      opacity: 0.7,
      ...config
    };

    const gridGroup = container.append("g").attr("class", "grid-group");

    // X Grid Lines
    if (defaultConfig.showX && scales.x) {
      const xTicks = scales.x.ticks ? scales.x.ticks(defaultConfig.xTickCount) : scales.x.domain();
      
      gridGroup.selectAll(".grid-line-x")
        .data(xTicks)
        .enter()
        .append("line")
        .attr("class", "grid-line-x")
        .attr("x1", (d: any) => scales.x(d))
        .attr("y1", scales.y.range()[1])
        .attr("x2", (d: any) => scales.x(d))
        .attr("y2", scales.y.range()[0])
        .attr("stroke", defaultConfig.stroke)
        .attr("stroke-width", defaultConfig.strokeWidth)
        .style("opacity", defaultConfig.opacity);
    }

    // Y Grid Lines
    if (defaultConfig.showY && scales.y) {
      const yTicks = scales.y.ticks ? scales.y.ticks(defaultConfig.yTickCount) : scales.y.domain();
      
      gridGroup.selectAll(".grid-line-y")
        .data(yTicks)
        .enter()
        .append("line")
        .attr("class", "grid-line-y")
        .attr("x1", scales.x.range()[0])
        .attr("y1", (d: any) => scales.y(d))
        .attr("x2", scales.x.range()[1])
        .attr("y2", (d: any) => scales.y(d))
        .attr("stroke", defaultConfig.stroke)
        .attr("stroke-width", defaultConfig.strokeWidth)
        .style("opacity", defaultConfig.opacity);
    }
  }

  /**
   * Animate elements with common transitions
   */
  animateElements(selection: any, config: {
    duration?: number;
    delay?: number;
    ease?: any;
    properties: { [key: string]: any };
  }): void {
    const transition = selection.transition()
      .duration(config.duration || 1000);

    if (config.delay) {
      transition.delay(config.delay);
    }

    if (config.ease) {
      transition.ease(config.ease);
    }

    Object.keys(config.properties).forEach(property => {
      transition.attr(property, config.properties[property]);
    });
  }

  /**
   * Cleanup chart resources
   */
  cleanup(containerId: string): void {
    // Remove SVG
    d3.select(`#${containerId}`).selectAll("*").remove();
    
    // Remove any orphaned tooltips
    d3.selectAll('.tooltip').remove();
    
    // Clear any intervals or timeouts (if you have any running)
    // This would be chart-specific
  }

  /**
   * Get current transform of an element
   */
  getCurrentTransform(element: any): any {
    return d3.zoomTransform(element.node());
  }

  /**
   * Apply transform to coordinates
   */
  applyTransform(transform: any, x: number, y: number): [number, number] {
    return transform.apply([x, y]);
  }

  /**
   * Invert transform to get original coordinates
   */
  invertTransform(transform: any, x: number, y: number): [number, number] {
    return transform.invert([x, y]);
  }

  /**
   * Format numbers for display
   */
  formatNumber(value: number, format?: string): string {
    if (format) {
      return d3.format(format)(value);
    }

    // Default formatting with K, M, B suffixes
    if (Math.abs(value) >= 1e9) {
      return d3.format(".1f")(value / 1e9) + "B";
    } else if (Math.abs(value) >= 1e6) {
      return d3.format(".1f")(value / 1e6) + "M";
    } else if (Math.abs(value) >= 1e3) {
      return d3.format(".1f")(value / 1e3) + "K";
    } else {
      return d3.format(".1f")(value);
    }
  }
}