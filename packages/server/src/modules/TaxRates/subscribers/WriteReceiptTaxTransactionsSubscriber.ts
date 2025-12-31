import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { WriteTaxTransactionsItemEntries } from '../WriteTaxTransactionsItemEntries';
import { events } from '@/common/events/events';

@Injectable()
export class WriteReceiptTaxTransactionsSubscriber {
  constructor(
    private readonly writeTaxTransactions: WriteTaxTransactionsItemEntries,
  ) {}

  /**
   * Writes the receipt tax transactions on receipt created.
   */
  @OnEvent(events.saleReceipt.onCreated)
  async writeReceiptTaxTransactionsOnCreated({ saleReceipt, trx }: any) {
    await this.writeTaxTransactions.writeTaxTransactionsFromItemEntries(
      saleReceipt.entries,
      trx,
    );
  }

  /**
   * Rewrites the receipt tax transactions on receipt edited.
   */
  @OnEvent(events.saleReceipt.onEdited)
  async rewriteReceiptTaxTransactionsOnEdited({ saleReceipt, trx }: any) {
    await this.writeTaxTransactions.rewriteTaxRateTransactionsFromItemEntries(
      saleReceipt.entries,
      'SaleReceipt',
      saleReceipt.id,
      trx,
    );
  }

  /**
   * Removes the receipt tax transactions on receipt deleted.
   */
  @OnEvent(events.saleReceipt.onDeleted)
  async removeReceiptTaxTransactionsOnDeleted({ oldSaleReceipt, trx }: any) {
    await this.writeTaxTransactions.removeTaxTransactionsFromItemEntries(
      oldSaleReceipt.id,
      'SaleReceipt',
      trx,
    );
  }
}
