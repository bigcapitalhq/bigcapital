import { ModelObject, raw } from 'objection';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { IInventoryDetailsQuery } from './InventoryItemDetails.types';
import { Item } from '@/modules/Items/models/Item';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class InventoryItemDetailsRepository {
  /**
   * Constructor method.
   * @param {typeof Item} itemModel - Item model.
   * @param {typeof InventoryTransaction} inventoryTransactionModel - Inventory transaction model.
   */
  constructor(
    private readonly itemModel: typeof Item,
    private readonly inventoryTransactionModel: typeof InventoryTransaction,
  ) {}

  /**
   * Retrieve inventory items.
   * @returns {Promise<ModelObject<Item>>}
   */
  public async getInventoryItems(
    itemsIds?: number[],
  ): Promise<ModelObject<Item>[]> {
    return this.itemModel.query().onBuild((q) => {
      q.where('type', 'inventory');

      if (!isEmpty(itemsIds)) {
        q.whereIn('id', itemsIds);
      }
    });
  }

  /**
   * Retrieve the items opening balance transactions.
   * @param {IInventoryDetailsQuery}
   * @return {Promise<ModelObject<InventoryTransaction>>}
   */
  public async openingBalanceTransactions(
    filter: IInventoryDetailsQuery,
  ): Promise<ModelObject<InventoryTransaction>[]> {
    const openingBalanceDate = moment(filter.fromDate)
      .subtract(1, 'days')
      .toDate();

    // Opening inventory transactions.
    const openingTransactions = this.inventoryTransactionModel
      .query()
      .select('*')
      .select(raw("IF(`DIRECTION` = 'IN', `QUANTITY`, 0) as 'QUANTITY_IN'"))
      .select(raw("IF(`DIRECTION` = 'OUT', `QUANTITY`, 0) as 'QUANTITY_OUT'"))
      .select(
        raw(
          "IF(`DIRECTION` = 'IN', IF(`QUANTITY` IS NULL, `RATE`, `QUANTITY` * `RATE`), 0) as 'VALUE_IN'",
        ),
      )
      .select(
        raw(
          "IF(`DIRECTION` = 'OUT', IF(`QUANTITY` IS NULL, `RATE`, `QUANTITY` * `RATE`), 0) as 'VALUE_OUT'",
        ),
      )
      .modify('filterDateRange', null, openingBalanceDate)
      .orderBy('date', 'ASC')
      .as('inventory_transactions');

    if (!isEmpty(filter.warehousesIds)) {
      openingTransactions.modify('filterByWarehouses', filter.warehousesIds);
    }
    if (!isEmpty(filter.branchesIds)) {
      openingTransactions.modify('filterByBranches', filter.branchesIds);
    }

    const openingBalanceTransactions = await this.inventoryTransactionModel
      .query()
      .from(openingTransactions)
      .select('itemId')
      .select(raw('SUM(`QUANTITY_IN` - `QUANTITY_OUT`) AS `QUANTITY`'))
      .select(raw('SUM(`VALUE_IN` - `VALUE_OUT`) AS `VALUE`'))
      .groupBy('itemId')
      .sum('rate as rate')
      .sum('quantityIn as quantityIn')
      .sum('quantityOut as quantityOut')
      .sum('valueIn as valueIn')
      .sum('valueOut as valueOut')
      .withGraphFetched('itemCostAggregated');

    return openingBalanceTransactions;
  }

  /**
   * Retrieve the items inventory tranasactions.
   * @param {IInventoryDetailsQuery}
   * @return {Promise<IInventoryTransaction>}
   */
  public async itemInventoryTransactions(
    filter: IInventoryDetailsQuery,
  ): Promise<ModelObject<InventoryTransaction>[]> {
    const inventoryTransactions = this.inventoryTransactionModel
      .query()
      .modify('filterDateRange', filter.fromDate, filter.toDate)
      .orderBy('date', 'ASC')
      .withGraphFetched('meta')
      .withGraphFetched('costLotAggregated');

    if (!isEmpty(filter.branchesIds)) {
      inventoryTransactions.modify('filterByBranches', filter.branchesIds);
    }
    if (!isEmpty(filter.warehousesIds)) {
      inventoryTransactions.modify('filterByWarehouses', filter.warehousesIds);
    }
    return inventoryTransactions;
  }
}
