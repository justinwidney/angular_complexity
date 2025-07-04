// enhanced-treemap-chart.utils.ts

import * as d3 from 'd3';
import { 
  TreemapConfig, 
  TreemapDataPoint, 
  TreemapNode, 
  TreemapRootData, 
  GroupedData,
  RawTreemapItem,
  TreemapDimensions
} from './treemap-chart.model';

export enum GroupingType {
  HS2 = 'hs2',
  HS4 = 'hs4',
  NAICS = 'naics',
  NAICS2 = 'naics2',
  NAICS4 = 'naics4'
}

export interface GroupingConfig {
  type: GroupingType;
  getKey: (item: RawTreemapItem) => string;
  getDescription: (item: RawTreemapItem, hsDescriptions?: any[]) => string;
  getDisplayName: (key: string) => string;
}

export class TreemapChartUtils {

  /**
   * Default treemap configuration matching your amCharts setup
   */
  static getDefaultConfig(): TreemapConfig {
    return {
      width: 1342,
      height: 650,
      background: "#F9FBFB",
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      colors: [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
        '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5'
      ],
      padding: 1,
      nodeSpacing: 0,
      minNodeSize: 10,
      maxDepth: 2,
      showLabels: true,
      showTooltips: true,
      animationDuration: 1000,
      numberFormat: {
        suffixes: [
          { threshold: 1e9, suffix: 'B' },
          { threshold: 1e6, suffix: 'M' },
          { threshold: 1e3, suffix: 'K' }
        ]
      },
      labelConfig: {
        fontSize: 16,
        fontFamily: 'Arial, sans-serif',
        maxLines: 3,
        wordWrap: true,
        truncate: true
      }
    };
  }

  /**
   * Get grouping configuration for different grouping types
   */
  static getGroupingConfig(groupingType: GroupingType, hsDescriptions: any[] = []): GroupingConfig {
    const configs: Record<GroupingType, GroupingConfig> = {
      [GroupingType.HS2]: {
        type: GroupingType.HS2,
        getKey: (item: RawTreemapItem) => {
          const hs2 = Math.floor(item.product / 100).toString().padStart(2, '0');
          return hs2;
        },
        getDescription: (item: RawTreemapItem, hsDescriptions?: any[]) => {
          const hs2 = Math.floor(item.product / 100);
          return this.getHS2Description(hs2) || `HS2: ${hs2.toString().padStart(2, '0')}`;
        },
        getDisplayName: (key: string) => `HS2: ${key}`
      },

      [GroupingType.HS4]: {
        type: GroupingType.HS4,
        getKey: (item: RawTreemapItem) => item.product.toString().padStart(4, '0'),
        getDescription: (item: RawTreemapItem, hsDescriptions?: any[]) => {
          const hs4Description = hsDescriptions?.find(x => Number(x.HS4) === item.product)?.['HS4 Short Name'];
          return hs4Description || `HS4: ${item.product.toString().padStart(4, '0')}`;
        },
        getDisplayName: (key: string) => `HS4: ${key}`
      },


      [GroupingType.NAICS]: {
        type: GroupingType.NAICS,
        getKey: (item: RawTreemapItem) => item.naics?.toString() || 'Unknown',
        getDescription: (item: RawTreemapItem) => item.naics_description || `NAICS: ${item.naics || 'Unknown'}`,
        getDisplayName: (key: string) => key === 'Unknown' ? 'Unknown NAICS' : `NAICS: ${key}`
      },

      [GroupingType.NAICS2]: {
        type: GroupingType.NAICS2,
        getKey: (item: RawTreemapItem) => {
          if (!item.naics) return 'Unknown';
          const naics2 = Math.floor(Number(item.naics) / Math.pow(10, item.naics.toString().length - 2));
          return naics2.toString().padStart(2, '0');
        },
        getDescription: (item: RawTreemapItem) => {
          if (!item.naics) return 'Unknown NAICS2';
          const naics2 = Math.floor(Number(item.naics) / Math.pow(10, item.naics.toString().length - 2));
          return this.getNAICS2Description(naics2) || `NAICS2: ${naics2.toString().padStart(2, '0')}`;
        },
        getDisplayName: (key: string) => key === 'Unknown' ? 'Unknown NAICS2' : `NAICS2: ${key}`
      },

      [GroupingType.NAICS4]: {
        type: GroupingType.NAICS4,
        getKey: (item: RawTreemapItem) => {
          if (!item.naics) return 'Unknown';
          const naicsStr = item.naics.toString();
          const naics4 = naicsStr.length >= 4 ? naicsStr.substring(0, 4) : naicsStr.padEnd(4, '0');
          return naics4;
        },
        getDescription: (item: RawTreemapItem) => {
          if (!item.naics) return 'Unknown NAICS4';
          const naicsStr = item.naics.toString();
          const naics4 = naicsStr.length >= 4 ? naicsStr.substring(0, 4) : naicsStr.padEnd(4, '0');
          return `NAICS4: ${naics4}`;
        },
        getDisplayName: (key: string) => key === 'Unknown' ? 'Unknown NAICS4' : `NAICS4: ${key}`
      }
    };

    return configs[groupingType];
  }

