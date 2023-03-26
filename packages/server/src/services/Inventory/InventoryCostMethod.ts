import { omit } from 'lodash';
import { Container } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';
import { IInventoryLotCost } from '@/interfaces';

export default class InventoryCostMethod {
  tenancy: TenancyService;
  tenantModels: any;

  /**
   * Constructor method.
   * @param {number} tenantId - The given tenant id.
   */
  constructor(tenantId: number, startingDate: Date, itemId: number) {
    const tenancyService = Container.get(TenancyService);

    this.tenantModels = tenancyService.models(tenantId);
  }

  /**
   * Stores the inventory lots costs transactions in bulk.
   * @param  {IInventoryLotCost[]} costLotsTransactions
   * @return {Promise[]}
   */
  public storeInventoryLotsCost(
    costLotsTransactions: IInventoryLotCost[]
  ): Promise<object> {
    const { InventoryCostLotTracker } = this.tenantModels;
    const opers: any = [];

    costLotsTransactions.forEach((transaction: any) => {
      if (transaction.lotTransId && transaction.decrement) {
        const decrementOper = InventoryCostLotTracker.query(this.trx)
          .where('id', transaction.lotTransId)
          .decrement('remaining', transaction.decrement);
        opers.push(decrementOper);
      } else if (!transaction.lotTransId) {
        const operation = InventoryCostLotTracker.query(this.trx).insert({
          ...omit(transaction, ['decrement', 'invTransId', 'lotTransId']),
        });
        opers.push(operation);
      }
    });
    return Promise.all(opers);
  }
}
