import TenantRepository from "./TenantRepository";
import { ExpenseCategory } from 'models';

export default class ExpenseEntryRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return ExpenseCategory.bindKnex(this.knex);
  }
}