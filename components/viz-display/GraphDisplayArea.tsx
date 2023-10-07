import { Button, Group, Stack } from "@mantine/core";
import { useCallback, useMemo, useReducer, useState } from "react";
import { StockTimeSeries } from "alphavantage-wrapper-ts";

import { getStockSymbols } from "utils/stocks"
import { SymbolTumbler } from "./SymbolTumbler";
import { DailyWindow } from "components/DailyWindow";
import { GraphDatum, MultiWindowDaily, MultiWindowDailyProps } from "./MultiWindowDaily";

type StockCache = {
  [key: string]: StockTimeSeries.DailyResponse,
}

function cacheStockData(state: StockCache, dispatch: StockTimeSeries.DailyResponse): StockCache {
  return  {...state, [dispatch.metadata.symbol]: dispatch }
}

async function fetchFunction(
  symbol: string,
  dataIndex: number,
  dispatch: React.Dispatch<StockTimeSeries.DailyResponse>,
  setFirstData: React.Dispatch<React.SetStateAction<StockTimeSeries.DailyResponse>>,
  setSecondData: React.Dispatch<React.SetStateAction<StockTimeSeries.DailyResponse>>) {
    const getUrl = `/api/stock/${symbol}`
    const apiResponse = await fetch(getUrl).catch(error => console.log('error in api', error));
    if (apiResponse) {
      const output = await apiResponse.json();
      const hackCastResponse = output as StockTimeSeries.DailyResponse;
      console.log('cache entry', `Caching value for ${hackCastResponse.metadata.symbol}`);
      dispatch(hackCastResponse);
      if (dataIndex === 0) {
        console.log('setting first data');
        setFirstData(hackCastResponse);
      } else if (dataIndex === 1) {
        console.log('setting second data');
        setSecondData(hackCastResponse);
      }
      console.log(output);
    }
}

export const GraphDisplayArea: React.FC = () => {
  const [firstSelection, setFirstSelection] = useState('');
  const [secondSelection, setSecondSelection] = useState('');
  const [firstData, setFirstData] = useState<StockTimeSeries.DailyResponse | null>(null);
  const [secondData, setSecondData] = useState<StockTimeSeries.DailyResponse | null>(null);

  const [cache, dispatch] = useReducer(cacheStockData, {});
  const cachedValues = useMemo(() => {
    return Object.keys(cache);
  }, [cache]);

  const graphProps: MultiWindowDailyProps = useMemo(() => {

    const firstArg = firstData ? {
      symbol: firstData.metadata.symbol,
      data: firstData,
      color: '#aa33aa',
    } : null;

    const secondArg = secondData ? {
      symbol: secondData.metadata.symbol,
      data: secondData,
      color: '#22aa99'
    } : null;
    const output: GraphDatum[] = [];
    if (firstArg) {
      output.push(firstArg);
    }
    if (secondArg) {
      output.push(secondArg);
    }
    console.log('graphData', output);
    return { graphData: output }
  }, [firstData, secondData]);

  const stockSymbolList = getStockSymbols();

  const handleClick = useCallback(() => {
    if (firstSelection) {
      if (cachedValues.includes(firstSelection)) {
        setFirstData(cache[firstSelection]);
      } else {
        console.log('cache miss', `Performing a fetch for ${firstSelection}`);
        fetchFunction(firstSelection, 0, dispatch, setFirstData, setSecondData);
      }
    }
    if (secondSelection) {
      if (cachedValues.includes(secondSelection)) {
        setSecondData(cache[secondSelection]);
      } else {
        console.log('cache miss', `Performing a fetch for ${secondSelection}`);
        fetchFunction(secondSelection, 1, dispatch, setFirstData, setSecondData);
      }
    }
  }, [firstSelection, secondSelection, cachedValues, cache, fetchFunction]);


  return (
    <Stack>
      <Group align={'end'}>
        <SymbolTumbler symbols={stockSymbolList} label={'First security'} changeHandler={setFirstSelection} />
        <SymbolTumbler symbols={stockSymbolList} label={'Second security'} changeHandler={setSecondSelection} />
        <Button onClick={handleClick} disabled={!!!firstSelection && !!!secondSelection}>Go fetch</Button>
      </Group>
      <MultiWindowDaily graphData={ graphProps.graphData }/>
    </Stack>
  )
}
