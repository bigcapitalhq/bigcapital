// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { InventoryTransactionsService } from '@/modules/InventoryCost/commands/InventoryTransactions.service';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { CreditNote } from '../models/CreditNote';
import { Knex } from 'knex';
@Injectable()
export class CreditNoteInventoryTransactions {
  constructor(
    private readonly inventoryService: InventoryTransactionsService,
    private readonly itemsEntriesService: ItemsEntriesService,
  ) {}

  /**
   * Creates credit note inventory transactions.
   * @param {number} tenantId
   * @param {ICreditNote} creditNote
   */
  public createInventoryTransactions = async (
    creditNote: CreditNote,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(creditNote.entries);

    const transaction = {
      transactionId: creditNote.id,
      transactionType: 'CreditNote',
      transactionNumber: creditNote.creditNoteNumber,
      exchangeRate: creditNote.exchangeRate,
      date: creditNote.creditNoteDate,
      direction: 'IN',
      entries: inventoryEntries,
      createdAt: creditNote.createdAt,
      warehouseId: creditNote.warehouseId,
    };
    // Writes inventory tranactions.
    await this.inventoryService.recordInventoryTransactionsFromItemsEntries(
      transaction,
      false,
      trx,
    );
  };

  /**
   * Edits vendor credit associated inventory transactions.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @param {ICreditNote} creditNote
   * @param {Knex.Transactions} trx
   */
  public editInventoryTransactions = async (
    creditNoteId: number,
    creditNote: CreditNote,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Deletes inventory transactions.
    await this.deleteInventoryTransactions(creditNoteId, trx);

    // Re-write inventory transactions.
    await this.createInventoryTransactions(creditNote, trx);
  };

  /**
   * Deletes credit note associated inventory transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} creditNoteId - Credit note id.
   * @param {Knex.Transaction} trx -
   */
  public deleteInventoryTransactions = async (
    creditNoteId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Deletes the inventory transactions by the given reference id and type.
    await this.inventoryService.deleteInventoryTransactions(
      creditNoteId,
      'CreditNote',
      trx,
    );
  };
}
