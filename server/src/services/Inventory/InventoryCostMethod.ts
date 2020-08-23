import { omit } from 'lodash';
import { IInventoryLotCost } from '@/interfaces';
import { InventoryLotCostTracker } from '@/models';

export default class InventoryCostMethod {
  /**
   * Stores the inventory lots costs transactions in bulk.
   * @param {IInventoryLotCost[]} costLotsTransactions 
   * @return {Promise[]}
   */
  public storeInventoryLotsCost(costLotsTransactions: IInventoryLotCost[]): Promise<object> {
    const opers: any = [];

    costLotsTransactions.forEach((transaction: IInventoryLotCost) => {
      if (transaction.lotTransId && transaction.decrement) {
        const decrementOper = InventoryLotCostTracker.tenant()
          .query()
          .where('id', transaction.lotTransId)
          .decrement('remaining', transaction.decrement);
        opers.push(decrementOper);
      } else if(!transaction.lotTransId) {
        const operation = InventoryLotCostTracker.tenant().query()
        .insert({
          ...omit(transaction, ['decrement', 'invTransId', 'lotTransId']),
        });
        opers.push(operation);
      }
    });
    return Promise.all(opers);
  }
}