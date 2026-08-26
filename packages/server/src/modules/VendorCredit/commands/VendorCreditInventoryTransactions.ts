// @ts-nocheck
import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { VendorCredit } from '../models/VendorCredit';
import { InventoryTransactionsService } from '@/modules/InventoryCost/commands/InventoryTransactions.service';
import { InventoryOriginalCostResolver } from '@/modules/InventoryCost/commands/InventoryOriginalCostResolver.service';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';

@Injectable()
export class VendorCreditInventoryTransactions {
  constructor(
    private readonly inventoryService: InventoryTransactionsService,
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly originalCostResolver: InventoryOriginalCostResolver,
  ) {}

  public createInventoryTransactions = async (
    vendorCredit: VendorCredit,
    trx: Knex.Transaction,
  ): Promise<void> => {
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        vendorCredit.entries,
      );

    const pricedEntries =
      await this.originalCostResolver.applyOriginalCostToEntries(
        inventoryEntries,
        trx,
      );

    const hasLinked = pricedEntries.some(
      (e) => e.sourceBillId && e.sourceBillEntryId,
    );

    const transaction = {
      transactionId: vendorCredit.id,
      transactionType: 'VendorCredit',
      transactionNumber: vendorCredit.vendorCreditNumber,
      exchangeRate: hasLinked ? 1 : vendorCredit.exchangeRate,
      date: vendorCredit.vendorCreditDate,
      direction: 'OUT',
      entries: pricedEntries,
      warehouseId: vendorCredit.warehouseId,
      createdAt: vendorCredit.createdAt,
    };

    await this.inventoryService.recordInventoryTransactionsFromItemsEntries(
      transaction,
      false,
      trx,
    );
  };

  public async editInventoryTransactions(
    vendorCreditId: number,
    vendorCredit: VendorCredit,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.deleteInventoryTransactions(vendorCreditId, trx);
    await this.createInventoryTransactions(vendorCredit, trx);
  }

  public async deleteInventoryTransactions(
    vendorCreditId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.inventoryService.deleteInventoryTransactions(
      vendorCreditId,
      'VendorCredit',
      trx,
    );
  }
}
