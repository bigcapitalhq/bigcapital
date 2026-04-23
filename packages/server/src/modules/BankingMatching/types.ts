import { Knex } from 'knex';

export interface IBankTransactionMatchingEventPayload {
  tenantId: number;
  uncategorizedTransactionIds: Array<number>;
  matchedTransactions: Array<IMatchTransactionDTO>;
  trx?: Knex.Transaction;
}

export interface IBankTransactionMatchedEventPayload {
  // tenantId: number;
  uncategorizedTransactionIds: Array<number>;
  matchedTransactions: Array<IMatchTransactionDTO>;
  trx?: Knex.Transaction;
}

export interface IBankTransactionUnmatchingEventPayload {
  // tenantId: number;
  uncategorizedTransactionId: number;
  trx?: Knex.Transaction;
}

export interface IBankTransactionUnmatchedEventPayload {
  // tenantId: number;
  uncategorizedTransactionId: number;
  trx?: Knex.Transaction;
}

export interface IMatchTransactionDTO {
  referenceType: string;
  referenceId: number;
  referenceSubId?: number;
}

export interface IMatchTransactionsDTO {
  uncategorizedTransactionIds: Array<number>;
  matchedTransactions: Array<IMatchTransactionDTO>;
}

export interface GetMatchedTransactionsFilter {
  fromDate: string;
  toDate: string;
  minAmount: number;
  maxAmount: number;
  transactionType: string;
  /**
   * The cashflow (bank/cc) account the uncategorized transaction lives on.
   * Used by type-specific queries to narrow candidates — e.g. expenses
   * return one row per payment split matching this account, instead of
   * one row per expense.
   */
  paymentAccountId?: number;
}

export interface MatchedTransactionPOJO {
  amount: number;
  amountFormatted: string;
  date: string;
  dateFormatted: string;
  referenceNo: string;
  transactionNo: string;
  transactionId: number;
  transactionType: string;
  referenceSubId?: number | null;
}

export type MatchedTransactionsPOJO = {
  perfectMatches: Array<MatchedTransactionPOJO>;
  possibleMatches: Array<MatchedTransactionPOJO>;
  totalPending: number;
};

export const ERRORS = {
  RESOURCE_TYPE_MATCHING_TRANSACTION_INVALID:
    'RESOURCE_TYPE_MATCHING_TRANSACTION_INVALID',
  RESOURCE_ID_MATCHING_TRANSACTION_INVALID:
    'RESOURCE_ID_MATCHING_TRANSACTION_INVALID',
  TOTAL_MATCHING_TRANSACTIONS_INVALID: 'TOTAL_MATCHING_TRANSACTIONS_INVALID',
  TRANSACTION_ALREADY_MATCHED: 'TRANSACTION_ALREADY_MATCHED',
  CANNOT_MATCH_EXCLUDED_TRANSACTION: 'CANNOT_MATCH_EXCLUDED_TRANSACTION',
  CANNOT_DELETE_TRANSACTION_MATCHED: 'CANNOT_DELETE_TRANSACTION_MATCHED',
};
