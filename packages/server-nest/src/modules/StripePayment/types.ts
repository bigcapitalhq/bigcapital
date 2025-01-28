import { Knex } from 'knex';

export interface CreateStripeAccountDTO {
  name?: string;
}
export interface StripeOAuthCodeGrantedEventPayload {
  paymentIntegrationId: number;
  trx?: Knex.Transaction;
}
