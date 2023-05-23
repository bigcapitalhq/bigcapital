import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletedPayload,
  ISaleInvoiceEditedPayload,
} from '@/interfaces';
import { ProjectBillableExpenseInvoiced } from './ProjectBillableExpenseInvoiced';

@Service()
export class ProjectBillableExpensesSubscriber {
  @Inject()
  private projectBillableExpenseInvoiced: ProjectBillableExpenseInvoiced;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.handleIncreaseBillableExpenses
    );
    bus.subscribe(events.saleInvoice.onEdited, this.handleEditBillableExpenses);
    bus.subscribe(
      events.saleInvoice.onDeleted,
      this.handleDecreaseBillableExpenses
    );
  }

  /**
   * Increases the billable amount of expense.
   * @param {ISaleInvoiceCreatedPayload} payload -
   */
  public handleIncreaseBillableExpenses = async ({
    tenantId,
    saleInvoiceDTO,
    trx,
  }: ISaleInvoiceCreatedPayload) => {
    await this.projectBillableExpenseInvoiced.increaseInvoicedExpense(
      tenantId,
      saleInvoiceDTO,
      trx
    );
  };

  /**
   * Decreases the billable amount of expense.
   * @param {ISaleInvoiceDeletedPayload} payload -
   */
  public handleDecreaseBillableExpenses = async ({
    tenantId,
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceDeletedPayload) => {
    await this.projectBillableExpenseInvoiced.increaseInvoicedExpense(
      tenantId,
      oldSaleInvoice,
      trx
    );
  };

  /**
   * Decreases the old invoice and increases the new invoice DTO.
   * @param {ISaleInvoiceEditedPayload} payload -
   */
  public handleEditBillableExpenses = async ({
    tenantId,
    saleInvoice,
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) => {
    await this.projectBillableExpenseInvoiced.decreaseInvoicedExpense(
      tenantId,
      oldSaleInvoice,
      trx
    );
    await this.projectBillableExpenseInvoiced.increaseInvoicedExpense(
      tenantId,
      saleInvoice,
      trx
    );
  };
}
