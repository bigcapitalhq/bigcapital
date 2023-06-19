import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import { ICreditNote } from '@/interfaces';
import InventoryService from '@/services/Inventory/Inventory';
import ItemsEntriesService from '@/services/Items/ItemsEntriesService';

@Service()
export default class CreditNoteInventoryTransactions {
  @Inject()
  inventoryService: InventoryService;

  @Inject()
  itemsEntriesService: ItemsEntriesService;

  /**
   * Creates credit note inventory transactions.
   * @param {number} tenantId
   * @param {ICreditNote} creditNote
   */
  public createInventoryTransactions = async (
    tenantId: number,
    creditNote: ICreditNote,
    trx?: Knex.Transaction
  ): Promise<void> => {
    // Loads the inventory items entries of the given sale invoice.
    const inventoryEntries =
      await this.itemsEntriesService.filterInventoryEntries(
        tenantId,
        creditNote.entries
      );
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
      tenantId,
      transaction,
      false,
      trx
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
    tenantId: number,
    creditNoteId: number,
    creditNote: ICreditNote,
    trx?: Knex.Transaction
  ): Promise<void> => {
    // Deletes inventory transactions.
    await this.deleteInventoryTransactions(tenantId, creditNoteId, trx);

    // Re-write inventory transactions.
    await this.createInventoryTransactions(tenantId, creditNote, trx);
  };

  /**
   * Deletes credit note associated inventory transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} creditNoteId - Credit note id.
   * @param {Knex.Transaction} trx -
   */
  public deleteInventoryTransactions = async (
    tenantId: number,
    creditNoteId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    // Deletes the inventory transactions by the given reference id and type.
    await this.inventoryService.deleteInventoryTransactions(
      tenantId,
      creditNoteId,
      'CreditNote',
      trx
    );
  };
}
