import TenantRepository from "./TenantRepository";
import { ExpenseCategory } from 'models';

export default class ExpenseEntyRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return ExpenseCategory.bindKnex(this.knex);
  }
}