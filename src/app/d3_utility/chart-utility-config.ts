// chart-utility-configs.ts - Pre-configured setups for different chart types

import * as d3 from 'd3';
import { 
  D3ChartNodeUtility, 
  NodeRenderConfig, 
  TooltipConfig, 
  SearchConfig, 
  ColorConfig,
  CircleNodeData,
  RectNodeData
} from './chart-nodes-utility';
import { ChartCoordinationService } from '../service/chart-coordination.service';

/**
 * Configuration factory for Product Space Chart
 */
export class ProductSpaceUtilityConfig {
  static createUtility(coordinationService: ChartCoordinationService): D3ChartNodeUtility<CircleNodeData> {
    const nodeConfig: NodeRenderConfig = {
      nodeType: 'circle',
      containerSelector: 'svg g.zoomable',
      nodeClass: 'product-space-node',
      strokeColor: 'black',
      strokeWidth: 1,
      opacity: 1,
      cursor: 'pointer'
    };

    const tooltipConfig: Partial<TooltipConfig> = {
      offset: { x: -50, y: -75 },
      maxWidth: '300px',
      showCloseButton: true,
      customTemplate: (data: CircleNodeData) => `
        <div style="position: relative;">
          <button class="close-button" style="position: absolute; top: -13px; right: -9px; 
                  background: none; color: white; border: none; border-radius: 50%; 
                  cursor: pointer; width: 20px; font-size: 13px; height: 20px;">×</button>
          <div>
            <strong>Product:</strong> ${data.id}<br>
            <strong>Description:</strong> ${data.description || 'N/A'}<br>
            <strong>Value:</strong> $${data.value?.toLocaleString() || 'N/A'}<br>
            <strong>RCA:</strong> ${data.rca?.toFixed(3) || 'N/A'}
          </div>
        </div>
      `
    };

    const searchConfig: Partial<SearchConfig> = {
      searchFields: ['description', 'product'],
      highlightColor: '',
      dimmedColor: 'rgb(249, 251, 251)',
      caseSensitive: false
    };

    const colorConfig: ColorConfig = {
      defaultGrayColor: 'rgb(249, 251, 251)',
      scales: {
        hs4Color: d3.scaleThreshold<number, string>()
          .domain([100, 2500, 2800, 4100, 5000, 6400, 6800, 7200, 8400, 8600, 9000])
          .range([
            "#999999", "#E53E3E", "#00B4D8", "#6F42C1", "#28A745", 
            "#FFC107", "#E91E63", "#795548", "#FF9800", "#3F51B5", 
            "#009688", "#9C27B0"
          ]),
        hs2Color: d3.scaleThreshold<number, string>()
          .domain([1, 25, 28, 41, 50, 64, 68, 72, 84, 86, 90])
          .range([
            "#999999", "#E53E3E", "#00B4D8", "#6F42C1", "#28A745", 
            "#FFC107", "#E91E63", "#795548", "#FF9800", "#3F51B5", 
            "#009688", "#9C27B0"
          ]),
        naicsColor: d3.scaleThreshold<number, string>()
          .domain([1111, 1131, 1151, 2111, 2131, 2211, 2361, 2381, 3111, 3151, 3211, 3241, 3361, 3391, 5111, 5191])
          .range([
            "#FF0000", "#C0C0C0", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", 
            "#00FFFF", "#800000", "#008000", "#000080", "#808000", "#800080", 
            "#008080", "#808080", "#FFA500", "#FFC0CB"
          ])
      }
    };

    return new D3ChartNodeUtility(coordinationService, {
      nodeConfig,
      tooltipConfig,
      searchConfig,
      colorConfig
    });
  }
}

/**
 * Configuration factory for Feasible Chart
 */
