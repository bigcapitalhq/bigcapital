import { Injectable } from '@nestjs/common';
import { InventoryItemCostService } from './commands/InventoryCosts.service';

@Injectable()
export class InventoryCostApplication {
  constructor(private readonly inventoryCost: InventoryItemCostService) {}

  /**
   * Computes the item cost.
   * @param {Date} fromDate - From date.
   * @param {number} itemId - Item id.
   * @returns {Promise<Map<number, IInventoryItemCostMeta>>}
   */
  computeItemCost(fromDate: Date, itemId: number) {
    return this.inventoryCost.getItemsInventoryValuation([itemId], fromDate);
  }

  /**
   * Retrieves the items inventory valuation list.
   * @param {number[]} itemsId
   * @param {Date} date
   * @returns {Promise<IInventoryItemCostMeta[]>}
   */
  async getItemsInventoryValuation(
    itemsId: number[],
    date: Date,
  ): Promise<any> {
    const itemsMap = await this.inventoryCost.getItemsInventoryValuation(
      itemsId,
      date,
    );
    return [...itemsMap.values()];
  }
}
