import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletePayload,
  ISaleInvoiceEditedPayload,
} from '@/interfaces';
import { SaleInvoiceGLEntries } from '@/services/Sales/Invoices/InvoiceGLEntries';

@Service()
export default class SaleInvoiceWriteGLEntriesSubscriber {
  @Inject()
  private saleInvoiceGLEntries: SaleInvoiceGLEntries;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.handleWriteJournalEntriesOnInvoiceCreated
    );
    bus.subscribe(
      events.saleInvoice.onDelivered,
      this.handleWriteJournalEntriesOnInvoiceCreated
    );
    bus.subscribe(
      events.saleInvoice.onEdited,
      this.handleRewriteJournalEntriesOnceInvoiceEdit
    );
    bus.subscribe(
      events.saleInvoice.onDeleted,
      this.handleRevertingInvoiceJournalEntriesOnDelete
    );
  }

  /**
   * Records journal entries of the non-inventory invoice.
   * @param {ISaleInvoiceCreatedPayload} payload -
   * @returns {Promise<void>}
   */
  private handleWriteJournalEntriesOnInvoiceCreated = async ({
    tenantId,
    saleInvoiceId,
    saleInvoice,
    trx,
  }: ISaleInvoiceCreatedPayload) => {
    // Can't continue if the sale invoice is not delivered yet.
    if (!saleInvoice.deliveredAt) return null;

    await this.saleInvoiceGLEntries.writeInvoiceGLEntries(
      tenantId,
      saleInvoiceId,
      trx
    );
  };

  /**
   * Records journal entries of the non-inventory invoice.
   * @param {ISaleInvoiceEditedPayload} payload -
   * @returns {Promise<void>}
   */
  private handleRewriteJournalEntriesOnceInvoiceEdit = async ({
    tenantId,
    saleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) => {
    // Can't continue if the sale invoice is not delivered yet.
    if (!saleInvoice.deliveredAt) return null;

    await this.saleInvoiceGLEntries.rewritesInvoiceGLEntries(
      tenantId,
      saleInvoice.id,
      trx
    );
  };

  /**
   * Handle reverting journal entries once sale invoice delete.
   * @param {ISaleInvoiceDeletePayload} payload -
   * @returns {Promise<void>}
   */
  private handleRevertingInvoiceJournalEntriesOnDelete = async ({
    tenantId,
    saleInvoiceId,
    trx,
  }: ISaleInvoiceDeletePayload) => {
    await this.saleInvoiceGLEntries.revertInvoiceGLEntries(
      tenantId,
      saleInvoiceId,
      trx
    );
  };
}
