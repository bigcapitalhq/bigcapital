import { Inject, Service } from 'typedi';
import { SyncItemTaxRateOnEditTaxRate } from './SyncItemTaxRateOnEditTaxRate';
import events from '@/subscribers/events';
import { ITaxRateEditedPayload } from '@/interfaces';
import { runAfterTransaction } from '../UnitOfWork/TransactionsHooks';

@Service()
export class SyncItemTaxRateOnEditTaxSubscriber {
  @Inject()
  private syncItemRateOnEdit: SyncItemTaxRateOnEditTaxRate;

  /**
   * Attaches events with handles.
   */
  public attach(bus) {
    bus.subscribe(
      events.taxRates.onEdited,
      this.handleSyncNewTaxRateToItemTaxRate
    );
  }

  /**
   * Syncs the new tax rate created to default item tax rates.
   * @param {ITaxRateEditedPayload} payload -
   */
  private handleSyncNewTaxRateToItemTaxRate = async ({
    taxRate,
    tenantId,
    oldTaxRate,
    trx,
  }: ITaxRateEditedPayload) => {
    runAfterTransaction(trx, async () => {
      await this.syncItemRateOnEdit.updateItemPurchaseTaxRate(
        tenantId,
        oldTaxRate.id,
        taxRate.id
      );
      await this.syncItemRateOnEdit.updateItemSellTaxRate(
        tenantId,
        oldTaxRate.id,
        taxRate.id
      );
    });
  };
}
