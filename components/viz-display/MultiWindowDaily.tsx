import { StockTimeSeries } from "alphavantage-wrapper-ts";
import { createNestedRechartsDataFromResponse, createRechartsDataFromResponse } from "lib/utils/convert";
import { XAxis, Line, Tooltip, XAxisProps, YAxis, ComposedChart } from "recharts";
import { scaleTime } from 'd3-scale';
import { timeFormat } from 'd3-time-format';
import { timeDay } from 'd3-time';

export type GraphDatum = {
  symbol: string,
  data: StockTimeSeries.DailyResponse,
  color: string,
}
export interface MultiWindowDailyProps {
  graphData: GraphDatum[]
}

export const MultiWindowDaily: React.FC<MultiWindowDailyProps> = ({ graphData }) => {
  const reDataNested = createNestedRechartsDataFromResponse({ graphData });
  console.log('nested', reDataNested);
  if (!reDataNested || reDataNested.length === 0) {
    return null;
  }
  const dateValues = reDataNested.map(rd => rd.date);
  console.log(new Date(dateValues[0]));
  const timeScale = scaleTime().domain([Math.min(...dateValues), Math.max(...dateValues)]);

  const xAxisArgs: XAxisProps = {
    domain: timeScale.domain().map(date => date.valueOf()),
    scale: timeScale,
    type: 'number',
    ticks: timeScale.ticks(5).map(date => date.valueOf()),
    tickFormatter: timeFormat('%a %b %d')
  };
  console.log('graphData', graphData);
  return (
    <ComposedChart data={reDataNested} width={730} height={250} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <YAxis />
      <XAxis dataKey="date" {...xAxisArgs} />
      {graphData.map(gd => {
        return <Line type="monotone" dataKey={`values.${gd.symbol}`} key={`${gd.symbol}-${gd.color}`} stroke={gd.color} />
      })}
      <Tooltip labelFormatter={timeFormat('%a %b %d')}/>
    </ComposedChart>
  )
}
