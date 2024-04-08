import { ExpenseCategory } from '../models';
import TenantRepository from './TenantRepository';

export default class ExpenseEntryRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return ExpenseCategory.bindKnex(this.knex);
  }
}
