// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { SaleReceipt } from '../models/SaleReceipt';
import { InventoryTransactionsService } from '@/modules/InventoryCost/commands/InventoryTransactions.service';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';

@Injectable()
export class SaleReceiptInventoryTransactions {
  constructor(
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly inventoryService: InventoryTransactionsService,
  ) {}

  /**
   * Records the inventory transactions from the given bill input.
   * @param {Bill} bill - Bill model object.
   * @param {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async recordInventoryTransactions(
    saleReceipt: SaleReceipt,
    override?: boolean,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        saleReceipt.entries,
      );
    const transaction = {
      transactionId: saleReceipt.id,
      transactionType: 'SaleReceipt',
      transactionNumber: saleReceipt.receiptNumber,
      exchangeRate: saleReceipt.exchangeRate,

      date: saleReceipt.receiptDate,
      direction: 'OUT',
      entries: inventoryEntries,
      createdAt: saleReceipt.createdAt,

      warehouseId: saleReceipt.warehouseId,
    };
    return this.inventoryService.recordInventoryTransactionsFromItemsEntries(
      transaction,
      override,
      trx,
    );
  }

  /**
   * Reverts the inventory transactions of the given bill id.
   * @param {number} tenantId - Tenant id.
   * @param {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async revertInventoryTransactions(
    receiptId: number,
    trx?: Knex.Transaction,
  ) {
    return this.inventoryService.deleteInventoryTransactions(
      receiptId,
      'SaleReceipt',
      trx,
    );
  }
}
