import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletedPayload,
  ISaleInvoiceEditedPayload,
} from '@/interfaces';
import { ProjectInvoiceValidator } from './ProjectInvoiceValidator';
import { ProjectBillableTasksInvoiced } from './ProjectBillableTasksInvoiced';

@Service()
export class ProjectBillableTasksSubscriber {
  @Inject()
  private projectBillableTasks: ProjectBillableTasksInvoiced;

  @Inject()
  private projectBillableTasksValidator: ProjectInvoiceValidator;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreating,
      this.handleValidateInvoiceTasksRefs
    );
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.handleIncreaseBillableTasks
    );
    bus.subscribe(events.saleInvoice.onEdited, this.handleEditBillableTasks);
    bus.subscribe(
      events.saleInvoice.onDeleted,
      this.handleDecreaseBillableTasks
    );
  }

  /**
   * Validate the tasks refs ids existence.
   * @param {ISaleInvoiceCreatedPayload} payload -
   */
  public handleValidateInvoiceTasksRefs = async ({
    tenantId,
    saleInvoiceDTO,
  }: ISaleInvoiceCreatedPayload) => {
    await this.projectBillableTasksValidator.validateTasksRefsExistence(
      tenantId,
      saleInvoiceDTO
    );
  };

  /**
   * Handle increase the invoiced tasks once the sale invoice be created.
   * @param {ISaleInvoiceCreatedPayload} payload -
   */
  public handleIncreaseBillableTasks = async ({
    tenantId,
    saleInvoiceDTO,
  }: ISaleInvoiceCreatedPayload) => {
    await this.projectBillableTasks.increaseInvoicedTasks(
      tenantId,
      saleInvoiceDTO
    );
  };

  /**
   * Handle decrease the invoiced tasks once the sale invoice be deleted.
   * @param {ISaleInvoiceDeletedPayload} payload -
   */
  public handleDecreaseBillableTasks = async ({
    tenantId,
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceDeletedPayload) => {
    await this.projectBillableTasks.decreaseInvoicedTasks(
      tenantId,
      oldSaleInvoice,
      trx
    );
  };

  /**
   * Handle adjusting the invoiced tasks once the sale invoice be edited.
   * @param {ISaleInvoiceEditedPayload} payload -
   */
  public handleEditBillableTasks = async ({
    tenantId,
    oldSaleInvoice,
    saleInvoiceDTO,
    trx,
  }: ISaleInvoiceEditedPayload) => {
    await this.projectBillableTasks.increaseInvoicedTasks(
      tenantId,
      saleInvoiceDTO,
      trx
    );
    await this.projectBillableTasks.decreaseInvoicedTasks(
      tenantId,
      oldSaleInvoice,
      trx
    );
  };
}
