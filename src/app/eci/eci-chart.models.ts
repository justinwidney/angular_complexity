// eci-chart.models.ts

export interface ECIRawDataItem {
    year: string;
    origin: string;
    eci: string | number;
      id?: string; // Add this optional field
  }
  
  export interface ECIDataPoint {
    year: number;
    eci: number;
     id?: string; // Add this optional field
  }
  
  export interface ECILineData {
    name: string;
    values: ECIDataPoint[];
  }
  
  export interface ECIChartConfig {
    margin: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    width: number;
    height: number;
    background: string;
    colors: string[];
    defaultPadding: number;
    strokeWidth: number;
    circleRadius: number;
    legendSpacing: number;
    transitionDuration: number;
  }
  
  export interface ECIScales {
    x: d3.ScaleLinear<number, number>;
    y: d3.ScaleLinear<number, number>;
    color: d3.ScaleOrdinal<string, string>;
  }
  
  export interface ECITooltipData {
    provinceName: string;
    year: number;
    eci: number;
    fullProvinceName: string;
  }
  
  export interface ECIChartEvents {
    onLineHovered?: (data: ECITooltipData) => void;
    onLineClicked?: (data: ECITooltipData) => void;
    onProvinceHighlighted?: (provinceName: string) => void;
    onDataLoaded?: (lineData: ECILineData[]) => void;
  }
  
  export interface ECIChartStats {
    provinceCount: number;
    yearRange: {
      min: number;
      max: number;
    };
    eciRange: {
      min: number;
      max: number;
    };
    dataPoints: number;
  }
  
  export interface ECIProvinceMapping {
    [fullName: string]: string;
  }
  
  export interface ECIMousePosition {
    x: number;
    y: number;
    year: number;
    eci: number;
  }
  
  // Enums
  export enum ECIDisplayMode {
    ALL_PROVINCES = 'all',
    SELECTED_PROVINCES = 'selected',
    COMPARISON = 'comparison'
  }
  
  export enum ECIInteractionState {
    NORMAL = 'normal',
    HOVERING = 'hovering',
    SELECTED = 'selected'
  }