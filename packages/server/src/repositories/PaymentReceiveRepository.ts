import { PaymentReceive } from 'models';
import TenantRepository from '@/repositories/TenantRepository';

export default class PaymentReceiveRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return PaymentReceive.bindKnex(this.knex);
  }
}
