import { Injectable } from '@nestjs/common';
import { InventoryItemCostService } from './InventoryCosts.service';
import { IInventoryItemCostMeta } from './types/InventoryCost.types';

@Injectable()
export class InventoryCostApplication {
  constructor(
    private readonly inventoryCost: InventoryItemCostService,
  ) {}

  /**
   * Retrieves the items inventory valuation list.
   * @param {number[]} itemsId
   * @param {Date} date
   * @returns {Promise<IInventoryItemCostMeta[]>}
   */
  public getItemsInventoryValuationList = async (
    itemsId: number[],
    date: Date
  ): Promise<IInventoryItemCostMeta[]> => {
    const itemsMap = await this.inventoryCost.getItemsInventoryValuation(
      itemsId,
      date
    );
    return [...itemsMap.values()];
  };
}
