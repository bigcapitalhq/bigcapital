import * as JsMoneyCurrencies from 'js-money/lib/currency';
import { additionalCurrencies } from '@bigcapital/utils';
import { Currencies } from './currencies';
import { formatNumber } from './format-number';

describe('Currencies', () => {
  it('should include the currencies missing from js-money', () => {
    expect(JsMoneyCurrencies['ANG']).toBeUndefined();
    expect(Currencies.ANG).toMatchObject({ code: 'ANG', decimal_digits: 2 });
    expect(Currencies.XCG).toMatchObject({ code: 'XCG', decimal_digits: 2 });
  });

  it('should not override any js-money entry', () => {
    for (const code of Object.keys(additionalCurrencies)) {
      expect(JsMoneyCurrencies[code]).toBeUndefined();
    }
  });

  it('should keep the js-money entries untouched', () => {
    expect(Currencies.USD).toEqual(JsMoneyCurrencies['USD']);
    expect(Currencies.EUR).toEqual(JsMoneyCurrencies['EUR']);
  });

  it('should format amounts with the sign of an added currency', () => {
    const formatted = formatNumber(1500, { currencyCode: 'ANG' });

    expect(formatted).toBe(`${Currencies.ANG.symbol}1,500.00`);
  });
});
