import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';

@Service()
export class ProjectBillableTask {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Increase the invoiced hours of the given task.
   * @param {number} tenantId
   * @param {number} taskId
   * @param {number} invoiceHours
   */
  public increaseInvoicedTask = async (
    tenantId: number,
    taskId: number,
    invoiceHours: number,
    trx?: Knex.Transaction
  ) => {
    const { Task } = this.tenancy.models(tenantId);

    await Task.query(trx)
      .findById(taskId)
      .increment('invoicedHours', invoiceHours);
  };

  /**
   * Decrease the invoiced hours of the given task.
   * @param {number} tenantId
   * @param {number} taskId
   * @param {number} invoiceHours -
   * @returns {}
   */
  public decreaseInvoicedTask = async (
    tenantId: number,
    taskId: number,
    invoiceHours: number,
    trx?: Knex.Transaction
  ) => {
    const { Task } = this.tenancy.models(tenantId);

    await Task.query(trx)
      .findById(taskId)
      .decrement('invoicedHours', invoiceHours);
  };
}
