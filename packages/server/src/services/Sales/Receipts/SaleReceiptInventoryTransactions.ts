import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { ISaleReceipt } from '@/interfaces';
import InventoryService from '@/services/Inventory/Inventory';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';

@Service()
export class SaleReceiptInventoryTransactions {
  @Inject()
  private inventoryService: InventoryService;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  /**
   * Records the inventory transactions from the given bill input.
   * @param {Bill} bill - Bill model object.
   * @param {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async recordInventoryTransactions(
    tenantId: number,
    saleReceipt: ISaleReceipt,
    override?: boolean,
    trx?: Knex.Transaction
  ): Promise<void> {
    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        tenantId,
        saleReceipt.entries
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
      tenantId,
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
    tenantId: number,
    receiptId: number,
    trx?: Knex.Transaction
  ) {
    return this.inventoryService.deleteInventoryTransactions(
      tenantId,
      receiptId,
      'SaleReceipt',
      trx
    );
  }
}
