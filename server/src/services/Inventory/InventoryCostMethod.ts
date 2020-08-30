import { omit } from 'lodash';
import { Inject } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';
import { IInventoryLotCost } from '@/interfaces';

export default class InventoryCostMethod {
  @Inject()
  tenancy: TenancyService;
  tenantModels: any;

  /**
   * Constructor method.
   * @param {number} tenantId - The given tenant id.
   */
  constructor(tenantId: number, startingDate: Date, itemId: number) {
    this.tenantModels = this.tenantModels.models(tenantId);
  }

  /**
   * Stores the inventory lots costs transactions in bulk.
   * @param {IInventoryLotCost[]} costLotsTransactions 
   * @return {Promise[]}
   */
  public storeInventoryLotsCost(costLotsTransactions: IInventoryLotCost[]): Promise<object> {
    const { InventoryLotCostTracker } = this.tenantModels;
    const opers: any = [];

    costLotsTransactions.forEach((transaction: IInventoryLotCost) => {
      if (transaction.lotTransId && transaction.decrement) {
        const decrementOper = InventoryLotCostTracker.query()
          .where('id', transaction.lotTransId)
          .decrement('remaining', transaction.decrement);
        opers.push(decrementOper);

      } else if(!transaction.lotTransId) {
        const operation = InventoryLotCostTracker.query()
          .insert({
            ...omit(transaction, ['decrement', 'invTransId', 'lotTransId']),
          });
        opers.push(operation);
      }
    });
    return Promise.all(opers);
  }
}