// product-space-chart.utils.ts

import * as d3 from 'd3';
import { Node, GroupedData, GroupLabel } from './product-space-chart.models';

export class ProductSpaceChartUtils {

  // Group labels configuration
  static getGroupLabels(): GroupLabel[] {
    return [
      {
        name: "MineralsGroup",
        text: "Minerals",
        x: 50,
        y: -1000,
        transform: "translate(-655, 0) scale(1)"
      },
      {
        name: "ChemicalsGroup", 
        text: "Chemicals And Basic Metals",
        x: -1450,
        y: -500,
        transform: "translate(-655, 0) scale(1)"
      },
      {
        name: "ElectronicsGroup",
        text: "Electronics", 
        x: -925,
        y: 900,
        transform: "translate(-655, 0) scale(1)"
      },
      {
        name: "MetalsGroup",
        text: "MetalWorking and Machinery",
        x: -325,
        y: 300,
        transform: "translate(-655, 0) scale(1)"
      },
      {
        name: "TextileGroup",
        text: "Textile and Home Goods",
        x: 1375,
        y: 800,
        transform: "translate(-655, 0) scale(1)"
      },
      {
        name: "ApparelGroup",
        text: "Apparel",
        x: 2575,
        y: 1000,
        transform: "translate(-655, 0) scale(1)"
      },
      {
        name: "AgricultureGroup",
        text: "Agriculture Goods",
        x: 2575,
        y: -1000,
        transform: "translate(-655, 0) scale(1)"
      },
      {
        name: "ConstructionGroup",
        text: "Construction Goods",
        x: 1075,
        y: 100,
        transform: "translate(-655, 0) scale(1)"
      }
    ];
  }

  // Create group labels with optional customization
  static createGroupLabels(
    svgGroup: d3.Selection<any, unknown, null, undefined>, 
    customLabels?: Partial<GroupLabel>[]
  ): void {
    const labels = customLabels || this.getGroupLabels();
    
    labels.forEach(label => {
      const labelGroup = svgGroup
        .append("text")
        .attr("x", label.x!)
        .attr("y", label.y!)
        .style("fill", label.fill || "black")
        .style("font-size", `${label.fontSize || 65}px`)
        .style("font-weight", label.fontWeight || "bold")
        .text(label.text!)
        .attr("transform", label.transform || "translate(-655, 0) scale(1)")
        .style("pointer-events", "none")
        .attr("class", label.className || "outlined")
        .attr("id", label.name!);
    });
  }

  

  // Get label by cluster name (useful for dynamic labeling)
  static getLabelByClusterName(clusterName: string): GroupLabel | undefined {
    const labelMap: { [key: string]: string } = {
      'Minerals': 'MineralsGroup',
      'Industrial Chemicals and Metals': 'ChemicalsGroup',
      'Electronic and Electrical Goods': 'ElectronicsGroup',
      'Metalworking and Electrical Machinery and Parts': 'MetalsGroup',
      'Textile and Home Goods': 'TextileGroup',
      'Textile Apparel and Accessories': 'ApparelGroup',
      'Agriculture': 'AgricultureGroup',
      'Construction, Building, and Home Supplies': 'ConstructionGroup'
    };
    
    const labelName = labelMap[clusterName];
    return this.getGroupLabels().find(label => label.name === labelName);
  }


  // Color scale function
  static getColorScale() {
    return d3.scaleThreshold<number, string>()
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
        "#000080", // Navy
      ]);
  }

  // Radius scale function - you'll need to adjust the domain/range based on your data
  static getRadiusScale() {
    return d3.scaleLinear()
    .domain([-1, 1200000000, 12498112477])
    .range([20,45,85])
  }

  // Get node fill color
  static getNodeFill(nodeId: string, grouped: GroupedData[], colorScale: d3.ScaleThreshold<number, string>): string {
    const numericNodeId = parseInt(nodeId, 10);
    const rca = grouped.find(o => o.product === numericNodeId);
    if (rca !== undefined) {
      if (rca.Value > 0) {
        return colorScale(parseInt(nodeId));
      } else {
        return "rgb(249, 251, 251)";
      }
    } else {
      return "rgb(249, 251, 251)";
    }
  }

  // Get node radius
  static getNodeRadius(nodeId: string, grouped: GroupedData[], radiusScale: d3.ScaleLinear<number, number>): number {
    try {
      const numericNodeId = parseInt(nodeId, 10);
      const obj = grouped.find(o => o.product === numericNodeId);

      console.log("Node ID:", nodeId, "Object:", obj);

      return obj ? radiusScale(obj.Value) : 20;
    } catch {
      return 20;
    }
  }

  // Get line coordinates
  static getLineCoordinates(sourceId: string, targetId: string, nodes: Node[]) {
    const sourceNode = nodes.find(node => node.id === sourceId);
    const targetNode = nodes.find(node => node.id === targetId);
    
    return {
      x1: sourceNode?.x || 0,
      y1: sourceNode?.y || 0,
      x2: targetNode?.x || 0,
      y2: targetNode?.y || 0
    };
  }

  // Chart configuration
  static getChartConfig() {
    return {
      width: "100%",
      height: 700,
      background: "#F9FBFB",
      transform: {
        x: 600,
        y: 335,
        scale: 0.22
      },
      zoom: {
        scaleExtent: [0.20, 1] as [number, number]
      }
    };
  }
}