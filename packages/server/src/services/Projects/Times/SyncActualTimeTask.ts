import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class SyncActualTimeTask {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Increases the actual time of the given task.
   * @param {number} tenantId
   * @param {number} taskId
   * @param {number} actualHours
   * @param {Knex.Transaction} trx
   */
  public increaseActualTimeTask = async (
    tenantId: number,
    taskId: number,
    actualHours: number,
    trx?: Knex.Transaction
  ) => {
    const { Task } = this.tenancy.models(tenantId);

    await Task.query(trx)
      .findById(taskId)
      .increment('actualHours', actualHours);
  };

  /**
   * Decreases the actual time of the given task.
   * @param {number} tenantId
   * @param {number} taskId
   * @param {number} actualHours
   * @param {Knex.Transaction} trx
   */
  public decreaseActualTimeTask = async (
    tenantId: number,
    taskId: number,
    actualHours: number,
    trx?: Knex.Transaction
  ) => {
    const { Task } = this.tenancy.models(tenantId);

    await Task.query(trx)
      .findById(taskId)
      .decrement('actualHours', actualHours);
  };
}
