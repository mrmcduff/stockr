import AlphaVantage from "alphavantage-wrapper-ts";

const av = new AlphaVantage({ apikey: process.env.ALPHAVANTAGE_API_KEY });

export function getAv(): AlphaVantage {
  return av;
}
