import TenantRepository from '@/repositories/TenantRepository';
import { PaymentReceive } from '../models';

export default class PaymentReceiveRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return PaymentReceive.bindKnex(this.knex);
  }
}
