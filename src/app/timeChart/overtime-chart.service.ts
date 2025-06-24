// fixed-overtime-chart.service.ts

import { Injectable } from '@angular/core';
import { 
    ChartDataPoint, 
    GroupedDataPoint, 
    RemappedDataPoint, 
    RawDataItem, 
    IconMapping,
    ChartConfig,
    ChartDimensions
} from './overtime-chart.model';

/**
 * Updated OvertimeChartService that focuses on data processing and utility methods
 * Data fetching is now handled by UnifiedDataService
 */
@Injectable({
  providedIn: 'root'
})
export class OvertimeChartService {
  private config: ChartConfig;

  constructor() {
    // Initialize with default config - no injection needed
    this.config = this.getDefaultConfig();
  }

  /**
   * Update the service configuration
   */
  updateConfig(config: ChartConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): ChartConfig {
    return { ...this.config };
  }

  /**
   * Get default configuration for overtime charts
   */
  private getDefaultConfig(): ChartConfig {
    return {
      keys: [
        "Animal & Food Products",
        "Minerals", 
        "Chemicals & Plastics",
        "Raw Materials",
        "Textiles",
        "Footwear & Accessories",
        "Stone & Glass",
        "Metals",
        "Machinery & Electronics",
        "Transportation",
        "Miscellaneous"
      ],
      colors: [
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
      ],
      iconMapping: {
        "Animal & Food Products": { min: 1, max: 24 },
        "Minerals": { min: 25, max: 27 },
        "Chemicals & Plastics": { min: 28, max: 40 },
        "Raw Materials": { min: 41, max: 49 },
        "Textiles": { min: 50, max: 63 },
        "Footwear & Accessories": { min: 64, max: 67 },
        "Stone & Glass": { min: 68, max: 71 },
        "Metals": { min: 72, max: 83 },
        "Machinery & Electronics": { min: 84, max: 85 },
        "Transportation": { min: 86, max: 89 },
        "Miscellaneous": { min: 90, max: 97 }
      },
      iconCategoryMapping: {
        "ph-horse": "Animal & Food Products",
        "ph-bowl-food": "Animal & Food Products",
        "ph-sketch-logo": "Chemicals & Plastics",
        "ph-graph": "Raw Materials",
        "ph-factory": "Machinery & Electronics",
        "ph-sneaker": "Textiles",
        "ph-hammer": "Metals",
        "ph-car": "Transportation",
        "ph-scissors": "Miscellaneous"
      },
      dimensions: {
        margin: {
          top: 20,
          right: 80,
          bottom: 30,
          left: 50
        },
        width: 1440,
        height: 650
      },
      siSymbols: ["", "k", "M", "B", "T", "P", "E"]
    };
  }

  /**
   * Initialize with custom config (called from component)
   */
  initializeWithConfig(customConfig?: Partial<ChartConfig>): void {
    if (customConfig) {
      this.config = {
        ...this.getDefaultConfig(),
        ...customConfig,
        // Deep merge dimensions if provided
        dimensions: {
          ...this.getDefaultConfig().dimensions,
          ...(customConfig.dimensions || {}),
          margin: {
            ...this.getDefaultConfig().dimensions.margin,
            ...(customConfig.dimensions?.margin || {})
          }
        },
        // Deep merge icon mappings if provided
        iconMapping: {
          ...this.getDefaultConfig().iconMapping,
          ...(customConfig.iconMapping || {})
        },
        iconCategoryMapping: {
          ...this.getDefaultConfig().iconCategoryMapping,
          ...(customConfig.iconCategoryMapping || {})
        }
      };
    }
  }

  /**
   * NEW: Filter raw data based on enabled product groups
   */
  filterByProductGroups(data: RawDataItem[], enabledProductGroups: any[]): RawDataItem[] {
    // If no product groups specified or all are enabled, return all data
    if (!enabledProductGroups || enabledProductGroups.length === 0) {
      return data;
    }

    return data.filter(item => this.isItemInEnabledProductGroup(item, enabledProductGroups));
  }

