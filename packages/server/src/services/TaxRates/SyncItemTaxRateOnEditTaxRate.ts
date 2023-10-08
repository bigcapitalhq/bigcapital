import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import { Knex } from 'knex';

@Service()
export class SyncItemTaxRateOnEditTaxRate {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Syncs the new tax rate created to item default sell tax rate.
   * @param {number} tenantId
   * @param {number} itemId
   * @param {number} sellTaxRateId
   */
  public updateItemSellTaxRate = async (
    tenantId: number,
    oldSellTaxRateId: number,
    sellTaxRateId: number,
    trx?: Knex.Transaction
  ) => {
    const { Item } = this.tenancy.models(tenantId);

    await Item.query().where('sellTaxRateId', oldSellTaxRateId).update({
      sellTaxRateId,
    });
  };

  /**
   * Syncs the new tax rate created to item default purchase tax rate.
   * @param {number} tenantId
   * @param {number} itemId
   * @param {number} purchaseTaxRateId
   */
  public updateItemPurchaseTaxRate = async (
    tenantId: number,
    oldPurchaseTaxRateId: number,
    purchaseTaxRateId: number,
    trx?: Knex.Transaction
  ) => {
    const { Item } = this.tenancy.models(tenantId);

    if (oldPurchaseTaxRateId === purchaseTaxRateId) return;

    await Item.query(trx)
      .where('purchaseTaxRateId', oldPurchaseTaxRateId)
      .update({
        purchaseTaxRateId,
      });
  };
}
