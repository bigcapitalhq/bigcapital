// @ts-nocheck
import jsMoneyCurrencies from 'js-money/lib/currency';
import { additionalCurrencies } from '../additionalCurrencies';
import { allCurrencies, getAllCurrenciesOptions } from '../currencies';

describe('allCurrencies', () => {
  it('includes every js-money currency', () => {
    for (const code of Object.keys(jsMoneyCurrencies)) {
      expect(allCurrencies[code]).toBeDefined();
    }
  });

  it('includes the ISO 4217 currencies missing from js-money', () => {
    // Regression guard for #1182 (LRD, SLE/SLL) and #909 (GYD).
    for (const code of ['LRD', 'SLL', 'SLE', 'GYD', 'XCD']) {
      expect(jsMoneyCurrencies[code]).toBeUndefined();
      expect(allCurrencies[code]).toBeDefined();
      expect(allCurrencies[code].name).toBeTruthy();
    }
  });

  it('lets js-money win on key clashes', () => {
    expect(allCurrencies.USD).toBe(jsMoneyCurrencies.USD);
  });

  it('does not lose any additional currency to a clash', () => {
    for (const code of Object.keys(additionalCurrencies)) {
      expect(allCurrencies[code]).toBeDefined();
    }
  });
});

describe('getAllCurrenciesOptions', () => {
  const options = getAllCurrenciesOptions();

  it('returns one { key, name } entry per known currency', () => {
    expect(options).toHaveLength(Object.keys(allCurrencies).length);
    expect(options.find((o) => o.key === 'LRD')).toEqual({
      key: 'LRD',
      name: 'LRD - Liberian Dollar',
    });
  });

  it('is sorted by currency code', () => {
    const codes = options.map((o) => o.key);
    expect(codes).toEqual([...codes].sort());
  });
});
