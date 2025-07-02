// enhanced-chart-utility.ts - Updated with better tooltip zoom handling

import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ChartCoordinationService } from '../service/chart-coordination.service';
import { FilterType, GroupingType } from '../feasible/feasible-chart-model';
import * as d3 from 'd3';

export interface SearchableItem {
  product?: number;
  description?: string;
  naics?: number;
  naics_description?: string;
  hs2?: string;
  hs4?: string;
  title?: string;
  Title?: string;
  distance?: number; // NEW: For feasible chart
  pci?: number; // NEW: For feasible chart
  [key: string]: any;
}

export interface TooltipOptions {
  title?: string;
  description?: string;
  value?: number;
  additionalInfo?: { [key: string]: any };
  showCloseButton?: boolean;
  customHtml?: string;
  maxWidth?: string;
  className?: string;
  onClose?: (data:Node) => void;
}

export interface TooltipPosition {
  x: number;
  y: number;
  containerWidth?: number;
  containerHeight?: number;
  tooltipWidth?: number;
  tooltipHeight?: number;
}

export interface NodeColorOptions {
  searchResults?: any[];
  searchQuery?: string;
  colorScale?: any;
  defaultColor?: string;
  dimmedColor?: string;
  highlightColor?: string;
  filterType?: FilterType;
  enabledProductGroups?: any[];
}

export interface EventHandlerConfig {
  svg: any; // d3.Selection or HTMLElement
  onMouseover?: (event: any, d: any) => void;
  onMousemove?: (event: any, d: any) => void;
  onMouseleave?: (event: any, d: any) => void;
  onClick?: (event: any, d: any) => void;
  createTooltip?: (d: any) => any;
  updateTooltip?: (d: any, tooltip: any) => void;
  enableTracking?: boolean;
  enableSelection?: boolean;
  // NEW: For better tooltip positioning during zoom
  originalScales?: { x?: any; y?: any };
}

@Injectable({
  providedIn: 'root'
})
export class ChartUtility {
  private destroy$ = new Subject<void>();
  private currentSearchQuery: string = '';
  private currentSearchResults: any[] = [];
  
  // Tooltip constants
  private readonly TOOLTIP_STYLES = {
    background: 'linear-gradient(135deg, #4d94ff 0%, #007bff 100%)',
    color: 'white',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '13px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: '1000',
    maxWidth: '300px',
    opacity: '0.9'
  };

  constructor(private coordinationService: ChartCoordinationService) {
    this.subscribeToSearch();
  }

