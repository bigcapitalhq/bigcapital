import moment from 'moment';
import * as R from 'ramda';
import UncategorizedCashflowTransaction from '@/models/UncategorizedCashflowTransaction';
import { MatchedTransactionPOJO } from './types';

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
