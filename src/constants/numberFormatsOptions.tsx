// @ts-nocheck
import intl from 'react-intl-universal';

export const moneyFormat = [
  { key: 'total', text: intl.get('total_rows') },
  { key: 'always', text: intl.get('always') },
  { key: 'none', text: intl.get('none') },
];

export const negativeFormat = [
  { key: 'parentheses', text: '($1000)' },
  { key: 'mines', text: '-$1000' },
];

export const decimalPlaces = [
  { text: '$1', key: 0 },
  { text: '$0.1', key: 1 },
  { text: '$0.01', key: 2 },
  { text: '$0.001', key: 3 },
  { text: '$0.0001', key: 4 },
  { text: '$0.00001', key: 5 },
];
