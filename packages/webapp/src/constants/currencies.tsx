import currencies from 'js-money/lib/currency';
import { sortBy } from 'lodash';
import intl from 'react-intl-universal';

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
