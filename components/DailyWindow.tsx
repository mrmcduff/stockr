import { StockTimeSeries } from "alphavantage-wrapper-ts";
import { convertDailyAlphaToRecharts } from "lib/utils/convert";
import { LineChart, XAxis, Line, Tooltip, XAxisProps, ComposedChart } from "recharts";
import { scaleTime } from 'd3-scale';
import { timeFormat } from 'd3-time-format';
import { timeDay } from 'd3-time';

interface DailyWindowProps {
  symbol: string;
  stockData: StockTimeSeries.DailyResponse;
}

export const DailyWindow: React.FC<DailyWindowProps> = ({ symbol, stockData }) => {
  const reData = convertDailyAlphaToRecharts(stockData);
  console.log(reData);
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
  return (
    <ComposedChart data={reData} width={730} height={250} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="date" {...xAxisArgs} />
      <Line type="monotone" dataKey={symbol} stroke="#8884d8" />
      <Tooltip labelFormatter={timeFormat('%a %b %d')}/>
    </ComposedChart>
  )
}
