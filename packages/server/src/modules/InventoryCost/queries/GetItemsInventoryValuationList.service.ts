import { Injectable } from '@nestjs/common';
import { InventoryItemCostService } from '../commands/InventoryCosts.service';
import { IInventoryItemCostMeta } from '../types/InventoryCost.types';

@Injectable()
export class GetItemsInventoryValuationListService {
  constructor(private readonly inventoryCost: InventoryItemCostService) {}

  /**
   * Retrieves the items inventory valuation list.
   * @param   {number[]} itemsId
   * @param   {Date} date
   * @returns {Promise<IInventoryItemCostMeta[]>}
   */
  public getItemsInventoryValuationList = async (
    itemsId: number[],
    date: Date,
  ): Promise<IInventoryItemCostMeta[]> => {
    const itemsMap = await this.inventoryCost.getItemsInventoryValuation(
      itemsId,
      date,
    );
    return [...itemsMap.values()];
  };
}
