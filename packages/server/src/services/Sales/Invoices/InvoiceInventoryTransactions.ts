import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { ISaleInvoice } from '@/interfaces';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';
import InventoryService from '@/services/Inventory/Inventory';

@Service()
export class InvoiceInventoryTransactions {
  @Inject()
  private itemsEntriesService: ItemsEntriesService;

  @Inject()
  private inventoryService: InventoryService;

  /**
   * Records the inventory transactions of the given sale invoice in case
   * the invoice has inventory entries only.
   *
   * @param {number} tenantId - Tenant id.
   * @param {SaleInvoice} saleInvoice - Sale invoice DTO.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {boolean} override - Allow to override old transactions.
   * @return {Promise<void>}
   */
  public async recordInventoryTranscactions(
    tenantId: number,
    saleInvoice: ISaleInvoice,
    override?: boolean,
    trx?: Knex.Transaction
  ): Promise<void> {
    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        tenantId,
        saleInvoice.entries,
        trx
      );
    const transaction = {
      transactionId: saleInvoice.id,
      transactionType: 'SaleInvoice',
      transactionNumber: saleInvoice.invoiceNo,

      exchangeRate: saleInvoice.exchangeRate,
      warehouseId: saleInvoice.warehouseId,

      date: saleInvoice.invoiceDate,
      direction: 'OUT',
      entries: inventoryEntries,
      createdAt: saleInvoice.createdAt,
    };
    await this.inventoryService.recordInventoryTransactionsFromItemsEntries(
      tenantId,
      transaction,
      override,
      trx
    );
  }
  /**
   * Reverting the inventory transactions once the invoice deleted.
   * @param {number} tenantId - Tenant id.
   * @param {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async revertInventoryTransactions(
    tenantId: number,
    saleInvoiceId: number,
    trx?: Knex.Transaction
  ): Promise<void> {
    // Delete the inventory transaction of the given sale invoice.
    const { oldInventoryTransactions } =
      await this.inventoryService.deleteInventoryTransactions(
        tenantId,
        saleInvoiceId,
        'SaleInvoice',
        trx
      );
  }
}
