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
  attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
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
   */
  private handleWriteJournalEntriesOnInvoiceCreated = async ({
    tenantId,
    saleInvoiceId,
    trx,
  }: ISaleInvoiceCreatedPayload) => {
    await this.saleInvoiceGLEntries.writeInvoiceGLEntries(
      tenantId,
      saleInvoiceId,
      trx
    );
  };

  /**
   * Records journal entries of the non-inventory invoice.
   */
  private handleRewriteJournalEntriesOnceInvoiceEdit = async ({
    tenantId,
    saleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) => {
    await this.saleInvoiceGLEntries.rewritesInvoiceGLEntries(
      tenantId,
      saleInvoice.id,
      trx
    );
  };

  /**
   * Handle reverting journal entries once sale invoice delete.
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
