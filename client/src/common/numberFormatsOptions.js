import { formatMessage } from 'services/intl';

export const moneyFormat = [
  { key: 'total', text: formatMessage({ id: 'total_rows' }) },
  { key: 'always', text: formatMessage({ id: 'always' }) },
  { key: 'none', text: formatMessage({ id: 'none' }) },
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
