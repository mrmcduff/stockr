import { StockTimeSeries } from "alphavantage-wrapper-ts";
import { DailyMultiGraphData, DailyMultiResponse, TimeSeriesDatum } from "./types";


export function convertDailyAlphaToRecharts(avData: StockTimeSeries.DailyResponse): TimeSeriesDatum[] {
  const data = Object.keys(avData.timeSeries).map(ok => {
    const okDate = new Date(ok);
    return { date: okDate.getTime(), [avData.metadata.symbol]: Number(avData.timeSeries[ok].close) }
  });
  return data;
}

export function multiConvertDailyAlphaToRecharts(responseData: DailyMultiResponse): DailyMultiGraphData {
  const reChartsData: DailyMultiGraphData = { graphData: [] };
  responseData.graphData.forEach(rgd => {
    const chartData = convertDailyAlphaToRecharts(rgd.data);
    reChartsData.graphData.push({ symbol: rgd.symbol, color: rgd.color, data: chartData })
  });
  return reChartsData;
}

function mergeTimeSeriesData(ts1: TimeSeriesDatum[], ts2: TimeSeriesDatum[]): TimeSeriesDatum[] {
  const merged: TimeSeriesDatum[] = [];
  ts1.forEach((item, idx) => {
    const second = ts2.length > idx ? ts2[idx] : {};
    merged.push({ ...item, ...second });
  });
  return merged;
}

export function mergeMultiData(data: DailyMultiGraphData): TimeSeriesDatum[] {
  if (data.graphData.length === 0) {
    return null;
  }
  const merged = data.graphData.reduce((acc, curr) => {
    if (acc.length === 0) {
      return curr.data;
    }
    return mergeTimeSeriesData(acc, curr.data);
  }, []);
  return merged;
}

export function createRechartsDataFromResponse(responseData: DailyMultiResponse): TimeSeriesDatum[] {
  return mergeMultiData(multiConvertDailyAlphaToRecharts(responseData));
}
