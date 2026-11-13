import { InventoryTransactionsService } from '@/modules/InventoryCost/commands/InventoryTransactions.service';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { SaleInvoice } from '../../models/SaleInvoice';
import { IInventoryTransactionFromItemsEntries } from '@/modules/InventoryCost/types/InventoryCost.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class InvoiceInventoryTransactions {
  constructor(
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly inventoryService: InventoryTransactionsService,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
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
    // Retrieves the invoice entries with their batch allocations.
    const invoice = await this.saleInvoiceModel()
      .query(trx)
      .findById(saleInvoice.id)
      .withGraphFetched('entries.batches');

    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        invoice.entries,
        trx,
      );
    const transaction: IInventoryTransactionFromItemsEntries = {
      transactionId: invoice.id,
      transactionType: 'SaleInvoice',
      transactionNumber: invoice.invoiceNo,

      exchangeRate: invoice.exchangeRate,
      warehouseId: invoice.warehouseId,

      date: invoice.invoiceDate,
      direction: 'OUT',
      entries: inventoryEntries,
      createdAt: invoice.createdAt,
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
    await this.inventoryService.deleteInventoryTransactions(
      saleInvoiceId,
      'SaleInvoice',
      trx,
    );
  }
}
