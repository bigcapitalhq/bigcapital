import { PaymentReceive } from 'models';
import TenantRepository from 'repositories/TenantRepository';

export default class PaymentReceiveRepository extends TenantRepository {
  /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = PaymentReceive;
  }
}
