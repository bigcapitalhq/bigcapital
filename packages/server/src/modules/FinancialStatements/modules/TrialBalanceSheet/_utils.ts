import * as moment from 'moment';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import {
  ITrialBalanceAccount,
  TrialBalanceSortOrder,
} from './TrialBalanceSheet.types';
import { TrialBalanceColumnKey } from '../../common/constants/tableColumnKeys';

type TrialBalanceSortValue = string | number;

const sortValueAccessors: Record<
  TrialBalanceColumnKey,
  (account: ITrialBalanceAccount) => TrialBalanceSortValue
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

  if (!accessor) {
    return accounts;
  }
  const direction = sortOrder === 'desc' ? -1 : 1;

  return [...accounts].sort((a, b) => {
    const valueA = accessor(a);
    const valueB = accessor(b);
    const comparison =
      typeof valueA === 'string' && typeof valueB === 'string'
        ? valueA.localeCompare(valueB, undefined, {
            numeric: true,
            sensitivity: 'base',
          })
        : (valueA as number) - (valueB as number);

    return comparison !== 0 ? comparison * direction : 0;
  });
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
