import TenantRepository from "./TenantRepository";
import moment from "moment";
import { Expense } from 'models';

export default class ExpenseRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return Expense.bindKnex(this.knex);
  }

  /**
   * Publish the given expense.
   * @param {number} expenseId 
   */
  publish(expenseId: number): Promise<void> {
    return super.update({
      id: expenseId,
      publishedAt: moment().toMySqlDateTime(),
    });
  }

  /**
   * Publishes the given expenses in bulk.
   * @param  {number[]} expensesIds 
   * @return {Promise<void>}
   */
  async whereIdInPublish(expensesIds: number): Promise<void> {
    await this.model.query().whereIn('id', expensesIds).patch({
      publishedAt: moment().toMySqlDateTime(),
    });
    this.flushCache();
  }
}