  /**
   * Generic grouping function that works with any grouping type
   */
  static groupByType(data: RawTreemapItem[], groupingType: GroupingType, hsDescriptions: any[] = []): GroupedData {
    const config = this.getGroupingConfig(groupingType, hsDescriptions);
    
    return data.reduce((result: GroupedData, currentItem: RawTreemapItem) => {
      const groupKey = config.getKey(currentItem);
      
      if (!result[groupKey]) {
        result[groupKey] = {
          product: groupKey,
          provExpValue: 0,
          Title: config.getDescription(currentItem, hsDescriptions),
          naics: groupingType.includes('naics') ? currentItem.naics : 'undefined',
          hs2: groupingType.includes('hs') ? Math.floor(currentItem.product / 100) : 0,
          hs4: groupingType.includes('hs') ? currentItem.product : 0,
          groupingType: groupingType,
          groupKey: groupKey
        };
      }
      
      // Sum up values for the group
      result[groupKey].provExpValue += Number(currentItem.Value) || 0;
      
      return result;
    }, {});
  }

  /**
   * Legacy method - now delegates to the generic grouping function
   */
  static groupByNaics(data: RawTreemapItem[]): GroupedData {
    return this.groupByType(data, GroupingType.NAICS);
  }

  /**
   * Get HS2 category descriptions
   */
  static getHS2Description(hs2Code: number): string {
    const hs2Descriptions: Record<number, string> = {
      1: "Live Animals",
      2: "Meat and Edible Meat Offal",
      3: "Fish and Crustaceans",
      4: "Dairy Products",
      5: "Products of Animal Origin",
      6: "Live Trees and Plants",
      7: "Edible Vegetables",
      8: "Edible Fruits and Nuts",
      9: "Coffee, Tea, and Spices",
      10: "Cereals",
      11: "Products of Milling Industry",
      12: "Oil Seeds and Oleaginous Fruits",
      13: "Lac; Gums and Resins",
      14: "Vegetable Plaiting Materials",
      15: "Animal or Vegetable Fats and Oils",
      16: "Preparations of Meat or Fish",
      17: "Sugars and Sugar Confectionery",
      18: "Cocoa and Cocoa Preparations",
      19: "Preparations of Cereals",
      20: "Preparations of Vegetables",
      21: "Miscellaneous Edible Preparations",
      22: "Beverages, Spirits and Vinegar",
      23: "Residues from Food Industries",
      24: "Tobacco and Manufactured Tobacco",
      25: "Salt; Sulphur; Earths and Stone",
      26: "Ores, Slag and Ash",
      27: "Mineral Fuels and Oils",
      28: "Inorganic Chemicals",
      29: "Organic Chemicals",
      30: "Pharmaceutical Products",
      31: "Fertilizers",
      32: "Tanning and Dyeing Extracts",
      33: "Essential Oils and Perfumes",
      34: "Soap and Cleaning Preparations",
      35: "Albuminoidal Substances",
      36: "Explosives and Pyrotechnics",
      37: "Photographic or Cinematographic Goods",
      38: "Miscellaneous Chemical Products",
      39: "Plastics and Articles Thereof",
      40: "Rubber and Articles Thereof",
      41: "Raw Hides and Skins",
      42: "Articles of Leather",
      43: "Furskins and Artificial Fur",
      44: "Wood and Articles of Wood",
      45: "Cork and Articles of Cork",
      46: "Manufactures of Straw",
      47: "Pulp of Wood",
      48: "Paper and Paperboard",
      49: "Printed Books and Newspapers",
      50: "Silk",
      51: "Wool and Animal Hair",
      52: "Cotton",
      53: "Other Vegetable Textile Fibres",
      54: "Man-made Filaments",
      55: "Man-made Staple Fibres",
      56: "Wadding, Felt and Nonwovens",
      57: "Carpets and Textile Floor Coverings",
      58: "Special Woven Fabrics",
      59: "Impregnated Textile Fabrics",
      60: "Knitted or Crocheted Fabrics",
      61: "Articles of Apparel, Knitted",
      62: "Articles of Apparel, Not Knitted",
      63: "Other Made-up Textile Articles",
      64: "Footwear",
      65: "Headgear",
      66: "Umbrellas and Walking Sticks",
      67: "Prepared Feathers and Down",
      68: "Articles of Stone and Plaster",
      69: "Ceramic Products",
      70: "Glass and Glassware",
      71: "Natural Pearls and Precious Stones",
      72: "Iron and Steel",
      73: "Articles of Iron or Steel",
      74: "Copper and Articles Thereof",
      75: "Nickel and Articles Thereof",
      76: "Aluminum and Articles Thereof",
      78: "Lead and Articles Thereof",
      79: "Zinc and Articles Thereof",
      80: "Tin and Articles Thereof",
      81: "Other Base Metals",
      82: "Tools and Cutlery of Base Metal",
      83: "Miscellaneous Articles of Base Metal",
      84: "Nuclear Reactors and Machinery",
      85: "Electrical Machinery and Equipment",
      86: "Railway Locomotives",
      87: "Vehicles Other than Railway",
      88: "Aircraft and Spacecraft",
      89: "Ships and Boats",
      90: "Optical and Precision Instruments",
      91: "Clocks and Watches",
      92: "Musical Instruments",
      93: "Arms and Ammunition",
      94: "Furniture and Bedding",
      95: "Toys and Games",
      96: "Miscellaneous Manufactured Articles",
      97: "Works of Art"
    };

    return hs2Descriptions[hs2Code];
  }

