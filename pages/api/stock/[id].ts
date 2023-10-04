import useSWR from 'swr'
import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import AlphaVantage, {
  Interval,
  DataType,
  StockTimeSeries,
} from 'alphavantage-wrapper-ts';


const av = new AlphaVantage({ apikey: process.env.ALPHAVANTAGE_API_KEY });

// GET /api/stock/:id
// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {

  // Run the middleware
  await runMiddleware(req, res, cors);
  const symbol = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const wrappedOutput = await av.stockTimeSeries.daily({ symbol, datatype: DataType.JSON });
  // const getUrl =
  //   `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${stockSymbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
  // // const { data, error } = useSWR(getUrl, (...args) => fetch(...args).then(res => res.json()))
  // const apiResponse = await (await fetch(getUrl)).json();

  res.json(wrappedOutput);
  // if (data) {
  //   console.log('in the api handler');
  //   console.log('data', data);
  // }
  // const post = await prisma.post.update({
  //   where: { id: postId },
  //   data: { published: true },
  // });
  // if (error) {
  //   throw new Error(error);
  // }
  // res(data);
}
