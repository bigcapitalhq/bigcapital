import TenantRepository from '@/repositories/TenantRepository';
import { InventoryTransaction } from 'models';

export default class InventoryTransactionRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return InventoryTransaction.bindKnex(this.knex);
  }
}