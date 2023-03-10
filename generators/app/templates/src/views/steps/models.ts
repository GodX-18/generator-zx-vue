export interface tableItemModel {
  drainNum: string;
  drainMm: number;
  drainM3: number;
  drainWay: string;
  drainType: string;
  waterQuality?: waterModel[];
}

export interface waterModel {
  label: string;
  value: number;
}
