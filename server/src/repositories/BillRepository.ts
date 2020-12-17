import { Bill } from 'models';
import TenantRepository from 'repositories/TenantRepository';

export default class BillRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return Bill.bindKnex(this.knex);
  }
}