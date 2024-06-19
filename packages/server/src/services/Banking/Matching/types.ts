import { Knex } from 'knex';

export interface IBankTransactionMatchingEventPayload {
  tenantId: number;
  uncategorizedTransactionId: number;
  matchTransactionsDTO: IMatchTransactionDTO;
  trx?: Knex.Transaction;
}

export interface IBankTransactionMatchedEventPayload {
  tenantId: number;
  uncategorizedTransactionId: number;
  matchTransactionsDTO: IMatchTransactionDTO;
  trx?: Knex.Transaction;
}

export interface IBankTransactionUnmatchingEventPayload {
  tenantId: number;
}

export interface IBankTransactionUnmatchedEventPayload {
  tenantId: number;
}

export interface IMatchTransactionDTO {
  matchedTransactions: Array<{
    referenceType: string;
    referenceId: number;
    amount: number;
  }>;
}

export interface GetMatchedTransactionsFilter {
  fromDate: string;
  toDate: string;
  minAmount: number;
  maxAmount: number;
  transactionType: string;
}
