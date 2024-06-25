import { Knex } from 'knex';

export interface IBankTransactionMatchingEventPayload {
  tenantId: number;
  uncategorizedTransactionId: number;
  matchTransactionsDTO: IMatchTransactionsDTO;
  trx?: Knex.Transaction;
}

export interface IBankTransactionMatchedEventPayload {
  tenantId: number;
  uncategorizedTransactionId: number;
  matchTransactionsDTO: IMatchTransactionsDTO;
  trx?: Knex.Transaction;
}

export interface IBankTransactionUnmatchingEventPayload {
  tenantId: number;
}

export interface IBankTransactionUnmatchedEventPayload {
  tenantId: number;
}

export interface IMatchTransactionDTO {
  referenceType: string;
  referenceId: number;
}

export interface IMatchTransactionsDTO {
  matchedTransactions: Array<IMatchTransactionDTO>;
}

export interface GetMatchedTransactionsFilter {
  fromDate: string;
  toDate: string;
  minAmount: number;
  maxAmount: number;
  transactionType: string;
}

export interface MatchedTransactionPOJO {
  amount: number;
  amountFormatted: string;
  date: string;
  dateFormatted: string;
  referenceNo: string;
  transactionNo: string;
  transactionId: number;
}

export type MatchedTransactionsPOJO = Array<MatchedTransactionPOJO[]>;

export const ERRORS = {
  RESOURCE_TYPE_MATCHING_TRANSACTION_INVALID:
    'RESOURCE_TYPE_MATCHING_TRANSACTION_INVALID',
  RESOURCE_ID_MATCHING_TRANSACTION_INVALID:
    'RESOURCE_ID_MATCHING_TRANSACTION_INVALID',
  TOTAL_MATCHING_TRANSACTIONS_INVALID: 'TOTAL_MATCHING_TRANSACTIONS_INVALID',
  TRANSACTION_ALREADY_MATCHED: 'TRANSACTION_ALREADY_MATCHED',
  CANNOT_MATCH_EXCLUDED_TRANSACTION: 'CANNOT_MATCH_EXCLUDED_TRANSACTION',
  CANNOT_DELETE_TRANSACTION_MATCHED: 'CANNOT_DELETE_TRANSACTION_MATCHED'
};