import { Inject, Service } from 'typedi';
import {
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletedPayload,
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
      events.saleInvoice.onDeleted,
      this.removeInvoiceTaxTransactionsOnDeleted
    );
    return bus;
  }

  /**
   * Validate receipt entries tax rate code existance.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  private writeInvoiceTaxTransactionsOnCreated = async ({
    tenantId,
    saleInvoice,
  }: ISaleInvoiceCreatedPayload) => {
    await this.writeTaxTransactions.writeTaxTransactionsFromItemEntries(
      tenantId,
      saleInvoice.entries
    );
  };

  /**
   * Removes the invoice tax transactions on invoice deleted.
   * @param {ISaleInvoiceEditingPayload}
   */
  private removeInvoiceTaxTransactionsOnDeleted = async ({
    tenantId,
    oldSaleInvoice,
  }: ISaleInvoiceDeletedPayload) => {
    await this.writeTaxTransactions.removeTaxTransactionsFromItemEntries(
      tenantId,
      oldSaleInvoice.entries
    );
  };
}
