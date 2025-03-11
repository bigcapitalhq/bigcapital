import { Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';
import { InventoryCostLotTracker } from '../models/InventoryCostLotTracker';

@Injectable()
export class InventoryItemOpeningAvgCostService {
  constructor(
    private readonly inventoryCostLotTrackerModel: TenantModelProxy<
      typeof InventoryCostLotTracker
    >,
  ) {}

  /**
   * Get items Average cost from specific date from inventory transactions.
   * @param {Date} closingDate - Closing date.
   * @param {number} itemId - Item id.
   * @return {Promise<{
   *    averageCost: number,
   *    openingCost: number,
   *    openingQuantity: number,
   * }>}
   */
  public async getOpeningAverageCost(closingDate: Date, itemId: number) {
    const commonBuilder = (builder: any) => {
      if (closingDate) {
        builder.where('date', '<', closingDate);
      }
      builder.where('item_id', itemId);
      builder.sum('rate as rate');
      builder.sum('quantity as quantity');
      builder.sum('cost as cost');
      builder.first();
    };
    // Calculates the total inventory total quantity and rate `IN` transactions.
    const inInvSumationOper = this.inventoryCostLotTrackerModel()
      .query()
      .onBuild(commonBuilder)
      .where('direction', 'IN');

    // Calculates the total inventory total quantity and rate `OUT` transactions.
    const outInvSumationOper = this.inventoryCostLotTrackerModel()
      .query()
      .onBuild(commonBuilder)
      .where('direction', 'OUT');

    const [inInvSumation, outInvSumation] = await Promise.all([
      inInvSumationOper,
      outInvSumationOper,
    ]);
    return this.computeItemAverageCost(
      inInvSumation?.cost || 0,
      inInvSumation?.quantity || 0,
      outInvSumation?.cost || 0,
      outInvSumation?.quantity || 0,
    );
  }

  /**
   * Computes the item average cost.
   * @static
   * @param {number} quantityIn
   * @param {number} rateIn
   * @param {number} quantityOut
   * @param {number} rateOut
   */
  public computeItemAverageCost(
    totalCostIn: number,
    totalQuantityIn: number,

    totalCostOut: number,
    totalQuantityOut: number,
  ) {
    const openingCost = totalCostIn - totalCostOut;
    const openingQuantity = totalQuantityIn - totalQuantityOut;

    const averageCost = openingQuantity ? openingCost / openingQuantity : 0;

    return { averageCost, openingCost, openingQuantity };
  }
}
