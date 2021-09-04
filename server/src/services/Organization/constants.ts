import currencies from 'js-money/lib/currency';

export const DATE_FORMATS = [
  'MM.dd.yy',
  'dd.MM.yy',
  'yy.MM.dd',
  'MM.dd.yyyy',
  'dd.MM.yyyy',
  'yyyy.MM.dd',
  'MM/DD/YYYY',
  'M/D/YYYY',
  'dd MMM YYYY',
  'dd MMMM YYYY',
  'MMMM dd, YYYY',
  'EEE, MMMM dd, YYYY',
];
export const ACCEPTED_CURRENCIES = Object.keys(currencies);

export const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

export const ACCEPTED_LOCALES = ['en', 'ar'];
