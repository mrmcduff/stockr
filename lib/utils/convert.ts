import { StockTimeSeries } from "alphavantage-wrapper-ts";
import { TimeSeriesDatum } from "./types";


export function convertDailyAlphaToRecharts(avData: StockTimeSeries.DailyResponse): TimeSeriesDatum[] {
  const data = Object.keys(avData.timeSeries).map(ok => {
    const okDate = new Date(ok);
    return { date: okDate.getTime(), [avData.metadata.symbol]: Number(avData.timeSeries[ok].close) }
  });
  return data;
}
