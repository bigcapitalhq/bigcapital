export const ASSETS_TABLE_NAME = 'assets';
export const ASSET_DEPRECIATION_ENTRIES_TABLE_NAME = 'asset_depreciation_entries';

export const DepreciationMethods = {
  STRAIGHT_LINE: 'straight_line',
  DECLINING_BALANCE: 'declining_balance',
  SUM_OF_YEARS_DIGITS: 'sum_of_years_digits',
  UNITS_OF_PRODUCTION: 'units_of_production',
} as const;

export const DepreciationFrequencies = {
  DAILY: 'daily',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export const AssetStatuses = {
  ACTIVE: 'active',
  FULLY_DEPRECIATED: 'fully_depreciated',
  DISPOSED: 'disposed',
  SOLD: 'sold',
} as const;

export const AssetDefaultViews = [];
