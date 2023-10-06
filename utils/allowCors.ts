import Cors from 'cors'
import { runMiddleware } from './runMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
export const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

export async function allowCors(req: NextApiRequest, res: NextApiResponse) {
  // Run the middleware
  await runMiddleware(req, res, cors);
}
