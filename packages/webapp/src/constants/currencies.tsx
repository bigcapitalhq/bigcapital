// @ts-nocheck
import intl from 'react-intl-universal';
import currencies from 'js-money/lib/currency';
import { sortBy } from 'lodash';

export const getCurrencies = () => [
  { name: intl.get('us_dollar'), code: 'USD' },
  { name: intl.get('euro'), code: 'EUR' },
  { name: intl.get('libyan_diner'), code: 'LYD' },
];

export const getAllCurrenciesOptions = () => {
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
