import { Knex } from 'knex';


export interface CreateStripeAccountDTO {
  name?: string;
}
export interface StripeOAuthCodeGrantedEventPayload {
  tenantId: number;
  paymentIntegrationId: number;
  trx?: Knex.Transaction
}