  /**
   * NEW: Check if a data item belongs to any enabled product group
   */
  private isItemInEnabledProductGroup(item: RawDataItem, enabledProductGroups: any[]): boolean {

    // Extract HS2 code from the product field
    const hs2Code =item.product 

    // Check if this HS2 code falls within any enabled product group's ranges
    return enabledProductGroups.some(group => {
      return group.hsCodeRanges.some((range: any) => 
        hs2Code >= range.min && hs2Code <= range.max
      );
    });
  }

  /**
   * NEW: Get categories that should be visible based on enabled product groups
   */
  getVisibleCategories(enabledProductGroups: any[]): string[] {
    if (!enabledProductGroups || enabledProductGroups.length === 0) {
      return this.config.keys; // Return all categories if no filtering
    }

    const visibleCategories: string[] = [];

    // For each category, check if any of its HS2 codes overlap with enabled product groups
    Object.entries(this.config.iconMapping).forEach(([categoryName, range]) => {
      const categoryHasSomeEnabledCodes = enabledProductGroups.some(group => {
        return group.hsCodeRanges.some((groupRange: any) => {
          // Check if there's any overlap between category range and group range
          return Math.max(range.min, groupRange.min) <= Math.min(range.max, groupRange.max);
        });
      });

      if (categoryHasSomeEnabledCodes) {
        visibleCategories.push(categoryName);
      }
    });

    return visibleCategories;
  }

  /**
   * Groups raw data by year and category based on HS2 codes
   */
  groupByYearAndCategory(data: RawDataItem[]): GroupedDataPoint[] {
    return data.reduce((accumulator, item) => {
      // Extract year and HS2 code
      const year = new Date(item.Date).getFullYear();
      const hs2 = parseInt(item.product.toString().substring(0, 2));
      let category = "Unknown category";

      // Find the category using the icon mapping
      for (const [categoryName, range] of Object.entries(this.config.iconMapping)) {
        if (hs2 >= range.min && hs2 <= range.max) {
          category = categoryName;
          break;
        }
      }

      // Locate or create the category entry for the year
      let entry = accumulator.find(e => e.Date === year && e.Category === category);
      if (!entry) {
        entry = { Date: year, Category: category, TotalValue: 0 };
        accumulator.push(entry);
      }

      // Add the item's value to the total for this category and year
      entry.TotalValue += item.Value;

      return accumulator;
    }, [] as GroupedDataPoint[]);
  }

  /**
   * Transforms grouped data by date into chart-ready format
   */
  transformDataByDate(data: GroupedDataPoint[]): ChartDataPoint[] {
    const result: { [key: number]: ChartDataPoint } = {};

    data.forEach(item => {
      // Check if the date already exists in the result object
      if (!result[item.Date]) {
        result[item.Date] = { Date: item.Date };
        // Initialize all categories to 0
        this.config.keys.forEach(key => {
          result[item.Date][key] = 0;
        });
      }
      // Add category and its total value to the respective date object
      result[item.Date][item.Category] = item.TotalValue;
    });

    // Convert the result object back to an array and ensure all categories exist
    return Object.values(result);
  }

  /**
   * NEW: Process raw data with product group filtering
   */
  processRawDataWithProductGroups(data: RawDataItem[], enabledProductGroups: any[]): ChartDataPoint[] {
    // Filter data by product groups first
    const filteredData = this.filterByProductGroups(data, enabledProductGroups);
    
    // Then process normally
    const groupedData = this.groupByYearAndCategory(filteredData);
    return this.transformDataByDate(groupedData);
  }

  /**
   * Process raw data directly into chart format (convenience method)
   */
  processRawDataToChart(data: RawDataItem[]): ChartDataPoint[] {
    const groupedData = this.groupByYearAndCategory(data);
    return this.transformDataByDate(groupedData);
  }

  /**
   * Filter data by date range
   */
  filterByDateRange(data: RawDataItem[], startYear: number, endYear: number): RawDataItem[] {
    return data.filter(item => {
      const year = new Date(item.Date).getFullYear();
      return year >= startYear && year <= endYear;
    });
  }

