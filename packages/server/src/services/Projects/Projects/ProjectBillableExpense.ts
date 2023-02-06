import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';

@Service()
export class ProjectBillableExpense {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Increase the invoiced amount of the given expense.
   * @param {number} tenantId
   * @param {number} expenseId
   * @param {number} invoicedAmount
   * @param {Knex.Transaction} trx
   */
  public increaseInvoicedExpense = async (
    tenantId: number,
    expenseId: number,
    invoicedAmount: number,
    trx?: Knex.Transaction
  ) => {
    const { Expense } = this.tenancy.models(tenantId);

    await Expense.query(trx)
      .findById(expenseId)
      .increment('invoicedAmount', invoicedAmount);
  };

  /**
   * Decrease the invoiced amount of the given expense.
   * @param {number} tenantId
   * @param {number} taskId
   * @param {number} invoiceHours
   * @param {Knex.Transaction} knex
   */
  public decreaseInvoicedExpense = async (
    tenantId: number,
    expenseId: number,
    invoiceHours: number,
    trx?: Knex.Transaction
  ) => {
    const { Expense } = this.tenancy.models(tenantId);

    await Expense.query(trx)
      .findById(expenseId)
      .decrement('invoicedAmount', invoiceHours);
  };
}
