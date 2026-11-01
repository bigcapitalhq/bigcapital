import intl from 'react-intl-universal';

export const moneyFormat: Array<{ key: string; text: string }> = [
  { key: 'total', text: intl.get('total_rows') },
  { key: 'always', text: intl.get('always') },
  { key: 'none', text: intl.get('none') },
];

export const negativeFormat: Array<{ key: string; text: string }> = [
  { key: 'parentheses', text: '($1000)' },
  { key: 'mines', text: '-$1000' },
];

export const decimalPlaces: Array<{ text: string; key: number }> = [
  { text: '$1', key: 0 },
  { text: '$0.1', key: 1 },
  { text: '$0.01', key: 2 },
  { text: '$0.001', key: 3 },
  { text: '$0.0001', key: 4 },
  { text: '$0.00001', key: 5 },
];
