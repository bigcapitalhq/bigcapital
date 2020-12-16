import TenantRepository from "./TenantRepository";
import moment from "moment";
import { Expense } from 'models';

export default class ExpenseRepository extends TenantRepository {
  /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = Expense;
  }

  /**
   * Publish the given expense.
   * @param {number} expenseId 
   */
  async publish(expenseId: number): Promise<void> {
    super.update({
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