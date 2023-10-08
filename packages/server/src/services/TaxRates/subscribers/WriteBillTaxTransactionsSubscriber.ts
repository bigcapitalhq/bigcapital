import { Inject, Service } from 'typedi';
import {
  IBIllEventDeletedPayload,
  IBillCreatedPayload,
  IBillEditedPayload,
  ISaleInvoiceCreatedPayload,
  ISaleInvoiceDeletedPayload,
  ISaleInvoiceEditedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import { WriteTaxTransactionsItemEntries } from '../WriteTaxTransactionsItemEntries';

@Service()
export class WriteBillTaxTransactionsSubscriber {
  @Inject()
  private writeTaxTransactions: WriteTaxTransactionsItemEntries;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.bill.onCreated,
      this.writeInvoiceTaxTransactionsOnCreated
    );
    bus.subscribe(
      events.bill.onEdited,
      this.rewriteInvoiceTaxTransactionsOnEdited
    );
    bus.subscribe(
      events.bill.onDeleted,
      this.removeInvoiceTaxTransactionsOnDeleted
    );
    return bus;
  }

  /**
   * Writes the bill tax transactions on invoice created.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  private writeInvoiceTaxTransactionsOnCreated = async ({
    tenantId,
    bill,
    trx,
  }: IBillCreatedPayload) => {
    await this.writeTaxTransactions.writeTaxTransactionsFromItemEntries(
      tenantId,
      bill.entries,
      trx
    );
  };

  /**
   * Rewrites the bill tax transactions on invoice edited.
   * @param {IBillEditedPayload} payload -
   */
  private rewriteInvoiceTaxTransactionsOnEdited = async ({
    tenantId,
    bill,
    trx,
  }: IBillEditedPayload) => {
    await this.writeTaxTransactions.rewriteTaxRateTransactionsFromItemEntries(
      tenantId,
      bill.entries,
      'Bill',
      bill.id,
      trx
    );
  };

  /**
   * Removes the invoice tax transactions on invoice deleted.
   * @param {IBIllEventDeletedPayload}
   */
  private removeInvoiceTaxTransactionsOnDeleted = async ({
    tenantId,
    oldBill,
    trx,
  }: IBIllEventDeletedPayload) => {
    await this.writeTaxTransactions.removeTaxTransactionsFromItemEntries(
      tenantId,
      oldBill.id,
      'Bill',
      trx
    );
  };
}
