import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletedPayload,
  ISaleInvoiceEditedPayload,
} from '@/interfaces';
import { ProjectBillableTask } from './ProjectBillableTasks';
import { ProjectBillableExpense } from './ProjectBillableExpense';
import { ProjectBillableExpenseInvoiced } from './ProjectBillableExpenseInvoiced';

@Service()
export class ProjectBillableBillSubscriber {
  @Inject()
  private projectBillableExpenseInvoiced: ProjectBillableExpenseInvoiced;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.handleIncreaseBillableBill
    );
    bus.subscribe(events.saleInvoice.onEdited, this.handleEditBillableBill);
    bus.subscribe(
      events.saleInvoice.onDeleted,
      this.handleDecreaseBillableBill
    );
  }

  /**
   * Increases the billable amount of expense.
   * @param {ISaleInvoiceCreatedPayload} payload -
   */
  public handleIncreaseBillableBill = async ({
    tenantId,
    saleInvoice,
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
  public handleDecreaseBillableBill = async ({
    tenantId,
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceDeletedPayload) => {
    await this.projectBillableExpenseInvoiced.decreaseInvoicedExpense(
      tenantId,
      oldSaleInvoice,
      trx
    );
  };

  /**
   *
   * @param {ISaleInvoiceEditedPayload} payload -
   */
  public handleEditBillableBill = async ({
    tenantId,
    oldSaleInvoice,
    saleInvoiceDTO,
    trx,
  }: ISaleInvoiceEditedPayload) => {
    await this.projectBillableExpenseInvoiced.decreaseInvoicedExpense(
      tenantId,
      oldSaleInvoice,
      trx
    );
    await this.projectBillableExpenseInvoiced.increaseInvoicedExpense(
      tenantId,
      saleInvoiceDTO,
      trx
    );
  };
}
