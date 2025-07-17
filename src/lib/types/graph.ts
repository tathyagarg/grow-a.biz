export type LineGraphNodeRaw = {
  timestamp: Date;
  value: number;
}

export type LineGraphNode = {
  date: string;
  value: number;
}

export type LineGraphData = LineGraphNode[];
