import useSWR from 'swr'
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import AlphaVantage, {
  Interval,
  DataType,
  StockTimeSeries,
} from 'alphavantage-wrapper-ts';
import { allowCors } from 'utils/allowCors';
import { getAv } from 'utils/alphavantageSingleton';


// GET /api/stock/:id
export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  // Run the middleware
  await allowCors(req, res);
  const av = getAv();
  const symbol = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const wrappedOutput = await av.stockTimeSeries.daily({ symbol, datatype: DataType.JSON });
  // const getUrl =
  //   `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${stockSymbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
  // // const { data, error } = useSWR(getUrl, (...args) => fetch(...args).then(res => res.json()))
  // const apiResponse = await (await fetch(getUrl)).json();

  res.json(wrappedOutput);
}
