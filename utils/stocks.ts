import data from 'data/stock_list.json';
import stockdata from 'data/stock_info.json';

const VALID_ASSET_TYPES = ['Stock', 'ETF'] as const;
const VALID_EXCHANGES = ['NASDAQ', 'NYSE', 'NYSE ARCA', 'BATS', 'NYSE MKT'] as const;

type AssetType = typeof VALID_ASSET_TYPES[number];
type ExchangeType = typeof VALID_EXCHANGES[number];

type StockBasicInfo = {
  symbol: string,
  name: string,
  assetType: AssetType,
  exchange: ExchangeType,
  ipoDate: string,
}

let validStocks: string[] = [];
let validStockInfo: StockBasicInfo[] = [];
export function getStockSymbols(): readonly string[] {
  if (validStocks.length > 0) {
    return validStocks;
  }
  if (Array.isArray(data) && data.every(d => typeof (d) === 'string')) {
    validStocks = data;
    return validStocks;
  }
}

export function isStockBasicInfo(o: object): o is StockBasicInfo {
  const requiredKeys = ['symbol', 'name', 'assetType', 'exchange', 'ipoDate'];
  if (!requiredKeys.every(k => k in o)) {
    return false;
  }
  const at = o['assetType'];
  const ex = o['exchange'];
  if (!VALID_ASSET_TYPES.includes(at) || !VALID_EXCHANGES.includes(ex)) {
    return false;
  }

  return true;
}

export function getStockInfo(): readonly StockBasicInfo[] {
  if (validStockInfo.length > 0) {
    return validStockInfo;
  }
  if (Array.isArray(stockdata) && stockdata.every(sd => isStockBasicInfo(sd))) {
    validStockInfo = stockdata as StockBasicInfo[];
    return validStockInfo;
  }
  return [];
}
