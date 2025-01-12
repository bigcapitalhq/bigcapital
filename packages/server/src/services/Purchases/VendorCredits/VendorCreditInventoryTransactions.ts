import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import { IVendorCredit } from '@/interfaces';
import InventoryService from '@/services/Inventory/Inventory';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';

@Service()
export default class VendorCreditInventoryTransactions {
  @Inject()
  inventoryService: InventoryService;

  @Inject()
  itemsEntriesService: ItemsEntriesService;

  /**
   * Creates vendor credit associated inventory transactions.
   * @param {number} tenantId
   * @param {IVnedorCredit} vendorCredit
   * @param {Knex.Transaction} trx
   */
  public createInventoryTransactions = async (
    vendorCredit: IVendorCredit,
    trx: Knex.Transaction
  ): Promise<void> => {
    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        vendorCredit.entries
      );

    const transaction = {
      transactionId: vendorCredit.id,
      transactionType: 'VendorCredit',
      transactionNumber: vendorCredit.vendorCreditNumber,
      exchangeRate: vendorCredit.exchangeRate,
      date: vendorCredit.vendorCreditDate,
      direction: 'OUT',
      entries: inventoryEntries,
      warehouseId: vendorCredit.warehouseId,
      createdAt: vendorCredit.createdAt,
    };
    // Writes inventory tranactions.
    await this.inventoryService.recordInventoryTransactionsFromItemsEntries(
      transaction,
      false,
      trx
    );
  };

  /**
   * Edits vendor credit associated inventory transactions.
   * @param {number} vendorCreditId - Vendor credit id.
   * @param {IVendorCredit} vendorCredit - Vendor credit.
   * @param {Knex.Transactions} trx - Knex transaction.
   */
  public async editInventoryTransactions(
    vendorCreditId: number,
    vendorCredit: IVendorCredit,
    trx?: Knex.Transaction
  ): Promise<void> {
    // Deletes inventory transactions.
    await this.deleteInventoryTransactions(vendorCreditId, trx);

    // Re-write inventory transactions.
    await this.createInventoryTransactions(vendorCredit, trx);
  };

  /**
   * Deletes credit note associated inventory transactions.
   * @param {number} vendorCreditId - Vendor credit id.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public async deleteInventoryTransactions(
    vendorCreditId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    // Deletes the inventory transactions by the given reference id and type.
    await this.inventoryService.deleteInventoryTransactions(
      vendorCreditId,
      'VendorCredit',
      trx
    );
  };
}
