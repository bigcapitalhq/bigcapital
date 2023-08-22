import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletedPayload,
  ISaleInvoiceEditedPayload,
  ISaleInvoiceEventDeliveredPayload,
} from '@/interfaces';
import { InvoiceInventoryTransactions } from '@/services/Sales/Invoices/InvoiceInventoryTransactions';

@Service()
export default class WriteInventoryTransactions {
  @Inject()
  private saleInvoiceInventory: InvoiceInventoryTransactions;

  /**
   * Attaches events with handles
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.handleWritingInventoryTransactions
    );
    bus.subscribe(
      events.saleInvoice.onDelivered,
      this.handleWritingInventoryTransactions
    );
    bus.subscribe(
      events.saleInvoice.onEdited,
      this.handleRewritingInventoryTransactions
    );
    bus.subscribe(
      events.saleInvoice.onDeleted,
      this.handleDeletingInventoryTransactions
    );
  }

  /**
   * Handles the writing inventory transactions once the invoice created.
   * @param {ISaleInvoiceCreatedPayload} payload
   */
  private handleWritingInventoryTransactions = async ({
    tenantId,
    saleInvoice,
    trx,
  }: ISaleInvoiceCreatedPayload | ISaleInvoiceEventDeliveredPayload) => {
    // Can't continue if the sale invoice is not delivered yet.
    if (!saleInvoice.deliveredAt) return null;

    await this.saleInvoiceInventory.recordInventoryTranscactions(
      tenantId,
      saleInvoice,
      false,
      trx
    );
  };

  /**
   * Rewriting the inventory transactions once the sale invoice be edited.
   * @param {ISaleInvoiceEditPayload} payload -
   */
  private handleRewritingInventoryTransactions = async ({
    tenantId,
    saleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) => {
    await this.saleInvoiceInventory.recordInventoryTranscactions(
      tenantId,
      saleInvoice,
      true,
      trx
    );
  };

  /**
   * Handles deleting the inventory transactions once the invoice deleted.
   * @param {ISaleInvoiceDeletedPayload} payload -
   */
  private handleDeletingInventoryTransactions = async ({
    tenantId,
    saleInvoiceId,
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceDeletedPayload) => {
    await this.saleInvoiceInventory.revertInventoryTransactions(
      tenantId,
      saleInvoiceId,
      trx
    );
  };
}
