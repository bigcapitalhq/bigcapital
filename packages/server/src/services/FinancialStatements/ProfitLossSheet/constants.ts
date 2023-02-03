import { ProfitLossNodeType } from '@/interfaces';

export const MAP_CONFIG = { childrenPath: 'children', pathFormat: 'array' };

export const DISPLAY_COLUMNS_BY = {
  DATE_PERIODS: 'date_periods',
  TOTAL: 'total',
};

export enum IROW_TYPE {
  AGGREGATE = 'AGGREGATE',
  ACCOUNTS = 'ACCOUNTS',
  ACCOUNT = 'ACCOUNT',
  TOTAL = 'TOTAL',
}

export const TOTAL_NODE_TYPES = [
  ProfitLossNodeType.ACCOUNTS,
  ProfitLossNodeType.AGGREGATE,
  ProfitLossNodeType.EQUATION
];