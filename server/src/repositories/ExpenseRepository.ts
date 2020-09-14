import TenantRepository from "./TenantRepository";
import { IExpense } from 'interfaces';

export default class ExpenseRepository extends TenantRepository {
  models: any;
  repositories: any;
  cache: any;

  constructor(tenantId: number) {
    super(tenantId);

    this.models = this.tenancy.models(tenantId);
    this.cache = this.tenancy.cache(tenantId);
  }

  getById(expenseId: number) {
    const { Expense } = this.models;
    return this.cache.get(`expense.id.${expenseId}`, () => {
      return Expense.query().findById(expenseId);
    })
  }

  create(expense: IExpense) {
    const { Expense } = this.models;
    return Expense.query().insert({ ...expense });
  }

  update(expenseId: number, expense: IExpense) {
    const { Expense } = this.models;
    return Expense.query().patchAndFetchById(expenseId, { ...expense });
  }

  publish(expenseId: number) {

  }

  delete(expenseId: number) {
    const { Expense } = this.models;
    return Expense.query().findById(expenseId).delete();
  }

  bulkDelete(expensesIds: number[]) {
    const { Expense } = this.models;
    return Expense.query().whereIn('id', expensesIds).delete();
  }
}