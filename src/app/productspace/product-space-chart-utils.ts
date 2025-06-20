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

  



  // Color scale function
  static getColorScale() {
    return d3.scaleThreshold<number, string>()
      .domain([
        100,   // Start of HS codes (before this = white/no group)
        2500,  // Animal & Food Products (HS 1-24) → Minerals (HS 25-27)
        2800,  // Minerals (HS 25-27) → Chemicals & Plastics (HS 28-40)  
        4100,  // Chemicals & Plastics (HS 28-40) → Raw Materials (HS 41-49)
        5000,  // Raw Materials (HS 41-49) → Textiles (HS 50-63)
        6400,  // Textiles (HS 50-63) → Footwear & Accessories (HS 64-67)
        6800,  // Footwear & Accessories (HS 64-67) → Stone & Glass (HS 68-71)
        7200,  // Stone & Glass (HS 68-71) → Metals (HS 72-83)
        8400,  // Metals (HS 72-83) → Machinery & Electronics (HS 84-85)
        8600,  // Machinery & Electronics (HS 84-85) → Transportation (HS 86-89)
        9000   // Transportation (HS 86-89) → Miscellaneous (HS 90-97)
      ])
      .range([
        "#999999",  // Default/unassigned (HS codes < 100)
        "#E53E3E",  // Animal & Food Products (HS 1-24) - Vibrant Red
        "#00B4D8",  // Minerals (HS 25-27) - Strong Cyan
        "#6F42C1",  // Chemicals & Plastics (HS 28-40) - Deep Purple
        "#28A745",  // Raw Materials (HS 41-49) - Forest Green
        "#FFC107",  // Textiles (HS 50-63) - Bright Amber
        "#E91E63",  // Footwear & Accessories (HS 64-67) - Deep Pink
        "#795548",  // Stone & Glass (HS 68-71) - Brown
        "#FF9800",  // Metals (HS 72-83) - Deep Orange
        "#3F51B5",  // Machinery & Electronics (HS 84-85) - Indigo
        "#009688",  // Transportation (HS 86-89) - Teal
        "#9C27B0"   // Miscellaneous (HS 90-97) - Deep Magenta
      ]);
  }
  
  // Radius scale function - you'll need to adjust the domain/range based on your data
  static getRadiusScale() {
    return d3.scaleLinear()
    .domain([-1, 1500000000, 112498112477])
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