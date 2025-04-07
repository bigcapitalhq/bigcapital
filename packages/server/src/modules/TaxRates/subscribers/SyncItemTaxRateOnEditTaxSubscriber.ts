import { Injectable } from '@nestjs/common';
import { ITaxRateEditedPayload } from '../TaxRates.types';
import { runAfterTransaction } from '@/modules/Tenancy/TenancyDB/TransactionsHooks';
import { events } from '@/common/events/events';
import { SyncItemTaxRateOnEditTaxRate } from '../SyncItemTaxRateOnEditTaxRate';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SyncItemTaxRateOnEditTaxSubscriber {
  constructor(
    private readonly syncItemRateOnEdit: SyncItemTaxRateOnEditTaxRate,
  ) {}

  /**
   * Syncs the new tax rate created to default item tax rates.
   * @param {ITaxRateEditedPayload} payload -
   */
  @OnEvent(events.taxRates.onEdited)
  async handleSyncNewTaxRateToItemTaxRate({
    taxRate,
    oldTaxRate,
    trx,
  }: ITaxRateEditedPayload) {
    runAfterTransaction(trx, async () => {
      await this.syncItemRateOnEdit.updateItemPurchaseTaxRate(
        oldTaxRate.id,
        taxRate.id,
      );
      await this.syncItemRateOnEdit.updateItemSellTaxRate(
        oldTaxRate.id,
        taxRate.id,
      );
    });
  }
}
