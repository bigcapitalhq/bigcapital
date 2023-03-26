import async from 'async';
import { Knex } from 'knex';
import { Service } from 'typedi';
import { ISaleInvoice, ISaleInvoiceDTO, ProjectLinkRefType } from '@/interfaces';
import { ProjectBillableExpense } from './ProjectBillableExpense';
import { filterEntriesByRefType } from './_utils';

@Service()
export class ProjectBillableBill {
  @Inject()
  private projectBillableExpense: ProjectBillableExpense;

  /**
   * Increases the invoiced amount of the given bills that associated
   * to the invoice entries.
   * @param {number} tenantId
   * @param {ISaleInvoice | ISaleInvoiceDTO} saleInvoiceDTO
   * @param {Knex.Transaction} trx
   */
  public increaseInvoicedBill = async (
    tenantId: number,
    saleInvoiceDTO: ISaleInvoice | ISaleInvoiceDTO,
    trx?: Knex.Transaction
  ) => {
    // Initiates a new queue for accounts balance mutation.
    const saveAccountsBalanceQueue = async.queue(
      this.increaseInvoicedExpenseQueue,
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
   * Decreases the invoiced amount of the given bills that associated
   * to the invoice entries.
   * @param {number} tenantId
   * @param {ISaleInvoice | ISaleInvoiceDTO} saleInvoiceDTO
   * @param {Knex.Transaction} trx
   */
  public decreaseInvoicedBill = async (
    tenantId: number,
    saleInvoiceDTO: ISaleInvoice | ISaleInvoiceDTO,
    trx?: Knex.Transaction
  ) => {
    // Initiates a new queue for accounts balance mutation.
    const saveAccountsBalanceQueue = async.queue(
      this.decreaseInvoicedExpenseQueue,
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
   * Queue job increases the invoiced amount of the given bill.
   * @param {IncreaseInvoicedTaskQueuePayload} - payload
   */
  private increaseInvoicedExpenseQueue = async ({
    tenantId,
    projectRefId,
    projectRefInvoicedAmount,
    trx,
  }) => {
    await this.projectBillableExpense.increaseInvoicedExpense(
      tenantId,
      projectRefId,
      projectRefInvoicedAmount,
      trx
    );
  };

  /**
   * Queue job decreases the invoiced amount of the given bill.
   * @param {IncreaseInvoicedTaskQueuePayload} - payload
   */
  private decreaseInvoicedExpenseQueue = async ({
    tenantId,
    projectRefId,
    projectRefInvoicedAmount,
    trx,
  }) => {
    await this.projectBillableExpense.decreaseInvoicedExpense(
      tenantId,
      projectRefId,
      projectRefInvoicedAmount,
      trx
    );
  };
}
