// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { InventoryTransactionsService } from '@/modules/InventoryCost/commands/InventoryTransactions.service';
import { InventoryOriginalCostResolver } from '@/modules/InventoryCost/commands/InventoryOriginalCostResolver.service';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { CreditNote } from '../models/CreditNote';
import { Knex } from 'knex';

@Injectable()
export class CreditNoteInventoryTransactions {
  constructor(
    private readonly inventoryService: InventoryTransactionsService,
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly originalCostResolver: InventoryOriginalCostResolver,
  ) {}

  /**
   * Creates credit note inventory transactions.
   * Linked returns use original invoice/receipt COGS as inventory rate.
   */
  public createInventoryTransactions = async (
    creditNote: CreditNote,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(creditNote.entries);

    const pricedEntries =
      await this.originalCostResolver.applyOriginalCostToEntries(
        inventoryEntries,
        trx,
      );

    const hasLinked = pricedEntries.some(
      (e) =>
        (e.sourceInvoiceId && e.sourceInvoiceEntryId) ||
        (e.sourceReceiptId && e.sourceReceiptEntryId),
    );

    const transaction = {
      transactionId: creditNote.id,
      transactionType: 'CreditNote',
      transactionNumber: creditNote.creditNoteNumber,
      // Linked rates are already base-currency COGS; free-standing use doc FX.
      exchangeRate: hasLinked ? 1 : creditNote.exchangeRate,
      date: creditNote.creditNoteDate,
      direction: 'IN',
      entries: pricedEntries,
      createdAt: creditNote.createdAt,
      warehouseId: creditNote.warehouseId,
    };

    await this.inventoryService.recordInventoryTransactionsFromItemsEntries(
      transaction,
      false,
      trx,
    );
  };

  public editInventoryTransactions = async (
    creditNoteId: number,
    creditNote: CreditNote,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    await this.deleteInventoryTransactions(creditNoteId, trx);
    await this.createInventoryTransactions(creditNote, trx);
  };

  public deleteInventoryTransactions = async (
    creditNoteId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    await this.inventoryService.deleteInventoryTransactions(
      creditNoteId,
      'CreditNote',
      trx,
    );
  };
}
