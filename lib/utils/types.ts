import { StockTimeSeries } from "alphavantage-wrapper-ts";

export interface GraphTimeSeries {
  id: string | number;
  data: {
    x: number | string | Date
    y: number | string | Date
  }[]
}

export interface TimeSeriesNestedDatum {
  date: number;
  values: {
    [key: string]: number;
  }
  diffs?: {
    [key: string]: { // diffs From ticker
      [key: string]: number; // diffs to this ticker
    }
  }
}
export interface TimeSeriesDatum {
  date: number;
  [key: string]: number;
}

export interface DailyMultiResponse {
  graphData: {
    symbol: string,
    data: StockTimeSeries.DailyResponse,
    color: string,
  }[]
}

export interface DailyMultiGraphData {
  graphData: {
    symbol: string,
    data: TimeSeriesDatum[],
    color: string,
  }[]
}

export interface DailyMultiGraphDataNested {
  graphData: {
    symbol: string,
    data: TimeSeriesNestedDatum[],
    color: string,
  }[]
}
