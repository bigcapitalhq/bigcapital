import TenantRepository from "./TenantRepository";
import { IExpense } from 'interfaces';
import moment from "moment";

export default class ExpenseRepository extends TenantRepository {
  models: any;
  repositories: any;
  cache: any;

  /**
   * Constructor method.
   * @param {number} tenantId 
   */
  constructor(tenantId: number) {
    super(tenantId);

    this.models = this.tenancy.models(tenantId);
    this.cache = this.tenancy.cache(tenantId);
  }

  /**
   * Retrieve the given expense by id.
   * @param  {number} expenseId 
   * @return {Promise<IExpense>}
   */
  getById(expenseId: number) {
    const { Expense } = this.models;
    return this.cache.get(`expense.id.${expenseId}`, () => {
      return Expense.query().findById(expenseId).withGraphFetched('categories');
    });
  }

  /**
   * Inserts a new expense object.
   * @param {IExpense} expense - 
   */
  async create(expenseInput: IExpense): Promise<void> {
    const { Expense } = this.models;
    const expense = await Expense.query().insert({ ...expenseInput });
    this.flushCache();

    return expense;
  }

  /**
   * Updates the given expense details.
   * @param {number} expenseId 
   * @param {IExpense} expense 
   */
  async update(expenseId: number, expense: IExpense) {
    const { Expense } = this.models;

    await Expense.query().findById(expenseId).patch({ ...expense });
    this.flushCache();
  }

  /**
   * Publish the given expense.
   * @param {number} expenseId 
   */
  async publish(expenseId: number): Promise<void> {
    const { Expense } = this.models;

    await Expense.query().findById(expenseId).patch({
      publishedAt: moment().toMySqlDateTime(),
    });
    this.flushCache();
  }

  /**
   * Deletes the given expense.
   * @param {number} expenseId 
   */
  async delete(expenseId: number): Promise<void> {
    const { Expense } = this.models;
    
    await Expense.query().where('id', expenseId).delete();
    await Expense.query().where('expense_id', expenseId).delete();

    this.flushCache();
  }

  /**
   * Deletes expenses in bulk.
   * @param {number[]} expensesIds 
   */
  async bulkDelete(expensesIds: number[]): Promise<void> {
    const { Expense } = this.models;

    await Expense.query().whereIn('expense_id', expensesIds).delete();
    await Expense.query().whereIn('id', expensesIds).delete();

    this.flushCache();
  }

  /**
   * Publishes the given expenses in bulk.
   * @param  {number[]} expensesIds 
   * @return {Promise<void>}
   */
  async bulkPublish(expensesIds: number): Promise<void> {
    const { Expense } = this.models;
    await Expense.query().whereIn('id', expensesIds).patch({
      publishedAt: moment().toMySqlDateTime(),
    });
    this.flushCache();
  }

  /**
   * Flushes repository cache.
   */
  flushCache() {
    this.cache.delStartWith(`expense`);
  }
}