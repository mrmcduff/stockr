import { StockTimeSeries } from "alphavantage-wrapper-ts";
import { DailyMultiGraphData, DailyMultiResponse, TimeSeriesDatum, TimeSeriesNestedDatum } from "./types";


export function convertDailyAlphaToRecharts(avData: StockTimeSeries.DailyResponse): TimeSeriesDatum[] {
  const data = Object.keys(avData.timeSeries).map(ok => {
    const okDate = new Date(ok);
    return { date: okDate.getTime(), [avData.metadata.symbol]: Number(avData.timeSeries[ok].close) }
  });
  return data;
}

export function convertDailyAlphaToNestedTimeSeries(avData: StockTimeSeries.DailyResponse): TimeSeriesNestedDatum[] {
  const data = Object.keys(avData.timeSeries).map(ok => {
    const okDate = new Date(ok);
    return { date: okDate.getTime(), values: { [avData.metadata.symbol]: Number(avData.timeSeries[ok].close) } }
  });
  console.log('raw convert data', data);
  data.sort((a, b) => a.date - b.date);
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

function mergeNestedTimeSeriesData(ts1: TimeSeriesNestedDatum[], ts2: TimeSeriesNestedDatum[]): TimeSeriesNestedDatum[] {
  const merged: TimeSeriesNestedDatum[] = [];
  let ts1Idx = 0;
  let ts2Idx = 0;
  while (ts1Idx < ts1.length && ts2Idx < ts2.length) {
    const ts1date = ts1[ts1Idx].date;
    const ts2date = ts2[ts2Idx].date;
    if (ts1date === ts2date) {
      merged.push({
        date: ts1date,
        values: { ...ts1[ts1Idx].values, ...ts2[ts2Idx].values }
      });
      ts1Idx += 1;
      ts2Idx += 1;
    } else if (ts1date < ts2date) {
      merged.push({
        date: ts1date,
        values: { ...ts1[ts1Idx].values }
      });
      ts1Idx += 1;
    } else {
      merged.push({
        date: ts2date,
        values: { ...ts2[ts2Idx].values }
      });
      ts2Idx += 1;
    }
  }
  // In the nice case, we should be done here.
  // But if one or the other of the series is missing dates,
  // we need to finish off the rest of them.
  while (ts1Idx < ts1.length) {
      merged.push({
        date: ts1[ts1Idx].date,
        values: { ...ts1[ts1Idx].values }
      });
      ts1Idx += 1;
  }
  while (ts2Idx < ts2.length) {
      merged.push({
        date: ts2[ts2Idx].date,
        values: { ...ts2[ts2Idx].values }
      });
      ts2Idx += 1;
  }
  return merged;
}

export function multiConvertDailyAlphaToRechartsNested(responseData: DailyMultiResponse): TimeSeriesNestedDatum[] {
  const singleData = responseData.graphData.map(gd => convertDailyAlphaToNestedTimeSeries(gd.data));
  const merged = singleData.reduce((acc, curr) => {
    return mergeNestedTimeSeriesData(acc, curr);
  }, []);
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

function createOrderedPairs(items: string[]): [string, string][] {
  const pairs: [string, string][] = [];
  items.forEach((_, idx) => {
    const copyItems = [...items];
    const [removed] = copyItems.splice(idx, 1);
    copyItems.forEach(cpi => {
      pairs.push([removed, cpi]);
    });
  });
  return pairs;
}

export function addDiffs(data: TimeSeriesNestedDatum[]): TimeSeriesNestedDatum[] {
  const mapped = data.map(d => {
    const diffList = Object.keys(d.values);
    if (diffList.length <= 1) {
      return d;
    }
    const orderedDiffPairs = createOrderedPairs(diffList);
    const output = { ...d, diffs: {} };
    diffList.forEach(dl => {
      output.diffs[dl] = {};
    }); // initialize the diffs object
    orderedDiffPairs.forEach(op => {
      const firstVal = d.values[op[0]];
      const secondVal = d.values[op[1]];
      output.diffs[op[0]][op[1]] = firstVal - secondVal;
    });
    return output;
  });

  return mapped;
}

export function createNestedRechartsDataFromResponse(responseData: DailyMultiResponse): TimeSeriesNestedDatum[] {
  const noDiffs = multiConvertDailyAlphaToRechartsNested(responseData);
  return addDiffs(noDiffs);
}

export function createRechartsDataFromResponse(responseData: DailyMultiResponse): TimeSeriesDatum[] {
  return mergeMultiData(multiConvertDailyAlphaToRecharts(responseData));
}
