import {
  ISaleInvoiceDeletedPayload,
  ISaleInvoiceEditedPayload,
} from '@/modules/SaleInvoices/SaleInvoice.types';
import { OnEvent } from '@nestjs/event-emitter';
import { WriteTaxTransactionsItemEntries } from '../WriteTaxTransactionsItemEntries';
import { events } from '@/common/events/events';
import { ISaleInvoiceCreatedPayload } from '@/modules/SaleInvoices/SaleInvoice.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WriteInvoiceTaxTransactionsSubscriber {
  constructor(
    private readonly writeTaxTransactions: WriteTaxTransactionsItemEntries,
  ) {}

  /**
   * Writes the invoice tax transactions on invoice created.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  @OnEvent(events.saleInvoice.onCreated)
  async writeInvoiceTaxTransactionsOnCreated({
    saleInvoice,
    trx,
  }: ISaleInvoiceCreatedPayload) {
    await this.writeTaxTransactions.writeTaxTransactionsFromItemEntries(
      saleInvoice.entries,
      trx,
    );
  }

  /**
   * Rewrites the invoice tax transactions on invoice edited.
   * @param {ISaleInvoiceEditedPayload} payload -
   */
  @OnEvent(events.saleInvoice.onEdited)
  async rewriteInvoiceTaxTransactionsOnEdited({
    saleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) {
    await this.writeTaxTransactions.rewriteTaxRateTransactionsFromItemEntries(
      saleInvoice.entries,
      'SaleInvoice',
      saleInvoice.id,
      trx,
    );
  }

  /**
   * Removes the invoice tax transactions on invoice deleted.
   * @param {ISaleInvoiceEditingPayload}
   */
  @OnEvent(events.saleInvoice.onDelete)
  async removeInvoiceTaxTransactionsOnDeleted({
    oldSaleInvoice,
    trx,
  }: ISaleInvoiceDeletedPayload) {
    await this.writeTaxTransactions.removeTaxTransactionsFromItemEntries(
      oldSaleInvoice.id,
      'SaleInvoice',
      trx,
    );
  }
}
