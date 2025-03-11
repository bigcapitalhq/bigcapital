import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { Item } from '../Items/models/Item';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class SyncItemTaxRateOnEditTaxRate {
  constructor(
    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
  ) {}

  /**
   * Syncs the new tax rate created to item default sell tax rate.
   * @param {number} itemId - Item id.
   * @param {number} sellTaxRateId - Sell tax rate id.
   */
  public updateItemSellTaxRate = async (
    oldSellTaxRateId: number,
    sellTaxRateId: number,
    trx?: Knex.Transaction,
  ) => {
    // Can't continue if the old and new sell tax rate id are equal.
    if (oldSellTaxRateId === sellTaxRateId) return;

    await this.itemModel()
      .query()
      .where('sellTaxRateId', oldSellTaxRateId)
      .update({
        sellTaxRateId,
      });
  };

  /**
   * Syncs the new tax rate created to item default purchase tax rate.
   * @param {number} itemId
   * @param {number} purchaseTaxRateId
   */
  public updateItemPurchaseTaxRate = async (
    oldPurchaseTaxRateId: number,
    purchaseTaxRateId: number,
    trx?: Knex.Transaction,
  ) => {
    // Can't continue if the old and new sell tax rate id are equal.
    if (oldPurchaseTaxRateId === purchaseTaxRateId) return;

    await this.itemModel()
      .query(trx)
      .where('purchaseTaxRateId', oldPurchaseTaxRateId)
      .update({
        purchaseTaxRateId,
      });
  };
}
