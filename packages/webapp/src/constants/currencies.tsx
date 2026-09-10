import jsMoneyCurrencies from 'js-money/lib/currency';
import { sortBy } from 'lodash';
import intl from 'react-intl-universal';
import {
  additionalCurrencies,
  type CurrencyEntry,
} from './additionalCurrencies';

export interface CurrencyOption {
  name: string;
  code: string;
}

/**
 * All known currencies: the `js-money` list plus the active ISO 4217 currencies
 * it omits (see `additionalCurrencies`). `js-money` entries win on key clashes.
 */
export const allCurrencies: Record<string, CurrencyEntry> = {
  ...additionalCurrencies,
  ...(jsMoneyCurrencies as Record<string, CurrencyEntry>),
};

export const getCurrencies = (): CurrencyOption[] => [
  { name: intl.get('us_dollar'), code: 'USD' },
  { name: intl.get('euro'), code: 'EUR' },
  { name: intl.get('libyan_diner'), code: 'LYD' },
];

export const getAllCurrenciesOptions = (): Array<{
  key: string;
  name: string;
}> => {
  const sortedCodes = sortBy(Object.keys(allCurrencies));

  return sortedCodes.map((code) => ({
    key: code,
    name: `${code} - ${allCurrencies[code].name}`,
  }));
};
