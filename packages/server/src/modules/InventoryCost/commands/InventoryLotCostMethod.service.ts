import * as moment from 'moment';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { StoreInventoryLotsCostService } from './StoreInventortyLotsCost.service';
import {
  InventoryFIFOCostMethod,
  InventoryLIFOCostMethod,
  InventoryLotCostMethod,
} from './InventoryLotCostMethod';
import type { TCostMethod } from '../types/InventoryCost.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class InventoryLotCostMethodService {
  constructor(
    private readonly storeInventoryLotsCostService: StoreInventoryLotsCostService,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,
  ) {}

  /**
   * Creates the cost method calculator for the given cost method.
   * @param {TCostMethod} costMethod - The cost method.
   * @returns {InventoryLotCostMethod}
   */
  private createCostMethod(costMethod: TCostMethod): InventoryLotCostMethod {
    return costMethod === 'LIFO'
      ? new InventoryLIFOCostMethod()
      : new InventoryFIFOCostMethod();
  }

  /**
   * Retrieves the item inventory transactions after the given date.
   * @param {number} itemId - The item id.
   * @param {string} startingDate - The starting date.
   * @returns {Promise<InventoryTransaction[]>}
   */
  private async getItemInventoryTransactions(
    itemId: number,
    startingDate: string,
  ): Promise<InventoryTransaction[]> {
    return this.inventoryTransactionModel()
      .query()
      .where('item_id', itemId)
      .modify('filterDateRange', startingDate)
      .modify('ordered');
  }

  /**
   * Retrieves the item inventory transactions before the given date.
   * @param {number} itemId - The item id.
   * @param {string} startingDate - The starting date.
   * @returns {Promise<InventoryTransaction[]>}
   */
  private async getItemOpeningInventoryTransactions(
    itemId: number,
    startingDate: string,
  ): Promise<InventoryTransaction[]> {
    return this.inventoryTransactionModel()
      .query()
      .where('item_id', itemId)
      .where('date', '<', startingDate)
      .modify('ordered');
  }

  /**
   * Computes the item cost using FIFO or LIFO cost methods.
   * ----------
   * - Reconstructs the remaining lots before the given starting date.
   * - Re-computes the inventory transactions after the given date.
   * - Replaces the inventory cost lot transactions.
   * ----------
   * @param {Date} startingDate - The starting date.
   * @param {number} itemId - The item id.
   * @param {TCostMethod} costMethod - The cost method.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public async computeItemCost(
    startingDate: Date,
    itemId: number,
    costMethod: TCostMethod,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const startingDateFormatted = moment(startingDate).format('YYYY-MM-DD');
    const costMethodCalculator = this.createCostMethod(costMethod);

    const [openingTransactions, inventoryTransactions] = await Promise.all([
      this.getItemOpeningInventoryTransactions(itemId, startingDateFormatted),
      this.getItemInventoryTransactions(itemId, startingDateFormatted),
    ]);
    // Reconstruct the remaining lots as of the starting date.
    const openingLots =
      costMethodCalculator.getRemainingLots(openingTransactions);

    // Compute the inventory cost lots transactions.
    const inventoryCostLots = costMethodCalculator.trackingCostTransactions(
      inventoryTransactions,
      openingLots,
    );
    // Revert the inventory cost lot transactions from the starting date.
    await this.storeInventoryLotsCostService.revertInventoryCostLotTransactions(
      startingDate,
      itemId,
      trx,
    );
    // Store the new inventory cost lot transactions.
    await this.storeInventoryLotsCostService.storeInventoryLotsCost(
      inventoryCostLots,
      trx,
    );
  }
}
