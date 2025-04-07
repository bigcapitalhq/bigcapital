import { pick } from 'lodash';
import { Knex } from 'knex';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { InventoryItemOpeningAvgCostService } from './InventoryItemOpeningAvgCost.service';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryAverageCostMethod } from './InventoryAverageCostMethod';
import { StoreInventoryLotsCostService } from './StoreInventortyLotsCost.service';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';

@Injectable()
export class InventoryAverageCostMethodService {
  constructor(
    private readonly itemOpeningAvgCostService: InventoryItemOpeningAvgCostService,
    private readonly storeInventoryLotsCostService: StoreInventoryLotsCostService,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,
  ) {}

  /**
   * Retrieves the inventory cost lots.
   * @param {Date} startingDate
   * @param {number} itemId
   * @param {number} openingQuantity
   * @param {number} openingCost
   * @returns {Promise<any[]>}
   */
  async getInventoryCostLots(
    startingDate: Date,
    itemId: number,
    openingQuantity: number,
    openingCost: number,
  ) {
    const afterInvTransactions = await this.inventoryTransactionModel()
      .query()
      .modify('filterDateRange', startingDate)
      .orderBy('date', 'ASC')
      .orderByRaw("FIELD(direction, 'IN', 'OUT')")
      .orderBy('createdAt', 'ASC')
      .where('item_id', itemId)
      .withGraphFetched('item');

    const avgCostTracker = new InventoryAverageCostMethod();

    // Tracking inventroy transactions and retrieve cost transactions based on
    // average rate cost method.
    return avgCostTracker.trackingCostTransactions(
      afterInvTransactions,
      openingQuantity,
      openingCost,
    );
  }
  /**
   * Computes items costs from the given date using average cost method.
   * ----------
   * - Calculate the items average cost in the given date.
   * - Remove the journal entries that associated to the inventory transacions
   *   after the given date.
   * - Re-compute the inventory transactions and re-write the journal entries
   *   after the given date.
   * ----------
   * @param {Date} startingDate
   * @param {number} itemId
   * @param {Knex.Transaction} trx
   */
  public async computeItemCost(
    startingDate: Date,
    itemId: number,
    trx?: Knex.Transaction,
  ) {
    const { openingQuantity, openingCost } =
      await this.itemOpeningAvgCostService.getOpeningAverageCost(
        startingDate,
        itemId,
      );
    // Retrieves the new calculated inventory cost lots.
    const inventoryCostLots = await this.getInventoryCostLots(
      startingDate,
      itemId,
      openingQuantity,
      openingCost,
    );
    // Revert the inveout out lots transactions
    await this.storeInventoryLotsCostService.revertInventoryCostLotTransactions(
      startingDate,
      itemId,
      trx,
    );
    // Store inventory lots cost transactions.
    await this.storeInventoryLotsCostService.storeInventoryLotsCost(
      inventoryCostLots,
      trx,
    );
  }
}