  private subscribeToSearch(): void {
    this.coordinationService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        this.currentSearchQuery = query;
      });
  }

  // ==================== SEARCH FUNCTIONALITY ====================

  /**
   * Enhanced search that returns filter functions for different chart types
   */
  public createSearchFilter(query: string, data: SearchableItem[]): {
    results: SearchableItem[];
    filterFunction: (item: SearchableItem) => boolean;
    highlightFunction: (item: SearchableItem) => boolean;
  } {
    if (!query.trim()) {
      return {
        results: [],
        filterFunction: () => true,
        highlightFunction: () => false
      };
    }

    const results = this.performSearch(query, data);
    const resultSet = new Set(results.map(r => this.getItemId(r)));

    return {
      results,
      filterFunction: (item: SearchableItem) => resultSet.has(this.getItemId(item)),
      highlightFunction: (item: SearchableItem) => resultSet.has(this.getItemId(item))
    };
  }

  /**
   * Perform comprehensive search across multiple fields
   */
  public performSearch(query: string, data: SearchableItem[]): SearchableItem[] {
    if (!query.trim()) {
      return [];
    }

    const trimmedQuery = query.trim();
    const lowercaseQuery = trimmedQuery.toLowerCase();
    const isNumericQuery = /^\d+$/.test(trimmedQuery);

    let searchResults: SearchableItem[] = [];

    if (isNumericQuery) {
      searchResults = this.searchByCode(trimmedQuery, data);
    } else {
      searchResults = this.searchByDescription(lowercaseQuery, data);
    }

    this.currentSearchResults = searchResults;
    this.coordinationService.setSearchResults(searchResults);
    
    return searchResults;
  }

  private searchByDescription(lowercaseQuery: string, data: SearchableItem[]): SearchableItem[] {
    const cleanQuery = lowercaseQuery
      .replace(/^\d+[\.\s]*-\s*/, '') // Remove "2711 - " pattern
      .toLowerCase();

    return data.filter(item => {
      const searchFields = [
        item.description,
        item.naics_description,
        item.title,
        item.Title
      ].filter(Boolean);

      return searchFields.some(field => {
        if (!field) return false;
        const fieldLower = field.toLowerCase();
        return fieldLower.includes(lowercaseQuery) || fieldLower.includes(cleanQuery);
      });
    });
  }

  private searchByCode(code: string, data: SearchableItem[]): SearchableItem[] {
  

    return data.filter(item => {
      const codes = [
        item.product?.toString(),
        item.naics?.toString(),
        item.hs2,
        item.hs4
      ].filter(Boolean);

      let fixed_codes = codes.map(c => c ? c.toString() : c)

      return fixed_codes.some(itemCode => {
        if (!itemCode) return false;
        return itemCode === code || itemCode.startsWith(code) || itemCode.includes(code);
      });
    });
  }

  private getItemId(item: SearchableItem): string {
    return item.product?.toString() || 
           item.naics?.toString() || 
           item.hs2 || 
           item.hs4 || 
           JSON.stringify(item);
  }

  // ==================== TOOLTIP FUNCTIONALITY ====================

  /**
   * Create standardized tooltip with consistent styling
   */
  public createTooltip(
    containerId: string, 
    data: any, 
    options: TooltipOptions = {}
  ): d3.Selection<HTMLDivElement, unknown, HTMLElement, any> {
    const {
      title = '',
      description = '',
      value,
      additionalInfo = {},
      showCloseButton = true,
      customHtml,
      maxWidth = this.TOOLTIP_STYLES.maxWidth,
      className = 'tooltip',
      onClose  
    } = options;

    // Remove existing tooltip
    d3.select("#tooltip-" + data.id).remove();

    const tooltip = d3.select(containerId)
      .append("div")
      .attr("id", "tooltip-" + data.id)
      .attr("class", className)
      .datum(data)
      .style("position", "absolute")
      .style("opacity", "0")
      .style("pointer-events", "none");

    // Apply standard styles
    Object.entries(this.TOOLTIP_STYLES).forEach(([key, value]) => {
      tooltip.style(this.camelToKebab(key), value);
    });

    // Set max width
    tooltip.style("max-width", maxWidth);

    // Set content
    if (customHtml) {
      tooltip.html(customHtml);
    } else {
      const html = this.generateTooltipHtml({
        title,
        description,
        value,
        additionalInfo,
        showCloseButton,
        data
      });

      console.log(`Generated tooltip HTML:`, html);

      tooltip.html(html);
    }

    // Add close button functionality
    if (showCloseButton) {
      // Use setTimeout to ensure DOM is updated before attaching event
      setTimeout(() => {
        const closeButton = tooltip.select(".close-button");
        if (!closeButton.empty()) {
          closeButton.on("click", (event) => {
            event.stopPropagation(); // Prevent event bubbling
            d3.select("#tooltip-" + data.id).remove();
            this.resetNodeState(data);

            if (onClose) {
              onClose(data);
            }
          });
        } else {
          console.warn("Close button not found in tooltip:", data.id);
        }
      }, 0);
    }

    return tooltip;
  }

  /**
   * Generate standard tooltip HTML
   */
  private generateTooltipHtml(config: {
    title: string;
    description: string;
    value?: number;
    additionalInfo: { [key: string]: any };
    showCloseButton: boolean;
    data: any;
  }): string {
    const { title, description, value, additionalInfo, showCloseButton } = config;

    let html = '<div style="position: relative;">';
    
    if (showCloseButton) {
      html += `
        <button class="close-button" 
                style="position: absolute; top: -13px; right: -9px; 
                background: none; color: white; border: none; 
                border-radius: 50%; cursor: pointer; width: 20px; 
                font-size: 13px; height: 20px;">×</button>
      `;
    }

    html += '<div>';
    if (description) {
      html += `<div >${description}</div>`;
    }
    else {
      html += `<div style="font-size: 14px;">${title}</div>`;
    }

    html += '</div></div>';
    return html;
  }

  /**
   * ENHANCED: Position tooltip with better zoom handling
   */
  public positionTooltip(
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
    position: TooltipPosition
  ): void {
    const { x, y } = position;

    let tooltipX = x;
    let tooltipY = y;

    tooltip
      .style("left", `${tooltipX}px`)
      .style("top", `${tooltipY}px`)
      .style("opacity", "0.9")
      .style("pointer-events", "auto");
  }

  /**
   * Remove all tooltips
   */
  public removeAllTooltips(): void {
    d3.selectAll('.tooltip').remove();
  }

  // ==================== COLOR MANAGEMENT ====================

  /**
   * Enhanced node color determination with multiple filter support
   */
  public getNodeColor(item: SearchableItem, options: NodeColorOptions = {}): string {
    const {
      searchResults = this.currentSearchResults,
      searchQuery = this.currentSearchQuery,
      colorScale,
      defaultColor = 'rgb(249, 251, 251)',
      dimmedColor = 'rgb(249, 251, 251)',
      highlightColor,
      filterType = FilterType.ALL,
      enabledProductGroups = []
    } = options;

    // Search filtering - highest priority
    if (searchQuery.trim()) {
      const searchSet = new Set(searchResults.map(result => this.getItemId(result)));
      if (!searchSet.has(this.getItemId(item))) {
        return dimmedColor;
      }
      // If item matches search and has highlight color, use it
      if (highlightColor) {
        return highlightColor;
      }
    }

    // Product group filtering
    if (enabledProductGroups.length > 0 && !this.isItemInEnabledProductGroup(item, enabledProductGroups)) {
      return defaultColor;
    }

    // RCA/Value filtering
    if (!this.passesValueFilter(item, filterType)) {
      return defaultColor;
    }

    // Apply color scale if available
    if (colorScale) {
      const colorKey = item.product || item.naics || item.hs2 || item.hs4;
      if (colorKey !== undefined) {
        return colorScale(colorKey);
      }
    }

    return defaultColor;
  }

  /**
   * Update colors for D3 selection
   */
  public updateSelectionColors(
    selection: d3.Selection<any, any, any, any>,
    data: SearchableItem[],
    options: NodeColorOptions & {
      getItemById: (id: string) => SearchableItem | undefined;
      idAttribute?: string;
    }
  ): void {
    const { getItemById, idAttribute = 'id', ...colorOptions } = options;

    selection.attr('fill', (d: any) => {
      const itemId = idAttribute === 'id' ? d.id : d[idAttribute];
      const item = getItemById(itemId);
      if (!item) return colorOptions.defaultColor || 'rgb(249, 251, 251)';
      
      return this.getNodeColor(item, colorOptions);
    });
  }

  // ==================== FILTER UTILITIES ====================

  /**
   * Check if item belongs to enabled product groups
   */
  public isItemInEnabledProductGroup(item: SearchableItem, enabledGroups: any[] = []): boolean {
    if (enabledGroups.length === 0) {
      return true;
    }

    const productCode = item.product || Number(item.hs4) || 0;
    const hs2Code = Math.floor(productCode);

    return enabledGroups.some(group => {
      return group.hsCodeRanges.some((range: any) => 
        hs2Code >= range.min && hs2Code <= range.max
      );
    });
  }

  /**
   * Check if item passes value/RCA filters
   */
  private passesValueFilter(item: any, filterType: FilterType): boolean {
    if (!item.rca && !item.value && !item.Value) {
      return filterType === FilterType.ALL;
    }

    const rcaValue = item.rca || 0;
    const value = item.value || item.Value || 0;

    if (value <= 0) return false;

    switch (filterType) {
      case FilterType.ALL:
        return rcaValue >= 0;
      case FilterType.RCA_ABOVE_1:
        return rcaValue >= 1;
      case FilterType.RCA_BETWEEN:
        return rcaValue >= 0.5 && rcaValue < 1;
      default:
        return true;
    }
  }

  // ==================== EVENT HANDLER UTILITIES ====================

  /**
   * ENHANCED: Create standardized mouse event handlers with better coordinate handling
   */
  public createEventHandlers(config: EventHandlerConfig) {
    const {
      svg,
      onMouseover,
      onMousemove,
      onMouseleave,
      onClick,
      createTooltip,
      enableTracking = false,
      enableSelection = false,
      originalScales // NEW: Original scales for coordinate calculations
    } = config;

    return {
      mouseover: (event: any, d: any) => {
        d3.select(event.currentTarget).style("stroke-width", "3");
        
        if (onMouseover) {
          onMouseover(event, d);
        }
      },

      mousemove: (event: any, d: any) => {
        // Create/update tooltip if handler provided
        if (createTooltip) {
          let tooltip = d3.select("#tooltip-" + d.id)
          
          if (tooltip.empty()) {
            tooltip = createTooltip(d);
          }
          
          const svgElement = svg.node()
          const transform = d3.zoomTransform(svgElement);
          
          let transformedX, transformedY;
          
          // NEW: Better coordinate calculation using original scales if available
          if (originalScales && originalScales.x && originalScales.y && d.distance !== undefined && d.pci !== undefined) {
            // For feasible chart - use original scales and current data
            const baseX = originalScales.x(d.distance);
            const baseY = originalScales.y(d.pci);
            transformedX = baseX * transform.k + transform.x;
            transformedY = baseY * transform.k + transform.y;
          } else {
            // Fallback for other charts - use stored coordinates
            transformedX = d.x * transform.k + transform.x;
            transformedY = d.y * transform.k + transform.y;
          }

          // Position tooltip
          this.positionTooltip(tooltip as unknown as d3.Selection<HTMLDivElement, unknown, HTMLElement, any>, {
            x: transformedX - 50,
            y: transformedY - 75,
          });
        }

        if (onMousemove) {
          onMousemove(event, d);
        }
      },

      mouseleave: (event: any, d: any) => {
        // Reset styling if not selected
        if (!enableSelection || d.state === 0) {
          d3.select(event.currentTarget).style("stroke-width", "1");
          d3.select("#tooltip-" + d.id).remove();
        }

        if (onMouseleave) {
          onMouseleave(event, d);
        }
      },

      click: (event: any, d: any) => {
        event.stopPropagation();
        
        if (enableSelection) {
          d.state = 1;
        }

        if (onClick) {
          onClick(event, d);
        }
      }
    };
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Reset node state
   */
  private resetNodeState(data: any): void {
    if (data && typeof data === 'object') {
      data.state = 0;
    }
  }

  /**
   * Convert camelCase to kebab-case for CSS
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  // ==================== PUBLIC API ====================

  public getCurrentSearchQuery(): string {
    return this.currentSearchQuery;
  }

  public getCurrentSearchResults(): any[] {
    return this.currentSearchResults;
  }

  public clearSearch(): void {
    this.currentSearchQuery = '';
    this.currentSearchResults = [];
    this.coordinationService.clearSearch();
  }

  public destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.removeAllTooltips();
  }
}