export class FeasibleChartUtilityConfig {
  static createUtility(coordinationService: ChartCoordinationService): D3ChartNodeUtility<CircleNodeData> {
    const nodeConfig: NodeRenderConfig = {
      nodeType: 'circle',
      containerSelector: 'svg g.zoomable',
      nodeClass: 'feasible-point',
      strokeColor: 'black',
      strokeWidth: 1,
      opacity: 0.8,
      cursor: 'pointer'
    };

    const tooltipConfig: Partial<TooltipConfig> = {
      offset: { x: -50, y: -75 },
      maxWidth: '300px',
      showCloseButton: true,
      customTemplate: (data: CircleNodeData) => {
        const isNaics = coordinationService.isNaicsGrouping();
        const titleString = isNaics ? `NAICS ${data.id}` : `HS ${data.id}`;
        const descriptionString = data.description || 'No description available';
        
        return `
          <div style="position: relative;">
            <button class="close-button" style="position: absolute; top: -13px; right: -9px; 
                    background: none; color: white; border: none; border-radius: 50%; 
                    cursor: pointer; width: 20px; font-size: 13px; height: 20px;">×</button>
            <div>
              ${titleString}<br>
              ${descriptionString}<br>
              <strong>Distance:</strong> ${(data as any).distance?.toFixed(4) || 'N/A'}<br>
              <strong>PCI:</strong> ${(data as any).pci?.toFixed(4) || 'N/A'}<br>
              <strong>Value:</strong> $${data.value?.toLocaleString() || 'N/A'}
            </div>
          </div>
        `;
      }
    };

    const searchConfig: Partial<SearchConfig> = {
      searchFields: ['description', 'description2', 'product'],
      highlightColor: '',
      dimmedColor: 'rgb(249, 251, 251)',
      caseSensitive: false
    };

    // Use the same color scales as product space chart
    const colorConfig: ColorConfig = ProductSpaceUtilityConfig.createUtility(coordinationService)['colorConfig'];

    return new D3ChartNodeUtility(coordinationService, {
      nodeConfig,
      tooltipConfig,
      searchConfig,
      colorConfig
    });
  }
}

/**
 * Configuration factory for Treemap Chart
 */
export class TreemapUtilityConfig {
  static createUtility(coordinationService: ChartCoordinationService): D3ChartNodeUtility<RectNodeData> {
    const nodeConfig: NodeRenderConfig = {
      nodeType: 'rect',
      containerSelector: 'svg g.treemap-group',
      nodeClass: 'treemap-node',
      strokeColor: '#fff',
      strokeWidth: 1,
      opacity: 1,
      cursor: 'pointer'
    };

    const tooltipConfig: Partial<TooltipConfig> = {
      offset: { x: 15, y: -10 },
      maxWidth: '300px',
      showCloseButton: false,
      customTemplate: (data: RectNodeData) => {
        const percentage = data.value && (data as any).totalValue ? 
          ((data.value / (data as any).totalValue) * 100).toFixed(1) : '0.0';
        
        return `
          <div>
            <strong>${data.description || data.id}</strong><br>
            <strong>Value:</strong> $${data.value?.toLocaleString() || 'N/A'}<br>
            <strong>Percentage:</strong> ${percentage}%<br>
            <strong>NAICS:</strong> ${(data as any).naics || 'N/A'}
          </div>
        `;
      }
    };

    const searchConfig: Partial<SearchConfig> = {
      searchFields: ['description', 'naics_description', 'product'],
      highlightColor: '',
      dimmedColor: 'rgb(249, 251, 251)',
      caseSensitive: false
    };

    const colorConfig: ColorConfig = {
      defaultGrayColor: 'rgb(249, 251, 251)',
      scales: {
        // Treemap uses different coloring scheme
        naicsColor: d3.scaleOrdinal<string>()
          .range([
            "#E53E3E", "#00B4D8", "#6F42C1", "#28A745", "#FFC107", 
            "#E91E63", "#795548", "#FF9800", "#3F51B5", "#009688", 
            "#9C27B0", "#607D8B", "#FF5722", "#4CAF50", "#2196F3"
          ])
      }
    };

    return new D3ChartNodeUtility(coordinationService, {
      nodeConfig,
      tooltipConfig,
      searchConfig,
      colorConfig
    });
  }
}

/**
 * Helper function to convert chart-specific data to utility format
 */
export class ChartDataConverters {
  
  /**
   * Convert Product Space chart data to utility format
   */
  static convertProductSpaceData(
    nodes: any[], 
    grouped: any[], 
    radiusScale: any,
    findGroupedDataByProduct: (grouped: any[], nodeId: string) => any
  ): CircleNodeData[] {
    return nodes.map(node => {
      const groupedData = findGroupedDataByProduct(grouped, node.id);
      
      return {
        id: node.id,
        x: node.x,
        y: node.y,
        r: groupedData ? radiusScale(groupedData.Value) : 20,
        state: node.state || 0,
        value: groupedData?.Value,
        product: groupedData?.product,
        description: groupedData?.description,
        rca: groupedData?.rca,
        cluster_name: node.cluster_name
      };
    });
  }