  /**
   * Filter data by specific categories
   */
  filterByCategories(data: ChartDataPoint[], categories: string[]): ChartDataPoint[] {
    return data.map(item => {
      const filtered: ChartDataPoint = { Date: item.Date };
      
      // Include only specified categories
      categories.forEach(category => {
        if (this.config.keys.includes(category)) {
          filtered[category] = item[category] || 0;
        }
      });

      // Set other categories to 0
      this.config.keys.forEach(key => {
        if (!categories.includes(key)) {
          filtered[key] = 0;
        }
      });

      return filtered;
    });
  }

  /**
   * NEW: Hide categories that don't have enabled product groups
   */
  hideDisabledCategories(data: ChartDataPoint[], enabledProductGroups: any[]): ChartDataPoint[] {
    const visibleCategories = this.getVisibleCategories(enabledProductGroups);
    
    return data.map(item => {
      const filtered: ChartDataPoint = { Date: item.Date };
      
      // Only include categories that have enabled product groups
      this.config.keys.forEach(key => {
        if (visibleCategories.includes(key)) {
          filtered[key] = item[key] || 0;
        } else {
          filtered[key] = 0; // Hide disabled categories
        }
      });

      return filtered;
    });
  }

  /**
   * Creates remapped data for DataTable display
   */
  createRemappedData(data: ChartDataPoint[]): RemappedDataPoint[] {
    const remappedData: RemappedDataPoint[] = [];

    data.forEach(dataObj => {
      const date = dataObj.Date;
      for (const [key, value] of Object.entries(dataObj)) {
        if (key !== 'Date') {
          const mapping = this.config.iconMapping[key] !== undefined 
            ? `${this.config.iconMapping[key].min} - ${this.config.iconMapping[key].max}` 
            : "Unknown";

          remappedData.push({
            Date: date,
            Grouping: key,
            Value: value as number,
            Mapping: `HS ${mapping}`
          });
        }
      }
    });

    return remappedData;
  }

  /**
   * Toggles category visibility in dataset
   */
  toggleCategory(
    currentData: ChartDataPoint[], 
    originalData: RawDataItem[], 
    category: string
  ): ChartDataPoint[] {
    // Check if category is currently visible (has non-zero values)
    const isCurrentlyVisible = currentData.some(d => d[category] && d[category] > 0);

    if (isCurrentlyVisible) {
      // Hide category - set all values to 0
      return currentData.map(d => ({
        ...d,
        [category]: 0
      }));
    } else {
      // Show category - restore original values
      const transformedOriginal = this.transformDataByDate(
        this.groupByYearAndCategory(originalData)
      );
      
      return currentData.map((d, index) => ({
        ...d,
        [category]: transformedOriginal[index]?.[category] || 0
      }));
    }
  }

  /**
   * Toggle multiple categories at once
   */
  toggleMultipleCategories(
    currentData: ChartDataPoint[],
    originalData: RawDataItem[],
    categories: string[]
  ): ChartDataPoint[] {
    let result = currentData;
    categories.forEach(category => {
      result = this.toggleCategory(result, originalData, category);
    });
    return result;
  }

  /**
   * Reset all categories to original state
   */
  resetAllCategories(originalData: RawDataItem[]): ChartDataPoint[] {
    return this.transformDataByDate(
      this.groupByYearAndCategory(originalData)
    );
  }

  /**
   * Show only specific categories
   */
  showOnlyCategories(
    originalData: RawDataItem[],
    categoriesToShow: string[]
  ): ChartDataPoint[] {
    const fullData = this.resetAllCategories(originalData);
    
    return fullData.map(item => {
      const filtered: ChartDataPoint = { Date: item.Date };
      
      this.config.keys.forEach(key => {
        filtered[key] = categoriesToShow.includes(key) ? (item[key] || 0) : 0;
      });

      return filtered;
    });
  }

  /**
   * Calculates total value for a data point (excluding Date)
   */
  calculateTotal(data: ChartDataPoint): number {
    let total = 0;
    for (const key in data) {
      if (key !== "Date" && typeof data[key] === 'number') {
        total += data[key];
      }
    }
    return total;
  }