  /**
   * Get NAICS2 sector descriptions
   */
  static getNAICS2Description(naics2Code: number): string {
    const naics2Descriptions: Record<number, string> = {
      11: "Agriculture, Forestry, Fishing and Hunting",
      21: "Mining, Quarrying, and Oil and Gas Extraction",
      22: "Utilities",
      23: "Construction",
      31: "Manufacturing",
      32: "Manufacturing",
      33: "Manufacturing",
      42: "Wholesale Trade",
      44: "Retail Trade",
      45: "Retail Trade",
      48: "Transportation and Warehousing",
      49: "Transportation and Warehousing",
      51: "Information",
      52: "Finance and Insurance",
      53: "Real Estate and Rental and Leasing",
      54: "Professional, Scientific, and Technical Services",
      55: "Management of Companies and Enterprises",
      56: "Administrative and Support and Waste Management Services",
      61: "Educational Services",
      62: "Health Care and Social Assistance",
      71: "Arts, Entertainment, and Recreation",
      72: "Accommodation and Food Services",
      81: "Other Services (except Public Administration)",
      92: "Public Administration"
    };

    return naics2Descriptions[naics2Code];
  }

  /**
   * Transform grouped data into treemap hierarchy structure
   */
  static createTreemapHierarchy(groupedData: GroupedData): TreemapRootData {
    const children = Object.values(groupedData);
    
    return {
      product: "Root",
      children: children
    };
  }

