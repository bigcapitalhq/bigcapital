import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InventoryAdjustment } from '../models/InventoryAdjustment';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { InventoryTransactionsService } from '@/modules/InventoryCost/commands/InventoryTransactions.service';
import { IInventoryTransactionRecord } from '@/modules/InventoryCost/types/InventoryCost.types';

@Injectable()
export class InventoryAdjustmentInventoryTransactions {
  constructor(
    private readonly inventoryService: InventoryTransactionsService,
  ) {}

  /**
   * Builds the inventory transactions from the inventory adjustment transaction.
   * @param {InventoryAdjustment} inventoryAdjustment - Inventory adjustment.
   * @return {IInventoryTransactionRecord[]}
   */
  private buildInventoryTransactions(
    inventoryAdjustment: InventoryAdjustment,
  ): IInventoryTransactionRecord[] {
    const commonTransaction = {
      direction: inventoryAdjustment.inventoryDirection,
      date: inventoryAdjustment.date,
      transactionType: 'InventoryAdjustment',
      transactionId: inventoryAdjustment.id,
      createdAt: inventoryAdjustment.createdAt as Date,
      costAccountId: inventoryAdjustment.adjustmentAccountId,

      branchId: inventoryAdjustment.branchId,
      warehouseId: inventoryAdjustment.warehouseId,
    };
    return inventoryAdjustment.entries.map((entry) => ({
      ...commonTransaction,
      itemId: entry.itemId,
      quantity: entry.quantity,
      rate: entry.cost,
    }));
  }

  /**
   * Asserts that writing the inventory adjustment transactions will not make
   * the items stock negative.
   * @param {InventoryAdjustment} inventoryAdjustment - Inventory adjustment.
   * @param {boolean} override - Whether the existing transactions will be replaced.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @return {Promise<void>}
   */
  public async assertSufficientStock(
    inventoryAdjustment: InventoryAdjustment,
    override: boolean = false,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.inventoryService.assertSufficientStock(
      this.buildInventoryTransactions(inventoryAdjustment),
      override,
      trx,
    );
  }

  /**
   * Asserts that reverting the inventory adjustment transactions will not make
   * the items stock negative.
   * @param {number} inventoryAdjustmentId - Inventory adjustment id.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @return {Promise<void>}
   */
  public async assertSufficientStockForDeletion(
    inventoryAdjustmentId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.inventoryService.assertSufficientStockForDeletion(
      inventoryAdjustmentId,
      'InventoryAdjustment',
      trx,
    );
  }

  /**
   * Writes the inventory transactions from the inventory adjustment transaction.
   * @param  {number} tenantId -
   * @param  {IInventoryAdjustment} inventoryAdjustment -
   * @param  {boolean} override -
   * @param  {Knex.Transaction} trx -
   * @return {Promise<void>}
   */
  public async writeInventoryTransactions(
    inventoryAdjustment: InventoryAdjustment,
    override: boolean = false,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Saves the given inventory transactions to the storage.
    await this.inventoryService.recordInventoryTransactions(
      this.buildInventoryTransactions(inventoryAdjustment),
      override,
      trx,
    );
  }

  /**
   * Reverts the inventory transactions from the inventory adjustment transaction.
   * @param {number} inventoryAdjustmentId
   */
  async revertInventoryTransactions(
    inventoryAdjustmentId: number,
    trx?: Knex.Transaction,
  ): Promise<{ oldInventoryTransactions: InventoryTransaction[] }> {
    return this.inventoryService.deleteInventoryTransactions(
      inventoryAdjustmentId,
      'InventoryAdjustment',
      trx,
    );
  }
}
