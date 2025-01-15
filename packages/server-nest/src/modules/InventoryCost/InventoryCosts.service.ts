// import { keyBy, get } from 'lodash';
// import { Knex } from 'knex';
// import * as R from 'ramda';
// import { IInventoryItemCostMeta } from './types/InventoryCost.types';
// import { Inject, Injectable } from '@nestjs/common';
// import { InventoryTransaction } from './models/InventoryTransaction';
// import { InventoryCostLotTracker } from './models/InventoryCostLotTracker';
// import { Item } from '../Items/models/Item';

// @Injectable()
// export class InventoryItemCostService {
//   constructor(
//     @Inject(InventoryTransaction.name)
//     private readonly inventoryTransactionModel: typeof InventoryTransaction,

//     @Inject(InventoryCostLotTracker.name)
//     private readonly inventoryCostLotTrackerModel: typeof InventoryCostLotTracker,

//     @Inject(Item.name)
//     private readonly itemModel: typeof Item,
//   ) {}

//   /**
//    * Common query of items inventory valuation.
//    * @param {number[]} itemsIds - 
//    * @param {Date} date - 
//    * @param {Knex.QueryBuilder} builder - 
//    */
//   private itemsInventoryValuationCommonQuery = R.curry(
//     (itemsIds: number[], date: Date, builder: Knex.QueryBuilder) => {
//       if (date) {
//         builder.where('date', '<', date);
//       }
//       builder.whereIn('item_id', itemsIds);
//       builder.sum('rate as rate');
//       builder.sum('quantity as quantity');
//       builder.sum('cost as cost');

//       builder.groupBy('item_id');
//       builder.select(['item_id']);
//     }
//   );

//   /**
//    * 
//    * @param {} INValuationMap -
//    * @param {} OUTValuationMap - 
//    * @param {number} itemId
//    */
//   private getItemInventoryMeta = R.curry(
//     (
//       INValuationMap,
//       OUTValuationMap,
//       itemId: number
//     ): IInventoryItemCostMeta => {
//       const INCost = get(INValuationMap, `[${itemId}].cost`, 0);
//       const INQuantity = get(INValuationMap, `[${itemId}].quantity`, 0);

//       const OUTCost = get(OUTValuationMap, `[${itemId}].cost`, 0);
//       const OUTQuantity = get(OUTValuationMap, `[${itemId}].quantity`, 0);

//       const valuation = INCost - OUTCost;
//       const quantity = INQuantity - OUTQuantity;
//       const average = quantity ? valuation / quantity : 0;

//       return { itemId, valuation, quantity, average };
//     }
//   );

//   /**
//    *
//    * @param {number} tenantId
//    * @param {number} itemsId
//    * @param {Date} date
//    * @returns
//    */
//   private getItemsInventoryINAndOutAggregated = (
//     itemsId: number[],
//     date: Date
//   ): Promise<any> => {

//     const commonBuilder = this.itemsInventoryValuationCommonQuery(
//       itemsId,
//       date
//     );
//     const INValuationOper = this.inventoryCostLotTrackerModel.query()
//       .onBuild(commonBuilder)
//       .where('direction', 'IN');

//     const OUTValuationOper = this.inventoryCostLotTrackerModel.query()
//       .onBuild(commonBuilder)
//       .where('direction', 'OUT');

//     return Promise.all([OUTValuationOper, INValuationOper]);
//   };

//   /**
//    * 
//    * @param {number} tenantId - 
//    * @param {number[]} itemsIds - 
//    * @param {Date} date - 
//    */
//   private getItemsInventoryInOutMap = async (
//     itemsId: number[],
//     date: Date
//   ) => {
//     const [OUTValuation, INValuation] =
//       await this.getItemsInventoryINAndOutAggregated(itemsId, date);

//     const OUTValuationMap = keyBy(OUTValuation, 'itemId');
//     const INValuationMap = keyBy(INValuation, 'itemId');

//     return [OUTValuationMap, INValuationMap];
//   };

//   /**
//    *
//    * @param   {number} tenantId
//    * @param   {number} itemId
//    * @param   {Date} date
//    * @returns {Promise<Map<number, IInventoryItemCostMeta>>}
//    */
//   public getItemsInventoryValuation = async (
//     itemsId: number[],
//     date: Date
//   ): Promise<Map<number, IInventoryItemCostMeta>> => {
//     // Retrieves the inventory items.
//     const items = await this.itemModel.query()
//       .whereIn('id', itemsId)
//       .where('type', 'inventory');

//     // Retrieves the inventory items ids.
//     const inventoryItemsIds: number[] = items.map((item) => item.id);

//     // Retreives the items inventory IN/OUT map.
//     const [OUTValuationMap, INValuationMap] =
//       await this.getItemsInventoryInOutMap(itemsId, date);

//     const getItemValuation = this.getItemInventoryMeta(
//       INValuationMap,
//       OUTValuationMap
//     );
//     const itemsValuations = inventoryItemsIds.map(getItemValuation);
//     const itemsValuationsMap = new Map(
//       itemsValuations.map((i) => [i.itemId, i])
//     );
//     return itemsValuationsMap;
//   };
// }
