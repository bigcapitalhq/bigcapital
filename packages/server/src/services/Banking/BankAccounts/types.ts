import { Knex } from 'knex';

export interface IBankAccountDisconnectingEventPayload {
  tenantId: number;
  bankAccountId: number;
  trx: Knex.Transaction;
}

export interface IBankAccountDisconnectedEventPayload {
  tenantId: number;
  bankAccountId: number;
  trx: Knex.Transaction;
}

export const ERRORS = {
  BANK_ACCOUNT_NOT_CONNECTED: 'BANK_ACCOUNT_NOT_CONNECTED',
};
