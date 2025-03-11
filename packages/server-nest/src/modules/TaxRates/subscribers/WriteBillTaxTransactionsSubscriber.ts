import {
  IBIllEventDeletedPayload,
  IBillCreatedPayload,
  IBillEditedPayload,
} from '@/modules/Bills/Bills.types';
import { WriteTaxTransactionsItemEntries } from '../WriteTaxTransactionsItemEntries';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class WriteBillTaxTransactionsSubscriber {
  constructor(
    @Inject()
    private readonly writeTaxTransactions: WriteTaxTransactionsItemEntries,
  ) {}

  /**
   * Writes the bill tax transactions on invoice created.
   * @param {ISaleInvoiceCreatingPaylaod}
   */
  @OnEvent(events.bill.onCreated)
  async writeInvoiceTaxTransactionsOnCreated({
    bill,
    trx,
  }: IBillCreatedPayload) {
    await this.writeTaxTransactions.writeTaxTransactionsFromItemEntries(
      bill.entries,
      trx,
    );
  }

  /**
   * Rewrites the bill tax transactions on invoice edited.
   * @param {IBillEditedPayload} payload -
   */
  @OnEvent(events.bill.onEdited)
  async rewriteInvoiceTaxTransactionsOnEdited({
    bill,
    trx,
  }: IBillEditedPayload) {
    await this.writeTaxTransactions.rewriteTaxRateTransactionsFromItemEntries(
      bill.entries,
      'Bill',
      bill.id,
      trx,
    );
  }

  /**
   * Removes the invoice tax transactions on invoice deleted.
   * @param {IBIllEventDeletedPayload}
   */
  @OnEvent(events.bill.onDeleted)
  async removeInvoiceTaxTransactionsOnDeleted({
    oldBill,
    trx,
  }: IBIllEventDeletedPayload) {
    await this.writeTaxTransactions.removeTaxTransactionsFromItemEntries(
      oldBill.id,
      'Bill',
      trx,
    );
  }
}
