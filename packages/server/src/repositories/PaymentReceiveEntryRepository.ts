import TenantRepository from '@/repositories/TenantRepository';
import { PaymentReceiveEntry } from '../models';

export default class PaymentReceiveEntryRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return PaymentReceiveEntry.bindKnex(this.knex);
  }
}
