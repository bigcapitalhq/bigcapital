// @ts-nocheck
import intl from 'react-intl-universal';

export const getFiscalYear = () => [
  {
    name: `${intl.get('january')} - ${intl.get('december')}`,
    key: 'january',
  },
  {
    name: `${intl.get('february')} - ${intl.get('january')}`,
    key: 'february',
  },
  {
    name: `${intl.get('march')} - ${intl.get('february')}`,
    key: 'march',
  },
  {
    name: `${intl.get('april')} - ${intl.get('march')}`,
    key: 'april',
  },
  {
    name: `${intl.get('may')} - ${intl.get('april')}`,
    key: 'may',
  },
  {
    name: `${intl.get('june')} - ${intl.get('may')}`,
    key: 'june',
  },
  {
    name: `${intl.get('july')} - ${intl.get('june')}`,
    key: 'july',
  },
  {
    name: `${intl.get('august')} - ${intl.get('july')}`,
    key: 'august',
  },
  {
    name: `${intl.get('september')} - ${intl.get('august')}`,
    key: 'september',
  },
  {
    name: `${intl.get('october')} - ${intl.get('november')}`,
    key: 'october',
  },
  {
    name: `${intl.get('november')} - ${intl.get('october')}`,
    key: 'november',
  },
  {
    name: `${intl.get('december')} - ${intl.get('november')}`,
    key: 'december',
  },
]