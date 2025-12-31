import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { WriteTaxTransactionsItemEntries } from '../WriteTaxTransactionsItemEntries';
import { events } from '@/common/events/events';

@Injectable()
export class WriteEstimateTaxTransactionsSubscriber {
  constructor(
    private readonly writeTaxTransactions: WriteTaxTransactionsItemEntries,
  ) {}

  /**
   * Writes the estimate tax transactions on estimate created.
   */
  @OnEvent(events.saleEstimate.onCreated)
  async writeEstimateTaxTransactionsOnCreated({ saleEstimate, trx }: any) {
    await this.writeTaxTransactions.writeTaxTransactionsFromItemEntries(
      saleEstimate.entries,
      trx,
    );
  }

  /**
   * Rewrites the estimate tax transactions on estimate edited.
   */
  @OnEvent(events.saleEstimate.onEdited)
  async rewriteEstimateTaxTransactionsOnEdited({ saleEstimate, trx }: any) {
    await this.writeTaxTransactions.rewriteTaxRateTransactionsFromItemEntries(
      saleEstimate.entries,
      'SaleEstimate',
      saleEstimate.id,
      trx,
    );
  }

  /**
   * Removes the estimate tax transactions on estimate deleted.
   */
  @OnEvent(events.saleEstimate.onDeleted)
  async removeEstimateTaxTransactionsOnDeleted({ oldSaleEstimate, trx }: any) {
    await this.writeTaxTransactions.removeTaxTransactionsFromItemEntries(
      oldSaleEstimate.id,
      'SaleEstimate',
      trx,
    );
  }
}
