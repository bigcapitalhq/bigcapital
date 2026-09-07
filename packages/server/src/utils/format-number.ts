import { get } from 'lodash';
import * as accounting from 'accounting';
import * as Currencies from 'js-money/lib/currency';

// Supplement missing ISO 4217 currencies (js-money@0.6.3 lacks LRD/SLE).
const EXTRA_CURRENCY_SYMBOLS: Record<string, any> = {
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

Object.entries(EXTRA_CURRENCY_SYMBOLS).forEach(([code, meta]) => {
  if (!(Currencies as Record<string, any>)[code]) {
    (Currencies as Record<string, any>)[code] = meta;
  }
});

const getNegativeFormat = (formatName) => {
  switch (formatName) {
    case 'parentheses':
      return '(%s%v)';
    case 'mines':
      return '-%s%v';
  }
};

const getCurrencySign = (currencyCode) => {
  return get(Currencies, `${currencyCode}.symbol`);
};

export interface IFormatNumberSettings {
  precision?: number;
  divideOn1000?: boolean;
  excerptZero?: boolean;
  negativeFormat?: string;
  thousand?: string;
  decimal?: string;
  zeroSign?: string;
  money?: boolean;
  currencyCode?: string;
  symbol?: string;
}

export const formatNumber = (
  balance,
  {
    precision = 2,
    divideOn1000 = false,
    excerptZero = false,
    negativeFormat = 'mines',
    thousand = ',',
    decimal = '.',
    zeroSign = '',
    money = true,
    currencyCode,
    symbol = '',
  }: IFormatNumberSettings,
) => {
  const formattedSymbol = getCurrencySign(currencyCode);
  const negForamt = getNegativeFormat(negativeFormat);
  const format = '%s%v';

  let formattedBalance = parseFloat(balance);

  if (divideOn1000) {
    formattedBalance /= 1000;
  }
  return accounting.formatMoney(
    formattedBalance,
    money ? formattedSymbol : symbol ? symbol : '',
    precision,
    thousand,
    decimal,
    {
      pos: format,
      neg: negForamt,
      zero: excerptZero ? zeroSign : format,
    },
  );
};