  /**
   * Gets the maximum total across all data points
   */
  getMaxTotal(data: ChartDataPoint[]): number {
    if (data.length === 0) return 0;
    return Math.max(...data.map(d => this.calculateTotal(d)));
  }

  /**
   * Get total value for a specific category across all years
   */
  getCategoryTotal(data: ChartDataPoint[], category: string): number {
    return data.reduce((total, item) => total + (item[category] || 0), 0);
  }

  /**
   * Get data for a specific year
   */
  getDataForYear(data: ChartDataPoint[], year: number): ChartDataPoint | undefined {
    return data.find(item => item.Date === year);
  }

  /**
   * Get category breakdown for a specific year
   */
  getCategoryBreakdownForYear(data: ChartDataPoint[], year: number): {[key: string]: number} {
    const yearData = this.getDataForYear(data, year);
    if (!yearData) return {};

    const breakdown: {[key: string]: number} = {};
    this.config.keys.forEach(key => {
      breakdown[key] = yearData[key] || 0;
    });

    return breakdown;
  }

  /**
   * Calculate year-over-year growth for each category
   */
  calculateYearOverYearGrowth(data: ChartDataPoint[]): {[key: string]: {[year: number]: number}} {
    const growth: {[key: string]: {[year: number]: number}} = {};
    
    this.config.keys.forEach(key => {
      growth[key] = {};
      
      for (let i = 1; i < data.length; i++) {
        const currentYear = data[i];
        const previousYear = data[i - 1];
        
        const currentValue = currentYear[key] || 0;
        const previousValue = previousYear[key] || 0;
        
        if (previousValue !== 0) {
          growth[key][currentYear.Date] = ((currentValue - previousValue) / previousValue) * 100;
        } else {
          growth[key][currentYear.Date] = currentValue > 0 ? 100 : 0;
        }
      }
    });

    return growth;
  }

  /**
   * Formats numbers with abbreviations (K, M, B, T)
   */
  abbreviateNumber(number: number): string {
    const tier = Math.log10(Math.abs(number)) / 3 | 0;
    
    if (tier === 0) return number.toString();
    
    const suffix = this.config.siSymbols[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = number / scale;
    
    return scaled.toFixed(1) + suffix;
  }

  /**
   * Get chart dimensions from config
   */
  getDimensions(): ChartDimensions {
    return { ...this.config.dimensions };
  }

  /**
   * Update chart dimensions
   */
  updateDimensions(dimensions: Partial<ChartDimensions>): void {
    this.config.dimensions = {
      ...this.config.dimensions,
      ...dimensions,
      margin: {
        ...this.config.dimensions.margin,
        ...(dimensions.margin || {})
      }
    };
  }

  /**
   * Get summary statistics for the data
   */
  getDataSummary(data: ChartDataPoint[]): {
    totalYears: number;
    yearRange: {start: number, end: number};
    totalCategories: number;
    activeCategoriesCount: number;
    overallTotal: number;
    averagePerYear: number;
  } {
    if (data.length === 0) {
      return {
        totalYears: 0,
        yearRange: {start: 0, end: 0},
        totalCategories: 0,
        activeCategoriesCount: 0,
        overallTotal: 0,
        averagePerYear: 0
      };
    }

    const years = data.map(d => d.Date).sort((a, b) => a - b);
    const overallTotal = data.reduce((sum, item) => sum + this.calculateTotal(item), 0);
    
    // Count active categories (categories with non-zero values)
    const activeCategories = new Set<string>();
    data.forEach(item => {
      this.config.keys.forEach(key => {
        if (item[key] && item[key] > 0) {
          activeCategories.add(key);
        }
      });
    });

    return {
      totalYears: data.length,
      yearRange: {start: years[0], end: years[years.length - 1]},
      totalCategories: this.config.keys.length,
      activeCategoriesCount: activeCategories.size,
      overallTotal,
      averagePerYear: overallTotal / data.length
    };
  }
}