import { keyBy, get } from 'lodash';
import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import * as R from 'ramda';
import { IInventoryItemCostMeta } from '@/interfaces';
import TenancyService from '@/services/Tenancy/TenancyService';
import ItemWarehouseQuantity from 'models/ItemWarehouseQuantity';
import { ModelUpdateOptions } from 'mongoose';

@Service()
export class InventoryItemCostService {
  @Inject()
  tenancy: TenancyService;

  /**
   * Common query of items inventory valuation.
   * @param {number[]} itemsIds - 
   * @param {Date} date - 
   * @param {Knex.QueryBuilder} builder - 
   */
  private itemsInventoryValuationCommonQuery = R.curry(
    (itemsIds: number[], date: Date, builder: Knex.QueryBuilder) => {
      if (date) {
        builder.where('date', '<', date);
      }
      builder.whereIn('item_id', itemsIds);
      builder.sum('rate as rate');
      builder.sum('quantity as quantity');
      builder.sum('cost as cost');

      builder.groupBy('item_id');
      builder.select(['item_id']);
    }
  );

  /**
   * 
   * @param {} INValuationMap -
   * @param {} OUTValuationMap - 
   * @param {number} itemId
   */
  private getItemInventoryMeta = R.curry(
    (
      INValuationMap,
      OUTValuationMap,
      itemId: number
    ): IInventoryItemCostMeta => {
      const INCost = get(INValuationMap, `[${itemId}].cost`, 0);
      const INQuantity = get(INValuationMap, `[${itemId}].quantity`, 0);

      const OUTCost = get(OUTValuationMap, `[${itemId}].cost`, 0);
      const OUTQuantity = get(OUTValuationMap, `[${itemId}].quantity`, 0);

      const valuation = INCost - OUTCost;
      const quantity = INQuantity - OUTQuantity;
      const average = quantity ? valuation / quantity : 0;

      return { itemId, valuation, quantity, average };
    }
  );

  /**
   *
   * @param {number} tenantId
   * @param {number} itemsId
   * @param {Date} date
   * @returns
   */
  private getItemsInventoryINAndOutAggregated = (
    tenantId: number,
    itemsId: number[],
    date: Date
  ): Promise<any> => {
    const { InventoryCostLotTracker } = this.tenancy.models(tenantId);

    const commonBuilder = this.itemsInventoryValuationCommonQuery(
      itemsId,
      date
    );
    const INValuationOper = InventoryCostLotTracker.query()
      .onBuild(commonBuilder)
      .where('direction', 'IN');

    const OUTValuationOper = InventoryCostLotTracker.query()
      .onBuild(commonBuilder)
      .where('direction', 'OUT');

    return Promise.all([OUTValuationOper, INValuationOper]);
  };

  /**
   * 
   * @param {number} tenantId - 
   * @param {number[]} itemsIds - 
   * @param {Date} date - 
   */
  private getItemsInventoryInOutMap = async (
    tenantId: number,
    itemsId: number[],
    date: Date
  ) => {
    const [OUTValuation, INValuation] =
      await this.getItemsInventoryINAndOutAggregated(tenantId, itemsId, date);

    const OUTValuationMap = keyBy(OUTValuation, 'itemId');
    const INValuationMap = keyBy(INValuation, 'itemId');

    return [OUTValuationMap, INValuationMap];
  };

  /**
   *
   * @param   {number} tenantId
   * @param   {number} itemId
   * @param   {Date} date
   * @returns {Promise<Map<number, IInventoryItemCostMeta>>}
   */
  public getItemsInventoryValuation = async (
    tenantId: number,
    itemsId: number[],
    date: Date
  ): Promise<Map<number, IInventoryItemCostMeta>> => {
    const { Item } = this.tenancy.models(tenantId);

    // Retrieves the inventory items.
    const items = await Item.query()
      .whereIn('id', itemsId)
      .where('type', 'inventory');

    // Retrieves the inventory items ids.
    const inventoryItemsIds: number[] = items.map((item) => item.id);

    // Retrieves the items inventory IN/OUT map.
    const [OUTValuationMap, INValuationMap] =
      await this.getItemsInventoryInOutMap(tenantId, itemsId, date);

    const getItemValuation = this.getItemInventoryMeta(
      INValuationMap,
      OUTValuationMap
    );
    const itemsValuations = inventoryItemsIds.map(getItemValuation);
    const itemsValuationsMap = new Map(
      itemsValuations.map((i) => [i.itemId, i])
    );
    return itemsValuationsMap;
  };
}
