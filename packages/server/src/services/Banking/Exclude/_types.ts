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
  tenantId: number;
  uncategorizedTransactionId: number;
  trx?: Knex.Transaction
}

export interface IBankTransactionUnexcludedEventPayload {
  tenantId: number;
  uncategorizedTransactionId: number;
  trx?: Knex.Transaction
}

export interface IBankTransactionExcludingEventPayload {
  tenantId: number;
  uncategorizedTransactionId: number;
  trx?: Knex.Transaction
}
export interface IBankTransactionExcludedEventPayload {
  tenantId: number;
  uncategorizedTransactionId: number;
  trx?: Knex.Transaction
}
