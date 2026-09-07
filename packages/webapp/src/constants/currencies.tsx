import currencies from 'js-money/lib/currency';
import { sortBy } from 'lodash';
import intl from 'react-intl-universal';

// Supplement missing currencies absent in js-money@0.6.3.
const EXTRA_CURRENCIES: Record<string, any> = {
  LRD: {
    symbol: 'L$',
    name: 'Liberian Dollar',
    symbol_native: 'L$',
    decimal_digits: 2,
    rounding: 0,
    code: 'LRD',
    name_plural: 'Liberian dollars',
  },
  SLE: {
    symbol: 'Le',
    name: 'Sierra Leonean Leone',
    symbol_native: 'Le',
    decimal_digits: 2,
    rounding: 0,
    code: 'SLE',
    name_plural: 'Sierra Leonean leones',
  },
};

Object.entries(EXTRA_CURRENCIES).forEach(([code, meta]) => {
  if (!(currencies as Record<string, any>)[code]) {
    (currencies as Record<string, any>)[code] = meta;
  }
});

export interface CurrencyOption {
  name: string;
  code: string;
}

export const getCurrencies = (): CurrencyOption[] => [
  { name: intl.get('us_dollar'), code: 'USD' },
  { name: intl.get('euro'), code: 'EUR' },
  { name: intl.get('libyan_diner'), code: 'LYD' },
];

export const getAllCurrenciesOptions = (): Array<{
  key: string;
  name: string;
}> => {
  const codes = Object.keys(currencies);
  const sortedCodes = sortBy(codes);

  return sortedCodes.map((code) => {
    const currency = currencies[code];

    return {
      key: code,
      name: `${code} - ${currency.name}`,
    };
  });
};
