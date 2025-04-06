import { Knex } from "knex";

export interface ExcludedBankTransactionsQuery {
  page?: number;
  pageSize?: number;
  accountId?: number;
  minDate?: Date;
  maxDate?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface IBankTransactionUnexcludingEventPayload {
  uncategorizedTransactionId: number;
  trx?: Knex.Transaction
}

export interface IBankTransactionUnexcludedEventPayload {
  uncategorizedTransactionId: number;
  trx?: Knex.Transaction
}

export interface IBankTransactionExcludingEventPayload {
  uncategorizedTransactionId: number;
  trx?: Knex.Transaction
}
export interface IBankTransactionExcludedEventPayload {
  uncategorizedTransactionId: number;
  trx?: Knex.Transaction
}
