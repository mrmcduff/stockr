import { StockTimeSeries } from "alphavantage-wrapper-ts";
import { createRechartsDataFromResponse } from "lib/utils/convert";
import { LineChart, XAxis, Line, Tooltip, XAxisProps, YAxis } from "recharts";
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
  const reData = createRechartsDataFromResponse({ graphData })
  console.log('reData', reData);
  if (!reData || reData.length === 0) {
    return null;
  }
  const dateValues = reData.map(rd => rd.date);
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
    <LineChart data={reData} width={730} height={250} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <YAxis />
      <XAxis dataKey="date" {...xAxisArgs} />
      {graphData.map(gd => {
        return <Line type="monotone" dataKey={gd.symbol} key={`${gd.symbol}-${gd.color}`} stroke={gd.color} />
      })}
      <Tooltip labelFormatter={timeFormat('%a %b %d')}/>
    </LineChart>
  )
}
