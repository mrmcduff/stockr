import { isStockBasicInfo } from "utils/stocks";

describe('JSON validation testing', () => {
  it('correctly parses a valid object', () => {
    const reply = isStockBasicInfo({ symbol: 'ABC', name: 'sesame', exchange: 'NYSE', assetType: 'Stock', ipoDate: '11/12/2000' });
    expect(reply).toBe(true);
  });

  it('correctly rejects an empty object', () => {
    expect(isStockBasicInfo({})).toBe(false);
  });

  it('correclty rejects something with a missing key', () => {
    const noSymbol = isStockBasicInfo({ name: 'sesame', exchange: 'NYSE', assetType: 'Stock', ipoDate: '11/12/2000' });
    const noName = isStockBasicInfo({ symbol: 'ABC', exchange: 'NYSE', assetType: 'Stock', ipoDate: '11/12/2000' });
    const noAssetType = isStockBasicInfo({ name: 'sesame', exchange: 'NYSE', symbol: 'ABC', ipoDate: '11/12/2000' });
    const noExchange = isStockBasicInfo({ name: 'sesame', symbol: 'ABC', assetType: 'Stock', ipoDate: '11/12/2000' });
    const noIpoDate = isStockBasicInfo({ name: 'sesame', exchange: 'NYSE', assetType: 'Stock', symbol: 'ABC' });
    const replies = [noSymbol, noName, noAssetType, noExchange, noIpoDate];
    expect(replies.every(d => !!d)).toBe(false);
  });

  it('rejects invalid asset types', () => {
    const reply = isStockBasicInfo({ symbol: 'ABC', name: 'sesame', exchange: 'NYSE', assetType: 'Foo', ipoDate: '11/12/2000' });
    expect(reply).toBe(false);
  });

  it('rejects invalid exchanges', () => {
    const reply = isStockBasicInfo({ symbol: 'ABC', name: 'sesame', exchange: 'Bob', assetType: 'Stock', ipoDate: '11/12/2000' });
    expect(reply).toBe(false);
  });
});
