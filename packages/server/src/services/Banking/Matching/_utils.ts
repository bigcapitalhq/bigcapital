import moment from 'moment';
import * as R from 'ramda';
import UncategorizedCashflowTransaction from '@/models/UncategorizedCashflowTransaction';
import { ERRORS, MatchedTransactionPOJO } from './types';
import { isEmpty } from 'lodash';
import { ServiceError } from '@/exceptions';

export const sortClosestMatchTransactions = (
  uncategorizedTransaction: UncategorizedCashflowTransaction,
  matches: MatchedTransactionPOJO[]
) => {
  return R.sortWith([
    // Sort by amount difference (closest to uncategorized transaction amount first)
    R.ascend((match: MatchedTransactionPOJO) =>
      Math.abs(match.amount - uncategorizedTransaction.amount)
    ),
    // Sort by date difference (closest to uncategorized transaction date first)
    R.ascend((match: MatchedTransactionPOJO) =>
      Math.abs(
        moment(match.date).diff(moment(uncategorizedTransaction.date), 'days')
      )
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

export const validateUncategorizedTransactionsNotMatched = (
  uncategorizedTransactions: any
) => {
  const isMatchedTransactions = uncategorizedTransactions.filter(
    (trans) => !isEmpty(trans.matchedBankTransactions)
  );
  //
  if (isMatchedTransactions.length > 0) {
    throw new ServiceError(ERRORS.TRANSACTION_ALREADY_MATCHED);
  }
};

export const validateUncategorizedTransactionsExcluded = (
  uncategorizedTransactions: any
) => {
  const excludedTransactions = uncategorizedTransactions.filter(
    (trans) => trans.excluded
  );
  if (excludedTransactions.length > 0) {
    throw new ServiceError(ERRORS.CANNOT_MATCH_EXCLUDED_TRANSACTION);
  }
};
