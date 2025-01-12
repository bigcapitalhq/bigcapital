import { Knex } from 'knex';
import { Bill } from '../models/Bill';
import { Injectable } from '@nestjs/common';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { InventoryService } from '@/modules/InventoryCost/Inventory';

@Injectable()
export class BillInventoryTransactions {
  constructor(
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly inventoryService: InventoryService,

    private readonly bill: typeof Bill
  ) {}

  /**
   * Records the inventory transactions from the given bill input.
   * @param  {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async recordInventoryTransactions(
    billId: number,
    override?: boolean,
    trx?: Knex.Transaction
  ): Promise<void> {
    // Retireve bill with assocaited entries and allocated cost entries.
    
    const bill = await this.bill.query(trx)
      .findById(billId)
      .withGraphFetched('entries.allocatedCostEntries');

    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        bill.entries
      );
    const transaction = {
      transactionId: bill.id,
      transactionType: 'Bill',
      exchangeRate: bill.exchangeRate,

      date: bill.billDate,
      direction: 'IN',
      entries: inventoryEntries,
      createdAt: bill.createdAt,

      warehouseId: bill.warehouseId,
    };
    await this.inventoryService.recordInventoryTransactionsFromItemsEntries(
      transaction,
      override,
      trx
    );
  }

  /**
   * Reverts the inventory transactions of the given bill id.
   * @param {number} tenantId - Tenant id.
   * @param {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async revertInventoryTransactions(
    billId: number,
    trx?: Knex.Transaction
  ) {
    // Deletes the inventory transactions by the given reference id and type.
    await this.inventoryService.deleteInventoryTransactions(
      billId,
      'Bill',
      trx
    );
  }
}
