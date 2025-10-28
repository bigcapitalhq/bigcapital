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

export const ERRORS = {
  TENANT_DATABASE_UPGRADED: 'TENANT_DATABASE_UPGRADED',
  TENANT_NOT_FOUND: 'tenant_not_found',
  TENANT_ALREADY_BUILT: 'TENANT_ALREADY_BUILT',
  TENANT_ALREADY_SEEDED: 'tenant_already_seeded',
  TENANT_DB_NOT_BUILT: 'tenant_db_not_built',
  TENANT_IS_BUILDING: 'TENANT_IS_BUILDING',
  BASE_CURRENCY_MUTATE_LOCKED: 'BASE_CURRENCY_MUTATE_LOCKED',
  TENANT_UPGRADE_IS_RUNNING: 'TENANT_UPGRADE_IS_RUNNING'
};
