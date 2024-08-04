import moment from 'moment';
import * as R from 'ramda';
import UncategorizedCashflowTransaction from '@/models/UncategorizedCashflowTransaction';
import { ERRORS, MatchedTransactionPOJO } from './types';
import { isEmpty, sumBy } from 'lodash';
import { ServiceError } from '@/exceptions';

export const sortClosestMatchTransactions = (
  amount: number,
  date: Date,
  matches: MatchedTransactionPOJO[]
) => {
  return R.sortWith([
    // Sort by amount difference (closest to uncategorized transaction amount first)
    R.ascend((match: MatchedTransactionPOJO) =>
      Math.abs(match.amount - amount)
    ),
    // Sort by date difference (closest to uncategorized transaction date first)
    R.ascend((match: MatchedTransactionPOJO) =>
      Math.abs(moment(match.date).diff(moment(date), 'days'))
    ),
  ])(matches);
};

export const sumMatchTranasctions = (transactions: Array<any>) => {
  return transactions.reduce(
    (total, item) =>
      total +
      (item.transactionNormal === 'debit' ? 1 : -1) * parseFloat(item.amount),
    0
  );
};

export const sumUncategorizedTransactions = (
  uncategorizedTransactions: Array<any>
) => {
  return sumBy(uncategorizedTransactions, 'amount');
};

export const validateUncategorizedTransactionsNotMatched = (
  uncategorizedTransactions: any
) => {
  const matchedTransactions = uncategorizedTransactions.filter(
    (trans) => !isEmpty(trans.matchedBankTransactions)
  );
  //
  if (matchedTransactions.length > 0) {
    throw new ServiceError(ERRORS.TRANSACTION_ALREADY_MATCHED, '', {
      matchedTransactionsIds: matchedTransactions?.map((m) => m.id),
    });
  }
};

export const validateUncategorizedTransactionsExcluded = (
  uncategorizedTransactions: any
) => {
  const excludedTransactions = uncategorizedTransactions.filter(
    (trans) => trans.excluded
  );
  if (excludedTransactions.length > 0) {
    throw new ServiceError(ERRORS.CANNOT_MATCH_EXCLUDED_TRANSACTION, '', {
      excludedTransactionsIds: excludedTransactions.map((e) => e.id),
    });
  }
};
