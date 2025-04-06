import { Knex } from 'knex';

export interface IBankAccountDisconnectingEventPayload {
  bankAccountId: number;
  trx: Knex.Transaction;
}

export interface IBankAccountDisconnectedEventPayload {
  bankAccountId: number;
  trx: Knex.Transaction;
}

export const ERRORS = {
  BANK_ACCOUNT_NOT_CONNECTED: 'BANK_ACCOUNT_NOT_CONNECTED',
  BANK_ACCOUNT_FEEDS_ALREADY_PAUSED: 'BANK_ACCOUNT_FEEDS_ALREADY_PAUSED',
  BANK_ACCOUNT_FEEDS_ALREADY_RESUMED: 'BANK_ACCOUNT_FEEDS_ALREADY_RESUMED',
};
