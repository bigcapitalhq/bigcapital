import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import async from 'async';
import {
  ISaleInvoice,
  ISaleInvoiceDTO,
  ProjectLinkRefType,
} from '@/interfaces';
import { ProjectBillableExpense } from './ProjectBillableExpense';
import { filterEntriesByRefType } from './_utils';

@Service()
export class ProjectBillableExpenseInvoiced {
  @Inject()
  private projectBillableExpense: ProjectBillableExpense;

  /**
   * Increases the invoiced amount of invoice entries that reference to
   * expense entries.
   * @param {number} tenantId
   * @param {ISaleInvoice | ISaleInvoiceDTO} saleInvoiceDTO
   * @param {Knex.Transaction} trx
   */
  public increaseInvoicedExpense = async (
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
      ProjectLinkRefType.Expense
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
   * Decreases the invoiced amount of the given expenses from
   * the invoice entries.
   * @param {number} tenantId
   * @param {ISaleInvoice | ISaleInvoiceDTO} saleInvoiceDTO
   * @param {Knex.Transaction} trx
   */
  public decreaseInvoicedExpense = async (
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
      ProjectLinkRefType.Expense
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
   * Queue job increases the invoiced amount of the given expense.
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
   * Queue job decreases the invoiced amount of the given expense.
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
