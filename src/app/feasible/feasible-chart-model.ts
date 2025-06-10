// feasible-chart.models.ts

export interface FeasibleData {
  hs2: number;
  hs4: number;
  naics2: number;
  pci: number;
  distance: number;
  description: string;
  description2: string;
  value: number;
  rca: number;
  Date: string;
  state: number;
  length: number;
  naics?: number;
  naics_desc?: string;
}

export interface FeasiblePoint {
  pci: number;
  distance: number;
  description: string;
  description2: string;
  value: number;
  hs2: number;
  hs4: number;
  length: number;
  rca: number;
  Date: string;
  state: number;
  color?: string;
}

export interface QuadrantInfo {
  x: number;
  y: number;
  color: string;
  title: string;
  text: string;
}

export interface IconMapping {
  [key: string]: [number, number]; // [min, max] range
}

export interface IconColorMapping {
  [key: string]: string;
}

export interface IconTruthMapping {
  [key: string]: boolean;
}

export interface HSCodes {
  [key: string]: string;
}

export interface NaicsDescriptions {
  [key: string]: string;
}

export interface FeasibleChartConfig {
  width: number;
  height: number;
  background: string;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  zoom: {
    scaleExtent: [number, number];
  };
}

export interface FeasibleScales {
  x: any; // d3 scale
  y: any; // d3 scale
  radius: any; // d3 scale
  color: any; // d3 scale
  hs4Color: any; // d3 scale
  naicsColor: any; // d3 scale
}

export enum DisplayMode {
  DEFAULT = 'default',
  FRONTIER = 'frontier', 
  FOUR_QUADS = 'four_quads'
}

export enum GroupingType {
  HS2 = 'hs2',
  HS4 = 'hs4',
  NAICS2 = 'naics2',
  NAICS4 = 'naics4'
}

export enum FilterType {
  ALL = 1,
  RCA_ABOVE_1 = 2,
  RCA_BETWEEN = 3,
  FRONTIER = 4
}

export interface FeasibleEventData {
  point: FeasiblePoint;
  event?: Event;
}

export interface ChartCoordinationState {
  selectedRegion: string;
  selectedYear: string;
  selectedGrouping: GroupingType;
  displayMode: DisplayMode;
  filterType: FilterType;
}