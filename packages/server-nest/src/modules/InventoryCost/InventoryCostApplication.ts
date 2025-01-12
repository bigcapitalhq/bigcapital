import { IInventoryItemCostMeta } from '@/interfaces';
import { Service, Inject } from 'typedi';
import { InventoryItemCostService } from './InventoryCosts.service';

@Service()
export class InventoryCostApplication {
  @Inject()
  inventoryCost: InventoryItemCostService;

  /**
   * Retrieves the items inventory valuation list.
   * @param   {number} tenantId
   * @param   {number[]} itemsId
   * @param   {Date} date
   * @returns {Promise<IInventoryItemCostMeta[]>}
   */
  public getItemsInventoryValuationList = async (
    itemsId: number[],
    date: Date
  ): Promise<IInventoryItemCostMeta[]> => {
    const itemsMap = await this.inventoryCost.getItemsInventoryValuation(
      tenantId,
      itemsId,
      date
    );
    return [...itemsMap.values()];
  };
}
