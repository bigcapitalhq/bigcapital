import * as moment from 'moment';
import * as R from 'ramda';
import { isEmpty, round, sumBy } from 'lodash';
import { ERRORS, MatchedTransactionPOJO } from './types';
import { ServiceError } from '../Items/ServiceError';

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
  const total = transactions.reduce(
    (sum, item) => {
      const amount = parseFloat(item.amount) || 0;
      const multiplier = item.transactionNormal === 'debit' ? 1 : -1;
      return sum + multiplier * amount;
    },
    0
  );
  // Round to 2 decimal places to avoid floating-point precision issues
  return round(total, 2);
};

export const sumUncategorizedTransactions = (
  uncategorizedTransactions: Array<any>
) => {
  const total = sumBy(uncategorizedTransactions, 'amount');
  // Round to 2 decimal places to avoid floating-point precision issues
  return round(total, 2);
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
