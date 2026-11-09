import * as moment from 'moment';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import {
  ITrialBalanceAccount,
  TrialBalanceSortOrder,
} from './TrialBalanceSheet.types';
import {
  FinancialReportSortValue,
  sortFinancialReportNodes,
} from '../../utils/Sorting.utils';
import { TrialBalanceColumnKey } from '../../common/constants/tableColumnKeys';

type TrialBalanceSortValueAccessor = (
  account: ITrialBalanceAccount,
) => FinancialReportSortValue;

const sortValueAccessors: Record<
  TrialBalanceColumnKey,
  TrialBalanceSortValueAccessor
> = {
  account: (account) => account.formattedName,
  debit: (account) => account.debit,
  credit: (account) => account.credit,
  total: (account) => account.balance,
};

/**
 * Sorts trial balance accounts by the given column and order.
 * @param {ITrialBalanceAccount[]} accounts
 * @param {TrialBalanceColumnKey} columnSortBy
 * @param {TrialBalanceSortOrder} sortOrder
 * @returns {ITrialBalanceAccount[]}
 */
export const sortTrialBalanceAccounts = (
  accounts: ITrialBalanceAccount[],
  columnSortBy?: TrialBalanceColumnKey,
  sortOrder: TrialBalanceSortOrder = 'asc',
): ITrialBalanceAccount[] => {
  const accessor = columnSortBy ? sortValueAccessors[columnSortBy] : undefined;

  return sortFinancialReportNodes(accounts, accessor, sortOrder);
};

export const getTrialBalanceSheetDefaultQuery = () => ({
  fromDate: moment().startOf('year').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  numberFormat: {
    divideOn1000: false,
    negativeFormat: 'mines',
    showZero: false,
    formatMoney: 'total',
    precision: 2,
  },
  basis: AccountingBasis.Accrual,
  noneZero: false,
  noneTransactions: true,
  onlyActive: false,
  accountIds: [],
});
