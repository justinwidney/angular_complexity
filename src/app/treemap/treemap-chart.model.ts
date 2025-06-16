// treemap-chart.model.ts

export interface TreemapDataPoint {
  naics: string;
  naics_description: string;
  Value: number;
  product?: string;
  Title?: string;
  provExpValue?: number;
  children?: TreemapDataPoint[];
  // Additional fields for D3 treemap
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  depth?: number;
  height?: number;
  parent?: TreemapDataPoint;
  data?: any;
  value?: number;
}

export interface TreemapNode {
  product: string;
  provExpValue: number;
  Title: string;
  naics: string;
  children?: TreemapNode[];
  // D3 hierarchy properties
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  depth?: number;
  height?: number;
  parent?: TreemapNode;
  data?: any;
  value?: number;
}

export interface TreemapRootData {
  product: string;
  children: TreemapNode[];
}

export interface TreemapConfig {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors: string[];
  background: string;
  padding: number;
  nodeSpacing: number;
  minNodeSize: number;
  maxDepth: number;
  showLabels: boolean;
  showTooltips: boolean;
  animationDuration: number;
  numberFormat: {
    suffixes: Array<{ threshold: number; suffix: string }>;
  };
  labelConfig: {
    fontSize: number;
    fontFamily: string;
    maxLines: number;
    wordWrap: boolean;
    truncate: boolean;
  };
}

export interface TreemapTooltipData {
  title: string;
  value: number;
  naics: string;
  description: string;
  percentage?: number;
}

export interface TreemapEvents {
  nodeClicked: TreemapTooltipData;
  nodeHovered: TreemapTooltipData;
  dataUpdated: TreemapNode[];
}

export interface GroupedData {
  [key: string]: {
    product: string;
    provExpValue: number;
    Title: string;
    naics: string;
  };
}

export interface TreemapDimensions {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface TreemapState {
  currentDepth: number;
  selectedNode: TreemapNode | null;
  hoveredNode: TreemapNode | null;
  isAnimating: boolean;
}

// Raw data interface (from your API)
export interface RawTreemapItem {
  naics: string;
  naics_description: string;
  Value: number;
  Date?: string;
  Region?: string;
  [key: string]: any;
}