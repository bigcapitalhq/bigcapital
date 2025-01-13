import { InventoryService } from '@/modules/InventoryCost/Inventory';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { SaleInvoice } from '../../models/SaleInvoice';

@Injectable()
export class InvoiceInventoryTransactions {
  constructor(
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly inventoryService: InventoryService,
  ) {}

  /**
   * Records the inventory transactions of the given sale invoice in case
   * the invoice has inventory entries only.
   * @param {SaleInvoice} saleInvoice - Sale invoice DTO.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {boolean} override - Allow to override old transactions.
   * @return {Promise<void>}
   */
  public async recordInventoryTranscactions(
    saleInvoice: SaleInvoice,
    override?: boolean,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        saleInvoice.entries,
        trx,
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
      transaction,
      override,
      trx,
    );
  }

  /**
   * Reverting the inventory transactions once the invoice deleted.
   * @param {number} billId - Bill id.
   * @return {Promise<void>}
   */
  public async revertInventoryTransactions(
    saleInvoiceId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Delete the inventory transaction of the given sale invoice.
    const { oldInventoryTransactions } =
      await this.inventoryService.deleteInventoryTransactions(
        saleInvoiceId,
        'SaleInvoice',
        trx,
      );
  }
}
