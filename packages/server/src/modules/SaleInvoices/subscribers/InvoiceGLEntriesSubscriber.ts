import { Injectable } from '@nestjs/common';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletePayload,
  ISaleInvoiceEditedPayload,
} from '../SaleInvoice.types';
import { OnEvent } from '@nestjs/event-emitter';
import { SaleInvoiceGLEntries } from '../ledger/InvoiceGLEntries';
import { events } from '@/common/events/events';

@Injectable()
export class InvoiceGLEntriesSubscriber {
  constructor(public readonly saleInvoiceGLEntries: SaleInvoiceGLEntries) { }

  /**
   * Records journal entries of the non-inventory invoice.
   * @param {ISaleInvoiceCreatedPayload} payload -
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleInvoice.onCreated)
  @OnEvent(events.saleInvoice.onDelivered)
  public async handleWriteJournalEntriesOnInvoiceCreated({
    saleInvoiceId,
    saleInvoice,
    trx,
  }: ISaleInvoiceCreatedPayload) {
    // Can't continue if the sale invoice is not delivered yet.
    if (!saleInvoice.deliveredAt) return null;

    await this.saleInvoiceGLEntries.writeInvoiceGLEntries(saleInvoiceId, trx);
  }

  /**
   * Records journal entries of the non-inventory invoice.
   * @param {ISaleInvoiceEditedPayload} payload -
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleInvoice.onEdited)
  public async handleRewriteJournalEntriesOnceInvoiceEdit({
    saleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) {
    // Can't continue if the sale invoice is not delivered yet.
    if (!saleInvoice.deliveredAt) return null;

    await this.saleInvoiceGLEntries.rewritesInvoiceGLEntries(
      saleInvoice.id,
      trx,
    );
  }

  /**
   * Handle reverting journal entries once sale invoice delete.
   * @param {ISaleInvoiceDeletePayload} payload -
   * @returns {Promise<void>}
   */
  @OnEvent(events.saleInvoice.onDeleted)
  public async handleRevertingInvoiceJournalEntriesOnDelete({
    saleInvoiceId,
    trx,
  }: ISaleInvoiceDeletePayload) {
    await this.saleInvoiceGLEntries.revertInvoiceGLEntries(saleInvoiceId, trx);
  }
}
