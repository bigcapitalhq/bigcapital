import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InventoryAdjustment } from "../models/InventoryAdjustment";
import { InventoryTransaction } from "@/modules/InventoryCost/models/InventoryTransaction";
import { InventoryTransactionsService } from "@/modules/InventoryCost/InventoryTransactions.service";

@Injectable()
export class InventoryAdjustmentInventoryTransactions {
  constructor(
    private readonly inventoryService: InventoryTransactionsService 
  ) {}
  
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
    trx?: Knex.Transaction
  ): Promise<void> {
    const commonTransaction = {
      direction: inventoryAdjustment.inventoryDirection,
      date: inventoryAdjustment.date,
      transactionType: 'InventoryAdjustment',
      transactionId: inventoryAdjustment.id,
      createdAt: inventoryAdjustment.createdAt,
      costAccountId: inventoryAdjustment.adjustmentAccountId,

      branchId: inventoryAdjustment.branchId,
      warehouseId: inventoryAdjustment.warehouseId,
    };
    const inventoryTransactions = [];

    inventoryAdjustment.entries.forEach((entry) => {
      inventoryTransactions.push({
        ...commonTransaction,
        itemId: entry.itemId,
        quantity: entry.quantity,
        rate: entry.cost,
      });
    });
    // Saves the given inventory transactions to the storage.
    await this.inventoryService.recordInventoryTransactions(
      inventoryTransactions,
      override,
      trx
    );
  }

  /**
   * Reverts the inventory transactions from the inventory adjustment transaction.
   * @param {number} inventoryAdjustmentId
   */
  async revertInventoryTransactions(
    inventoryAdjustmentId: number,
    trx?: Knex.Transaction
  ): Promise<{ oldInventoryTransactions: InventoryTransaction[] }> {
    return this.inventoryService.deleteInventoryTransactions(
      inventoryAdjustmentId,
      'InventoryAdjustment',
      trx
    );
  }

}