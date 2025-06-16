// overtime-chart.model.ts

export interface ChartDimensions {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  width: number;
  height: number;
}

export interface CategoryMapping {
  min: number;
  max: number;
}

export interface IconMapping {
  [key: string]: CategoryMapping;
}

export interface IconCategoryMapping {
  [iconClass: string]: string;
}

export interface ChartDataPoint {
  Date: number;
  [category: string]: number;
}

export interface GroupedDataPoint {
  Date: number;
  Category: string;
  TotalValue: number;
}

export interface RemappedDataPoint {
  Date: number;
  Grouping: string;
  Value: number;
  Mapping: string;
}

export interface RawDataItem {
  Date: string;
  product: number;
  Value: number;
  // Additional optional properties that might be in the data
  naics?: number;
  naics_description?: string;
  pci?: number;
  distance?: number;
  rca?: number;
  eci?: number;
  cluster_name?: string;
}

export interface ChartConfig {
  keys: string[];
  iconMapping: IconMapping;
  iconCategoryMapping: IconCategoryMapping;
  dimensions: ChartDimensions;
  colors: string[];
  siSymbols: string[];
}

export interface TooltipData {
  category: string;
  value: number;
  year: number;
}

export interface ChartEvents {
  onNodeClick?: (data: TooltipData) => void;
  onDataUpdate?: (data: RemappedDataPoint[]) => void;
  onCategoryToggle?: (category: string, isVisible: boolean) => void;
}

// Additional interfaces for enhanced functionality

export interface ChartState {
  isLoading: boolean;
  error: string | null;
  currentRegion: string;
  currentYear: string;
  visibleCategories: Set<string>;
}

export interface CategoryStatistics {
  category: string;
  total: number;
  average: number;
  growth: number;
  percentage: number;
}

export interface YearStatistics {
  year: number;
  total: number;
  categories: CategoryStatistics[];
  topCategory: string;
}

export interface DataSummary {
  totalYears: number;
  yearRange: {start: number, end: number};
  totalCategories: number;
  activeCategoriesCount: number;
  overallTotal: number;
  averagePerYear: number;
  yearlyStatistics: YearStatistics[];
}

export interface ChartOptions {
  showTooltips: boolean;
  enableCategoryToggling: boolean;
  enableDataTable: boolean;
  showCacheStatus: boolean;
  chartWidth: number;
  chartHeight: number;
  customConfig?: Partial<ChartConfig>;
}

export interface FilterOptions {
  startYear?: number;
  endYear?: number;
  categories?: string[];
  minValue?: number;
  maxValue?: number;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  includeMetadata: boolean;
  filename?: string;
}

// Type guards for runtime type checking
export function isChartDataPoint(obj: any): obj is ChartDataPoint {
  return obj && typeof obj === 'object' && typeof obj.Date === 'number';
}

export function isRawDataItem(obj: any): obj is RawDataItem {
  return obj && 
         typeof obj === 'object' && 
         typeof obj.Date === 'string' && 
         typeof obj.product === 'number' && 
         typeof obj.Value === 'number';
}

export function isValidChartConfig(config: any): config is ChartConfig {
  return config &&
         typeof config === 'object' &&
         Array.isArray(config.keys) &&
         typeof config.iconMapping === 'object' &&
         typeof config.iconCategoryMapping === 'object' &&
         typeof config.dimensions === 'object' &&
         Array.isArray(config.colors) &&
         Array.isArray(config.siSymbols);
}

// Constants for default values
export const DEFAULT_CHART_DIMENSIONS: ChartDimensions = {
  margin: {
    top: 20,
    right: 80,
    bottom: 30,
    left: 50
  },
  width: 1440,
  height: 650
};

export const DEFAULT_COLORS = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#aec7e8"
];

export const DEFAULT_SI_SYMBOLS = ["", "k", "M", "B", "T", "P", "E"];

export const DEFAULT_CATEGORIES = [
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
];

// Utility type for partial chart config updates
export type PartialChartConfig = {
  [K in keyof ChartConfig]?: K extends 'dimensions' 
    ? Partial<ChartDimensions> & {
        margin?: Partial<ChartDimensions['margin']>;
      }
    : K extends 'iconMapping' 
      ? Partial<IconMapping>
      : K extends 'iconCategoryMapping'
        ? Partial<IconCategoryMapping>
        : ChartConfig[K];
};