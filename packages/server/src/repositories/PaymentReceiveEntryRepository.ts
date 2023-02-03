import { PaymentReceiveEntry } from 'models';
import TenantRepository from '@/repositories/TenantRepository';

export default class PaymentReceiveEntryRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return PaymentReceiveEntry.bindKnex(this.knex);
  }
}