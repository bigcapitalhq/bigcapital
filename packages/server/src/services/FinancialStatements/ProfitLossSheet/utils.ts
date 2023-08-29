import moment from 'moment';
import { merge } from 'lodash';
import { IProfitLossSheetQuery } from '@/interfaces';

/**
 * Default sheet filter query.
 * @return {IBalanceSheetQuery}
 */
export const getDefaultPLQuery = (): IProfitLossSheetQuery => ({
  fromDate: moment().startOf('year').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),

  numberFormat: {
    divideOn1000: false,
    negativeFormat: 'mines',
    showZero: false,
    formatMoney: 'total',
    precision: 2,
  },
  basis: 'accrual',

  noneZero: false,
  noneTransactions: false,

  displayColumnsType: 'total',
  displayColumnsBy: 'month',

  accountsIds: [],

  percentageColumn: false,
  percentageRow: false,

  percentageIncome: false,
  percentageExpense: false,

  previousPeriod: false,
  previousPeriodAmountChange: false,
  previousPeriodPercentageChange: false,

  previousYear: false,
  previousYearAmountChange: false,
  previousYearPercentageChange: false,
});

/**
 *
 * @param query
 * @returns
 */
export const mergeQueryWithDefaults = (
  query: IProfitLossSheetQuery
): IProfitLossSheetQuery => {
  return merge(getDefaultPLQuery(), query);
};
