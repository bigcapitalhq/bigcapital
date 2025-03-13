import { keyBy, get } from 'lodash';
import { IInventoryItemCostMeta } from '../types/InventoryCost.types';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { InventoryCostLotTracker } from '../models/InventoryCostLotTracker';
import { Item } from '../../Items/models/Item';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class InventoryItemCostService {
  constructor(
    @Inject(InventoryCostLotTracker.name)
    private readonly inventoryCostLotTrackerModel: TenantModelProxy<
      typeof InventoryCostLotTracker
    >,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
  ) {}

  /**
   *
   * @param {Map<number, IInventoryItemCostMeta>} INValuationMap -
   * @param {Map<number, IInventoryItemCostMeta>} OUTValuationMap -
   * @param {number} itemId
   */
  private getItemInventoryMeta(
    INValuationMap: Map<number, IInventoryItemCostMeta>,
    OUTValuationMap: Map<number, IInventoryItemCostMeta>,
    itemId: number,
  ) {
    const INCost = get(INValuationMap, `[${itemId}].cost`, 0);
    const INQuantity = get(INValuationMap, `[${itemId}].quantity`, 0);

    const OUTCost = get(OUTValuationMap, `[${itemId}].cost`, 0);
    const OUTQuantity = get(OUTValuationMap, `[${itemId}].quantity`, 0);

    const valuation = INCost - OUTCost;
    const quantity = INQuantity - OUTQuantity;
    const average = quantity ? valuation / quantity : 0;

    return { itemId, valuation, quantity, average };
  }

  /**
   *
   * @param {number} itemsId
   * @param {Date} date
   * @returns
   */
  private getItemsInventoryINAndOutAggregated = (
    itemsId: number[],
    date: Date,
  ): Promise<any> => {
    const commonBuilder = (builder) => {
      if (date) {
        builder.where('date', '<', date);
      }
      builder.whereIn('item_id', itemsId);
      builder.sum('rate as rate');
      builder.sum('quantity as quantity');
      builder.sum('cost as cost');

      builder.groupBy('item_id');
      builder.select(['item_id']);
    };
    const INValuationOper = this.inventoryCostLotTrackerModel()
      .query()
      .onBuild(commonBuilder)
      .where('direction', 'IN');

    const OUTValuationOper = this.inventoryCostLotTrackerModel()
      .query()
      .onBuild(commonBuilder)
      .where('direction', 'OUT');

    return Promise.all([OUTValuationOper, INValuationOper]);
  };

  /**
   *
   * @param {number[]} itemsIds -
   * @param {Date} date -
   */
  private getItemsInventoryInOutMap = async (itemsId: number[], date: Date) => {
    const [OUTValuation, INValuation] =
      await this.getItemsInventoryINAndOutAggregated(itemsId, date);

    const OUTValuationMap = keyBy(OUTValuation, 'itemId');
    const INValuationMap = keyBy(INValuation, 'itemId');

    return [OUTValuationMap, INValuationMap];
  };

  /**
   *
   * @param {number} tenantId
   * @param {number} itemId
   * @param {Date} date
   * @returns {Promise<Map<number, IInventoryItemCostMeta>>}
   */
  public getItemsInventoryValuation = async (
    itemsId: number[],
    date: Date,
  ): Promise<Map<number, IInventoryItemCostMeta>> => {
    // Retrieves the inventory items.
    const items = await this.itemModel()
      .query()
      .whereIn('id', itemsId)
      .where('type', 'inventory');

    // Retrieves the inventory items ids.
    const inventoryItemsIds: number[] = items.map((item) => item.id);

    // Retreives the items inventory IN/OUT map.
    const [OUTValuationMap, INValuationMap] =
      await this.getItemsInventoryInOutMap(itemsId, date);

    const getItemValuation = (itemId: number) =>
      this.getItemInventoryMeta(INValuationMap, OUTValuationMap, itemId);

    const itemsValuations = inventoryItemsIds.map((id) => getItemValuation(id));
    const itemsValuationsMap = new Map(
      itemsValuations.map((i) => [i.itemId, i]),
    );
    return itemsValuationsMap;
  };
}
