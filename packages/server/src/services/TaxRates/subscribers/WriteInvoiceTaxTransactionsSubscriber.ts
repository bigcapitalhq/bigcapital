import { Inject, Service } from 'typedi';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletedPayload,
  ISaleInvoiceEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { WriteTaxTransactionsItemEntries } from '../WriteTaxTransactionsItemEntries';

@Service()
export class WriteInvoiceTaxTransactionsSubscriber {
  @Inject()
  private writeTaxTransactions: WriteTaxTransactionsItemEntries;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.saleInvoice.onCreated,
      this.writeInvoiceTaxTransactionsOnCreated
    );
    bus.subscribe(
      events.saleInvoice.onEdited,
      this.rewriteInvoiceTaxTransactionsOnEdited
    );
    bus.subscribe(
      events.saleInvoice.onDelete,
      this.removeInvoiceTaxTransactionsOnDeleted
    );
    return bus;
  }

  /**
   * Writes the invoice tax transactions on invoice created.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  private writeInvoiceTaxTransactionsOnCreated = async ({
    tenantId,
    saleInvoice,
    trx
  }: ISaleInvoiceCreatedPayload) => {
    await this.writeTaxTransactions.writeTaxTransactionsFromItemEntries(
      tenantId,
      saleInvoice.entries,
      trx
    );
  };

  /**
   * Rewrites the invoice tax transactions on invoice edited.
   * @param {ISaleInvoiceEditedPayload} payload -
   */
  private rewriteInvoiceTaxTransactionsOnEdited = async ({
    tenantId,
    saleInvoice,
    trx,
  }: ISaleInvoiceEditedPayload) => {
    await this.writeTaxTransactions.rewriteTaxRateTransactionsFromItemEntries(
      tenantId,
      saleInvoice.entries,
      'SaleInvoice',
      saleInvoice.id,
      trx
    );
  };

  /**
   * Removes the invoice tax transactions on invoice deleted.
   * @param {ISaleInvoiceEditingPayload}
   */
  private removeInvoiceTaxTransactionsOnDeleted = async ({
    tenantId,
    oldSaleInvoice,
    trx
  }: ISaleInvoiceDeletedPayload) => {
    await this.writeTaxTransactions.removeTaxTransactionsFromItemEntries(
      tenantId,
      oldSaleInvoice.id,
      'SaleInvoice',
      trx
    );
  };
}
