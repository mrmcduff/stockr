import { StockTimeSeries } from "alphavantage-wrapper-ts";

export interface GraphTimeSeries {
  id: string | number;
  data: {
    x: number | string | Date
    y: number | string | Date
  }[]
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
