// product-space-chart.models.ts

export interface Link {
  source: string;
  target: string;
  state: number;
}

export interface Node {
  id: string;
  x: number;
  y: number;
  cluster_name: string;
  category?: any;
  state: number;
}

export interface GroupedData {
  product: number; // Changed back to number since your actual data uses numbers
  Value: number;
  Date: string;
  description?: string;
  prio: number;
  GeoName?: string;
  dest?: any;
  distance?: number;
  eci?: number;
  naics?: number;
  naics_description?: string;
  pci?: number;
  rca?: number;
}

export interface HSDescription {
  HS4: string;
  'HS4 Short Name': string;
}

export interface RawNode {
  product_code: number;
  x: number;
  y: number;
  cluster_name: string;
}

export interface ChartDimensions {
  width: string;
  height: number;
  transform: {
    x: number;
    y: number;
    scale: number;
  };
}

export interface ZoomConfig {
  scaleExtent: [number, number];
}

export interface GroupLabel {
  name: string;
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  fontWeight?: string;
  fill?: string;
  transform?: string;
  className?: string;
}