  /**
   * Convert Feasible Chart data to utility format
   */
  static convertFeasibleData(feasiblePoints: any[], radiusScale: any): CircleNodeData[] {
    return feasiblePoints.map(point => ({
      id: point.hs2?.toString() || point.id,
      x: 0, // Will be set by scales.x(point.distance)
      y: 0, // Will be set by scales.y(point.pci)
      r: radiusScale(point.value),
      state: point.state || 0,
      value: point.value,
      product: point.hs4 || point.product,
      description: point.description,
      description2: point.description2,
      rca: point.rca,
      distance: point.distance,
      pci: point.pci,
      hs2: point.hs2,
      hs4: point.hs4,
      naics2: point.naics2
    }));
  }

  /**
   * Convert Treemap data to utility format
   */
  static convertTreemapData(leaves: any[], totalValue: number): RectNodeData[] {
    return leaves.map(leaf => ({
      id: leaf.data?.naics?.toString() || leaf.id,
      x: leaf.x0,
      y: leaf.y0,
      width: leaf.x1 - leaf.x0,
      height: leaf.y1 - leaf.y0,
      state: 0,
      value: leaf.value,
      product: leaf.data?.product,
      description: leaf.data?.Title || leaf.data?.description,
      naics: leaf.data?.naics,
      naics_description: leaf.data?.naics_description,
      totalValue: totalValue
    }));
  }
}

/**
 * Utility integration helpers
 */
export class ChartUtilityHelpers {
  
  /**
   * Setup common event handlers for Product Space Chart
   */
  static setupProductSpaceEvents(
    utility: D3ChartNodeUtility<CircleNodeData>,
    chartComponent: any,
    chartService: any,
    grouped: any[]
  ): void {
    utility.setEventCallbacks({
      onNodeClick: (event, data) => {
        const groupedData = chartService.findGroupedDataByProduct(grouped, data.id);
        
        // Handle connected products logic here if needed
        let connectedProducts: string[] = [];
        
        chartComponent.nodeSelected.emit({ 
          node: data, 
          data: groupedData, 
          connectedProducts 
        });
        
        // Handle row highlighting
        chartComponent.highlightRowByProductId(groupedData ? groupedData.product : parseInt(data.id));
      },
      
      onNodeHover: (event, data) => {
        const groupedData = chartService.findGroupedDataByProduct(grouped, data.id);
        chartComponent.nodeHovered.emit({ node: data, data: groupedData });
      },
      
      onSearchResults: (results) => {
        chartComponent.coordinationService.setSearchResults(results);
      }
    });
  }

  /**
   * Setup common event handlers for Feasible Chart
   */
  static setupFeasibleEvents(
    utility: D3ChartNodeUtility<CircleNodeData>,
    chartComponent: any
  ): void {
    utility.setEventCallbacks({
      onNodeClick: (event, data) => {
        chartComponent.nodeSelected.emit({ 
          node: data, 
          data: undefined, 
          connectedProducts: [] 
        });
      },
      
      onNodeHover: (event, data) => {
        // Feasible chart hover logic
      },
      
      onSearchResults: (results) => {
        chartComponent.coordinationService.setSearchResults(results);
      }
    });
  }

  /**
   * Setup common event handlers for Treemap Chart
   */
  static setupTreemapEvents(
    utility: D3ChartNodeUtility<RectNodeData>,
    chartComponent: any
  ): void {
    utility.setEventCallbacks({
      onNodeClick: (event, data) => {
        const tooltipData = {
          title: data.description || data.id,
          value: data.value || 0,
          naics: data.naics,
          description: data.description,
          percentage: data.totalValue && data.value ? 
            ((data.value / data.totalValue) * 100) : 0
        };
        
        chartComponent.nodeClicked.emit(tooltipData);
      },
      
      onNodeHover: (event, data) => {
        const tooltipData = {
          title: data.description || data.id,
          value: data.value || 0,
          naics: data.naics,
          description: data.description,
          percentage: data.totalValue && data.value ? 
            ((data.value / data.totalValue) * 100) : 0
        };
        
        chartComponent.nodeHovered.emit(tooltipData);
      }
    });
  }
}