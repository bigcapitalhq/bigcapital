import intl from 'react-intl-universal';

export const getFiscalYearOptions = () => [
  {
    id: 0,
    name: `${intl.get('january')} - ${intl.get('december')}`,
    value: 'january',
  },
  {
    id: 1,
    name: `${intl.get('february')} - ${intl.get('january')}`,
    value: 'february',
  },
  {
    id: 2,
    name: `${intl.get('march')} - ${intl.get('february')}`,
    value: 'March',
  },
  {
    id: 3,
    name: `${intl.get('april')} - ${intl.get('march')}`,
    value: 'april',
  },
  {
    id: 4,
    name: `${intl.get('may')} - ${intl.get('april')}`,
    value: 'may',
  },
  {
    id: 5,
    name: `${intl.get('june')} - ${intl.get('may')}`,
    value: 'june',
  },
  {
    id: 6,
    name: `${intl.get('july')} - ${intl.get('june')}`,
    value: 'july',
  },
  {
    id: 7,
    name: `${intl.get('august')} - ${intl.get('july')}`,
    value: 'August',
  },
  {
    id: 8,
    name: `${intl.get('september')} - ${intl.get('august')}`,
    value: 'september',
  },
  {
    id: 9,
    name: `${intl.get('october')} - ${intl.get('november')}`,
    value: 'october',
  },
  {
    id: 10,
    name: `${intl.get('november')} - ${intl.get('october')}`,
    value: 'november',
  },
  {
    id: 11,
    name: `${intl.get('december')} - ${intl.get('november')}`,
    value: 'december',
  },
]