  /**
   * Create D3 hierarchy and treemap layout
   */
  static createTreemapLayout(
    data: TreemapRootData, 
    width: number, 
    height: number,
    config: TreemapConfig
  ): d3.HierarchyRectangularNode<any> {
    
    // Create hierarchy
    const hierarchy = d3.hierarchy(data)
      .sum((d: any) => d.provExpValue || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create treemap layout
    const treemap = d3.treemap<any>()
      .size([width, height])
      .padding(config.padding)
      .paddingOuter(config.nodeSpacing)
      .round(true);

    return treemap(hierarchy);
  }

  /**
   * Format numbers with K, M, B suffixes (like your amCharts formatter)
   */
  static formatNumber(value: number, config: TreemapConfig): string {
    const { suffixes } = config.numberFormat;
    
    for (const { threshold, suffix } of suffixes) {
      if (Math.abs(value) >= threshold) {
        const formatted = (value / threshold).toFixed(2);
        return `$${formatted}${suffix}`;
      }
    }
    
    return `$${value.toLocaleString()}`;
  }

  /**
   * Calculate color for treemap nodes
   */
  static getNodeColor(
    node: d3.HierarchyRectangularNode<any>, 
    colors: string[]
  ): string {
    if (!node.parent) return '#ccc'; // Root node
    
    // Use depth and index for consistent coloring
    const index = node.parent.children?.indexOf(node) || 0;
    return colors[index % colors.length];
  }

  /**
   * Calculate if text should be visible based on node size
   */
  static shouldShowText(
    node: d3.HierarchyRectangularNode<any>,
    minSize: number = 30
  ): boolean {
    const width = node.x1 - node.x0;
    const height = node.y1 - node.y0;
    return width > minSize && height > minSize;
  }

  /**
   * Add responsive text with proper clipping and wrapping
   * This is the main improvement for legible text rendering
   */
  static addResponsiveText(
    selection: d3.Selection<SVGGElement, any, any, any>,
    config: TreemapConfig
  ): void {
    selection.each(function(d: any, i: number) {
      const group = d3.select(this);
      const nodeWidth = d.x1 - d.x0;
      const nodeHeight = d.y1 - d.y0;
      
      // Don't add text to very small nodes
      if (nodeWidth < 40 || nodeHeight < 25) return;
      
      // Create unique clip ID for each node
      const clipId = `clip-treemap-${i}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Add clipPath to prevent text overflow
      group.append('clipPath')
        .attr('id', clipId)
        .append('rect')
        .attr('width', nodeWidth)
        .attr('height', nodeHeight);
      
      // Add text container with clipping and proper positioning
      const textElement = group.append('text')
        .attr('clip-path', `url(#${clipId})`)
        .attr('x', 4) // Left padding
        .attr('y', 0) // Start at top of rectangle
        .attr('dominant-baseline', 'hanging') // This makes text hang from the y position instead of sitting on it
        .style('font-family', config.labelConfig.fontFamily)
        .style('fill', '#333')
        .style('pointer-events', 'none');
      
      // Prepare text content
      const title = d.data.Title || d.data.product || '';
      const value = TreemapChartUtils.formatNumber(d.value || 0, config);
      
      // Calculate optimal font size based on available space
      const maxFontSize = Math.min(config.labelConfig.fontSize, nodeHeight / 3);
      const fontSize = Math.max(9, maxFontSize);
      textElement.style('font-size', `${fontSize}px`);
      
      // Smart word wrapping logic
      const words = title.split(/\s+/);
      const charWidth = fontSize * 0.6; // Approximate character width
      const maxCharsPerLine = Math.floor((nodeWidth - 8) / charWidth); // 8px total padding
      const lineHeight = fontSize * 1.3; // Slightly more line spacing
      const topPadding = 4; // Top padding in pixels
      const maxLines = Math.floor((nodeHeight - topPadding * 2) / lineHeight) - 1; // Reserve space for value line
      
      const lines: string[] = [];
      let currentLine = '';
      
      // Build lines with word wrapping
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        
        if (testLine.length <= maxCharsPerLine) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            // Single word is too long, truncate it
            const truncated = word.length > maxCharsPerLine - 3 ? 
              word.substring(0, maxCharsPerLine - 3) + '...' : word;
            lines.push(truncated);
            currentLine = '';
          }
          
          // Stop if we've reached max lines (save space for value)
          if (lines.length >= maxLines) break;
        }
      }
      
      // Add remaining text if there's space
      if (currentLine && lines.length < maxLines) {
        lines.push(currentLine);
      }
      
      // Add title lines as tspan elements with proper spacing
      lines.forEach((line, lineIndex) => {
        textElement.append('tspan')
          .attr('x', 4) // Small left padding
          .attr('dy', lineIndex === 0 ? `${topPadding}px` : `${lineHeight}px`) // First line uses top padding, others use line height
          .text(line);
      });
      
      // Add value line if there's space and it fits
      if (maxLines > 0 && nodeHeight > lineHeight * 2 && lines.length < maxLines) {
        textElement.append('tspan')
          .attr('x', 4)
          .attr('dy', `${lineHeight + 2}px`) // Extra spacing before value
          .attr('fill-opacity', 0.8)
          .style('font-weight', 'bold')
          .style('font-size', `${Math.max(8, fontSize - 1)}px`) // Slightly smaller for value
          .text(value);
      }
    });
  }

  /**
   * Create word-wrapped text for treemap labels (legacy method, kept for compatibility)
   */
  static wrapText(
    text: d3.Selection<SVGTextElement, any, any, any>,
    width: number,
    config: TreemapConfig
  ): void {
    text.each(function() {
      const textElement = d3.select(this);
      const words = textElement.text().split(/\s+/).reverse();
      let word: string | undefined;
      let line: string[] = [];
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const y = textElement.attr("y");
      const dy = parseFloat(textElement.attr("dy") || "0");
      
      textElement.text(null);
      
      let tspan = textElement.append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");
      
      while ((word = words.pop()) && lineNumber < config.labelConfig.maxLines) {
        line.push(word);
        tspan.text(line.join(" "));
        
        if ((tspan.node()?.getComputedTextLength() || 0) > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          lineNumber++;
          
          if (lineNumber < config.labelConfig.maxLines) {
            tspan = textElement.append("tspan")
              .attr("x", 0)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      }
      
      // Add ellipsis if text was truncated
      if (words.length > 0 && config.labelConfig.truncate) {
        const lastTspan = textElement.selectAll("tspan").nodes().pop();
        if (lastTspan) {
          const currentText = d3.select(lastTspan).text();
          d3.select(lastTspan).text(currentText + "...");
        }
      }
    });
  }

  /**
   * Calculate node dimensions
   */
  static getNodeDimensions(node: d3.HierarchyRectangularNode<any>) {
    return {
      x: node.x0,
      y: node.y0,
      width: node.x1 - node.x0,
      height: node.y1 - node.y0
    };
  }

  /**
   * Get center point of a node
   */
  static getNodeCenter(node: d3.HierarchyRectangularNode<any>) {
    return {
      x: (node.x0 + node.x1) / 2,
      y: (node.y0 + node.y1) / 2
    };
  }

  /**
   * Create tooltip content with grouping-specific information
   */
  static createTooltipContent(node: d3.HierarchyRectangularNode<any>, totalValue: number, groupingType?: GroupingType): string {
    const data = node.data;
    const value = node.value || 0;
    const percentage = totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : '0';
    
    let groupingInfo = '';
    if (data.groupingType && data.groupKey) {
      groupingInfo = `<div class="tooltip-grouping">${data.groupingType.toUpperCase()}: ${data.groupKey}</div>`;
    } else if (data.naics) {
      groupingInfo = `<div class="tooltip-naics">NAICS: ${data.naics}</div>`;
    }
    
    return `
      <div class="treemap-tooltip">
        <div class="tooltip-title">${data.Title || data.product}</div>
        <div class="tooltip-value">${TreemapChartUtils.formatNumber(value, TreemapChartUtils.getDefaultConfig())}</div>
        <div class="tooltip-percentage">${percentage}% of total</div>
        ${groupingInfo}
      </div>
    `;
  }

  /**
   * Setup treemap tooltip
   */
  static setupTooltip(container: string): d3.Selection<HTMLDivElement, unknown, HTMLElement, any> {
    // Remove existing tooltip
    d3.select(container).selectAll('.treemap-tooltip-container').remove();
    
    return d3.select(container)
      .append('div')
      .attr('class', 'treemap-tooltip-container')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 33, 69, 0.95)')
      .style('color', 'white')
      .style('padding', '12px')
      .style('border-radius', '6px')
      .style('pointer-events', 'none')
      .style('font-size', '13px')
      .style('box-shadow', '0 4px 12px rgba(0, 0, 0, 0.3)')
      .style('z-index', '1000')
      .style('max-width', '300px');
  }

  /**
   * Validate treemap data
   */
  static validateTreemapData(data: RawTreemapItem[]): boolean {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Treemap data is empty or invalid');
      return false;
    }
    
    // Check required fields
    const hasRequiredFields = data.every(item => 
      item.product !== undefined && 
      (item.Value !== undefined && item.Value !== null)
    );
    
    if (!hasRequiredFields) {
      console.warn('Treemap data missing required fields (product, Value)');
      return false;
    }
    
    return true;
  }

  /**
   * Calculate chart dimensions
   */
  static calculateDimensions(config: TreemapConfig): TreemapDimensions {
    const { width, height, margin } = config;
    
    return {
      width: 1342,
      height,
      innerWidth: 1342 - margin.left - margin.right,
      innerHeight: height - margin.top - margin.bottom,
      margin
    };
  }

  /**
   * Deep clone data
   */
  static cloneData<T>(data: T): T {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * Merge configurations
   */
  static mergeConfigs(defaultConfig: TreemapConfig, userConfig: Partial<TreemapConfig>): TreemapConfig {
    return {
      ...defaultConfig,
      ...userConfig,
      margin: {
        ...defaultConfig.margin,
        ...userConfig.margin
      },
      numberFormat: {
        ...defaultConfig.numberFormat,
        ...userConfig.numberFormat
      },
      labelConfig: {
        ...defaultConfig.labelConfig,
        ...userConfig.labelConfig
      }
    };
  }

  /**
   * Calculate total value for percentage calculations
   */
  static calculateTotalValue(data: RawTreemapItem[]): number {
    return data.reduce((sum, item) => sum + (Number(item.Value) || 0), 0);
  }

  /**
   * Sort nodes by value (descending)
   */
  static sortNodesByValue(a: d3.HierarchyRectangularNode<any>, b: d3.HierarchyRectangularNode<any>): number {
    return (b.value || 0) - (a.value || 0);
  }

  /**
   * Get available grouping types
   */
  static getAvailableGroupingTypes(): { value: GroupingType; label: string }[] {
    return [
      { value: GroupingType.HS2, label: 'HS2 (Product Categories)' },
      { value: GroupingType.HS4, label: 'HS4 (Product Subcategories)' },
      { value: GroupingType.NAICS, label: 'NAICS (Industry Classification)' },
      { value: GroupingType.NAICS2, label: 'NAICS2 (Industry Sectors)' },
      { value: GroupingType.NAICS4, label: 'NAICS4 (Industry Subsectors)' }
    ];
  }
}