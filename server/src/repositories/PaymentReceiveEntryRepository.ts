import { PaymentReceiveEntry } from 'models';
import TenantRepository from 'repositories/TenantRepository';

export default class PaymentReceiveEntryRepository extends TenantRepository {
 /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = PaymentReceiveEntry;
  }
}