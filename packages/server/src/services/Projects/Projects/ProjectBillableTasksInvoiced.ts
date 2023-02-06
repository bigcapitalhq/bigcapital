import async from 'async';
import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { ISaleInvoice, ISaleInvoiceDTO, ProjectLinkRefType } from '@/interfaces';
import { ProjectBillableTask } from './ProjectBillableTasks';
import { filterEntriesByRefType } from './_utils';
import { IncreaseInvoicedTaskQueuePayload } from './_types';

@Service()
export class ProjectBillableTasksInvoiced {
  @Inject()
  private projectBillableTasks: ProjectBillableTask;

  /**
   * Increases the invoiced amount of the given tasks that associated
   * to the invoice entries.
   * @param {number} tenantId
   * @param {ISaleInvoiceDTO} saleInvoiceDTO
   */
  public increaseInvoicedTasks = async (
    tenantId: number,
    saleInvoiceDTO: ISaleInvoiceDTO | ISaleInvoice,
    trx?: Knex.Transaction
  ) => {
    // Initiate a new queue for accounts balance mutation.
    const saveAccountsBalanceQueue = async.queue(
      this.increaseInvoicedTaskQueue,
      10
    );
    const filteredEntries = filterEntriesByRefType(
      saleInvoiceDTO.entries,
      ProjectLinkRefType.Task
    );
    filteredEntries.forEach((entry) => {
      saveAccountsBalanceQueue.push({
        tenantId,
        projectRefId: entry.projectRefId,
        projectRefInvoicedAmount: entry.projectRefInvoicedAmount,
        trx,
      });
    });
    if (filteredEntries.length > 0) {
      await saveAccountsBalanceQueue.drain();
    }
  };

  /**
   * Decreases the invoiced amount of the given tasks that associated
   * to the invoice entries.
   * @param {number} tenantId
   * @param {ISaleInvoiceDTO | ISaleInvoice} saleInvoiceDTO
   * @param {Knex.Transaction} trx
   */
  public decreaseInvoicedTasks = async (
    tenantId: number,
    saleInvoiceDTO: ISaleInvoiceDTO | ISaleInvoice,
    trx?: Knex.Transaction
  ) => {
    // Initiate a new queue for accounts balance mutation.
    const saveAccountsBalanceQueue = async.queue(
      this.decreaseInvoicedTaskQueue,
      10
    );
    const filteredEntries = filterEntriesByRefType(
      saleInvoiceDTO.entries,
      ProjectLinkRefType.Task
    );
    filteredEntries.forEach((entry) => {
      saveAccountsBalanceQueue.push({
        tenantId,
        projectRefId: entry.projectRefId,
        projectRefInvoicedAmount: entry.projectRefInvoicedAmount,
        trx,
      });
    });
    if (filteredEntries.length > 0) {
      await saveAccountsBalanceQueue.drain();
    }
  };

  /**
   * Queue job increases the invoiced amount of the given task.
   * @param {IncreaseInvoicedTaskQueuePayload} - payload
   */
  private increaseInvoicedTaskQueue = async ({
    tenantId,
    projectRefId,
    projectRefInvoicedAmount,
    trx,
  }: IncreaseInvoicedTaskQueuePayload) => {
    await this.projectBillableTasks.increaseInvoicedTask(
      tenantId,
      projectRefId,
      projectRefInvoicedAmount,
      trx
    );
  };

  /**
   * Queue jobs decreases the invoiced amount of the given task.
   * @param {IncreaseInvoicedTaskQueuePayload} - payload
   */
  private decreaseInvoicedTaskQueue = async ({
    tenantId,
    projectRefId,
    projectRefInvoicedAmount,
    trx,
  }) => {
    await this.projectBillableTasks.decreaseInvoicedTask(
      tenantId,
      projectRefId,
      projectRefInvoicedAmount,
      trx
    );
  };
}
