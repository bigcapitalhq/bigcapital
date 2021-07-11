import { Inject } from 'typedi';
import { raw } from 'objection';
import moment from 'moment';
import {
  IItem,
  IInventoryDetailsQuery,
  IInventoryTransaction,
} from 'interfaces';
import HasTenancyService from 'services/Tenancy/TenancyService';

export default class InventoryDetailsRepository {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieve inventory items.
   * @param {number} tenantId -
   * @returns {Promise<IItem>}
   */
  public getInventoryItems(tenantId: number): Promise<IItem[]> {
    const { Item } = this.tenancy.models(tenantId);

    return Item.query().where('type', 'inventory');
  }

  /**
   * Retrieve the items opening balance transactions.
   * @param {number} tenantId -
   * @param {IInventoryDetailsQuery}
   * @return {Promise<IInventoryTransaction>}
   */
  public async openingBalanceTransactions(
    tenantId: number,
    filter: IInventoryDetailsQuery
  ): Promise<IInventoryTransaction[]> {
    const { InventoryTransaction } = this.tenancy.models(tenantId);

    const openingBalanceDate = moment(filter.fromDate)
      .subtract(1, 'days')
      .toDate();

    // Opening inventory transactions.
    const openingTransactions = InventoryTransaction.query()
      .select('*')
      .select(raw("IF(`DIRECTION` = 'IN', `QUANTITY`, 0) as 'QUANTITY_IN'"))
      .select(raw("IF(`DIRECTION` = 'OUT', `QUANTITY`, 0) as 'QUANTITY_OUT'"))
      .select(
        raw("IF(`DIRECTION` = 'IN', `QUANTITY` * `RATE`, 0) as 'VALUE_IN'")
      )
      .select(
        raw("IF(`DIRECTION` = 'OUT', `QUANTITY` * `RATE`, 0) as 'VALUE_OUT'")
      )
      .modify('filterDateRange', null, openingBalanceDate)
      .orderBy('date', 'ASC')
      .as('inventory_transactions');

    const openingBalanceTransactions = await InventoryTransaction.query()
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
   * @param {number} tenantId -
   * @param {IInventoryDetailsQuery}
   * @return {Promise<IInventoryTransaction>}
   */
  public async itemInventoryTransactions(
    tenantId: number,
    filter: IInventoryDetailsQuery
  ): Promise<IInventoryTransaction[]> {
    const { InventoryTransaction } = this.tenancy.models(tenantId);

    const inventoryTransactions = InventoryTransaction.query()
      .modify('filterDateRange', filter.fromDate, filter.toDate)
      .orderBy('date', 'ASC')
      .withGraphFetched('meta')
      .withGraphFetched('costLotAggregated');

    return inventoryTransactions;
  }
}
