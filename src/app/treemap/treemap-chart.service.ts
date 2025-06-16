// treemap-chart.service.ts

import { Injectable } from '@angular/core';
import { TreemapChartUtils } from './treemap-chart.utils';
import { 
  TreemapConfig, 
  TreemapNode, 
  RawTreemapItem, 
  GroupedData,
  TreemapRootData 
} from './treemap-chart.model';

@Injectable({
  providedIn: 'root'
})
export class TreemapChartService {

  private config: TreemapConfig;

  constructor() {
    this.config = TreemapChartUtils.getDefaultConfig();
  }

  /**
   * Initialize service with custom configuration
   */
  initializeWithConfig(customConfig?: Partial<TreemapConfig>): void {
    this.config = customConfig ? 
      TreemapChartUtils.mergeConfigs(TreemapChartUtils.getDefaultConfig(), customConfig) : 
      TreemapChartUtils.getDefaultConfig();
  }

  /**
   * Get current configuration
   */
  getConfig(): TreemapConfig {
    return { ...this.config };
  }

  /**
   * Get chart dimensions
   */
  getDimensions(): { width: number; height: number; margin: any } {
    return {
      width: this.config.width,
      height: this.config.height,
      margin: this.config.margin
    };
  }

  /**
   * Process raw data into treemap format
   * This is equivalent to your amCharts groupBy function + data transformation
   */
  processRawData(rawData: RawTreemapItem[]): TreemapRootData {
    // Validate data first
    if (!TreemapChartUtils.validateTreemapData(rawData)) {
      throw new Error('Invalid treemap data format');
    }

    // Group by NAICS code (your original groupBy function logic)
    const groupedData = this.groupByNaics(rawData);
    
    // Transform to treemap hierarchy structure
    return this.createHierarchy(groupedData);
  }

  /**
   * Group data by NAICS code (equivalent to your original groupBy function)
   */
  private groupByNaics(data: RawTreemapItem[]): GroupedData {
    return data.reduce((result: GroupedData, currentItem: RawTreemapItem) => {
      const groupKey = currentItem.naics;
      
      // Create group if it doesn't exist
      if (!result[groupKey]) {
        result[groupKey] = {
          product: groupKey,
          provExpValue: 0,
          Title: currentItem.naics_description,
          naics: groupKey
        };
      }
      
      // Sum values (equivalent to your Number(currentItem.Value) + Number(result[groupKey].provExpValue))
      const currentValue = Number(currentItem.Value) || 0;
      result[groupKey].provExpValue = currentValue + result[groupKey].provExpValue;
      
      return result;
    }, {});
  }

  /**
   * Create hierarchy structure (equivalent to your xdata creation)
   */
  private createHierarchy(groupedData: GroupedData): TreemapRootData {
    // Convert grouped data to array (equivalent to [...Object.values(Treemap_data)])
    const children = Object.values(groupedData);
    
    // Return root structure (equivalent to your xdata)
    return {
      product: "Root",
      children: children
    };
  }

  /**
   * Filter data by year
   */
  filterByYear(data: RawTreemapItem[], year: string): RawTreemapItem[] {
    if (!year || year === '') return data;
    
    return data.filter(item => {
      if (!item.Date) return false;
      const itemYear = new Date(item.Date).getFullYear().toString();
      return itemYear === year;
    });
  }

  /**
   * Filter data by region
   */
  filterByRegion(data: RawTreemapItem[], region: string): RawTreemapItem[] {
    if (!region || region === '') return data;
    
    return data.filter(item => {
      return item.Region === region;
    });
  }

  /**
   * Get total value for all data
   */
  getTotalValue(data: RawTreemapItem[]): number {
    return data.reduce((sum, item) => sum + (Number(item.Value) || 0), 0);
  }

  /**
   * Get statistics for the current dataset
   */
  getDataStatistics(data: RawTreemapItem[]): {
    totalItems: number;
    totalValue: number;
    uniqueNaics: number;
    topCategories: Array<{ naics: string; title: string; value: number; percentage: number }>;
  } {
    const totalValue = this.getTotalValue(data);
    const groupedData = this.groupByNaics(data);
    const categories = Object.values(groupedData);
    
    // Sort by value and get top categories
    const topCategories = categories
      .sort((a, b) => b.provExpValue - a.provExpValue)
      .slice(0, 10)
      .map(cat => ({
        naics: cat.naics,
        title: cat.Title,
        value: cat.provExpValue,
        percentage: totalValue > 0 ? (cat.provExpValue / totalValue) * 100 : 0
      }));

    return {
      totalItems: data.length,
      totalValue,
      uniqueNaics: categories.length,
      topCategories
    };
  }

  /**
   * Format number with K, M, B suffixes (like your amCharts number formatter)
   */
  formatNumber(value: number): string {
    return TreemapChartUtils.formatNumber(value, this.config);
  }

  /**
   * Get color for a category
   */
  getCategoryColor(index: number): string {
    return this.config.colors[index % this.config.colors.length];
  }

  /**
   * Validate if NAICS code exists
   */
  isValidNaics(naics: string): boolean {
    return naics && naics.trim().length > 0;
  }

  /**
   * Search for categories by title or NAICS code
   */
  searchCategories(data: RawTreemapItem[], searchTerm: string): RawTreemapItem[] {
    if (!searchTerm || searchTerm.trim() === '') return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      item.naics.toLowerCase().includes(term) ||
      item.naics_description.toLowerCase().includes(term)
    );
  }

  /**
   * Export data in different formats
   */
  exportData(data: RawTreemapItem[], format: 'csv' | 'json'): string {
    if (format === 'csv') {
      const headers = ['NAICS', 'Description', 'Value', 'Date', 'Region'];
      const rows = data.map(item => [
        item.naics,
        item.naics_description,
        item.Value,
        item.Date || '',
        item.Region || ''
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    } else {
      return JSON.stringify(data, null, 2);
    }
  }

  /**
   * Calculate drill-down data for a specific NAICS category
   */
  getDrillDownData(data: RawTreemapItem[], naics: string): RawTreemapItem[] {
    return data.filter(item => item.naics === naics);
  }

  /**
   * Get percentage of each category relative to total
   */
  getCategoryPercentages(data: RawTreemapItem[]): Array<{ naics: string; title: string; percentage: number }> {
    const totalValue = this.getTotalValue(data);
    const groupedData = this.groupByNaics(data);
    
    return Object.values(groupedData).map(category => ({
      naics: category.naics,
      title: category.Title,
      percentage: totalValue > 0 ? (category.provExpValue / totalValue) * 100 : 0
    }));
  }
}