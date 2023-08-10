import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import InventoryService from '@/services/Inventory/Inventory';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class BillInventoryTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private inventoryService: InventoryService;

  /**
   * Records the inventory transactions from the given bill input.
   * @param  {Bill} bill - Bill model object.
   * @param  {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async recordInventoryTransactions(
    tenantId: number,
    billId: number,
    override?: boolean,
    trx?: Knex.Transaction
  ): Promise<void> {
    const { Bill } = this.tenancy.models(tenantId);

    // Retireve bill with assocaited entries and allocated cost entries.
    const bill = await Bill.query(trx)
      .findById(billId)
      .withGraphFetched('entries.allocatedCostEntries');

    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        tenantId,
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
    billId: number,
    trx?: Knex.Transaction
  ) {
    // Deletes the inventory transactions by the given reference id and type.
    await this.inventoryService.deleteInventoryTransactions(
      tenantId,
      billId,
      'Bill',
      trx
    );
  }
}
