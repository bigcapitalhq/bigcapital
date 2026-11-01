import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IInventoryTransactionsDeletedPayload,
  IInventoryTransactionFromItemsEntries,
  IInventoryTransactionRecord,
} from '../types/InventoryCost.types';
import { InventoryCostLotTracker } from '../models/InventoryCostLotTracker';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { events } from '@/common/events/events';
import { IInventoryTransactionsCreatedPayload } from '../types/InventoryCost.types';
import { transformItemEntriesToInventory } from '../utils';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { InventoryStockGuard } from './InventoryStockGuard.service';

@Injectable()
export class InventoryTransactionsService {
  /**
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {TenantModelProxy<typeof InventoryTransaction>} inventoryTransactionModel - Inventory transaction model.
   * @param {TenantModelProxy<typeof InventoryCostLotTracker>} inventoryCostLotTracker - Inventory cost lot tracker model.
   * @param {InventoryStockGuard} stockGuard - Inventory stock guard.
   */
  constructor(
    private readonly eventEmitter: EventEmitter2,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,

    @Inject(InventoryCostLotTracker.name)
    private readonly inventoryCostLotTracker: TenantModelProxy<
      typeof InventoryCostLotTracker
    >,

    private readonly stockGuard: InventoryStockGuard,
  ) {}

  /**
   * Records the inventory transactions.
   * @param {InventoryTransaction[]} transactions - Inventory transactions.
   * @param {boolean} override - Override the existing transactions.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @return {Promise<void>}
   */
  async recordInventoryTransactions(
    transactions: IInventoryTransactionRecord[],
    override: boolean = false,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Prevent inventory transactions that would make the items stock negative.
    await this.stockGuard.assertSufficientStock(transactions, override, trx);

    const bulkInsertOpers = [];

    transactions.forEach((transaction: IInventoryTransactionRecord) => {
      const oper = this.recordInventoryTransaction(transaction, override, trx);
      bulkInsertOpers.push(oper);
    });
    const inventoryTransactions = await Promise.all(bulkInsertOpers);

    // Triggers `onInventoryTransactionsCreated` event.
    await this.eventEmitter.emitAsync(
      events.inventory.onInventoryTransactionsCreated,
      {
        inventoryTransactions,
        trx,
      } as IInventoryTransactionsCreatedPayload,
    );
  }

  /**
   * Writes the inventory transactiosn on the storage from the given
   * inventory transactions entries.
   * @param {InventoryTransaction} inventoryEntry - Inventory transaction.
   * @param {boolean} deleteOld - Delete the existing inventory transactions.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @return {Promise<InventoryTransaction>}
   */
  async recordInventoryTransaction(
    inventoryEntry: IInventoryTransactionRecord,
    deleteOld: boolean = false,
    trx: Knex.Transaction,
  ): Promise<InventoryTransaction> {
    if (deleteOld) {
      await this.deleteInventoryTransactions(
        inventoryEntry.transactionId,
        inventoryEntry.transactionType,
        trx,
        false,
      );
    }
    return this.inventoryTransactionModel()
      .query(trx)
      .insertGraph({
        ...inventoryEntry,
      });
  }

  /**
   * Records the inventory transactions from items entries that have (inventory) type.
   * @param {number} tenantId
   * @param {number} transactionId
   * @param {string} transactionType
   * @param {Date|string} transactionDate
   * @param {boolean} override
   */
  async recordInventoryTransactionsFromItemsEntries(
    transaction: IInventoryTransactionFromItemsEntries,
    override: boolean = false,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Can't continue if there is no entries has inventory items in the invoice.
    if (transaction.entries.length <= 0) {
      // When replacing an existing transaction, make sure its old inventory
      // transactions are reverted even if the new transaction has no
      // inventory entries.
      if (override) {
        await this.deleteInventoryTransactions(
          transaction.transactionId,
          transaction.transactionType,
          trx,
        );
      }
      return;
    }
    // Inventory transactions.
    const inventoryTranscations = transformItemEntriesToInventory(transaction);

    // Records the inventory transactions of the given sale invoice.
    await this.recordInventoryTransactions(
      inventoryTranscations,
      override,
      trx,
    );
  }

  /**
   * Deletes the given inventory transactions.
   * @param {number} transactionId - Transaction id.
   * @param {string} transactionType - Transaction type.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @param {boolean} validateStock - Validate the stock after deleting the transactions.
   * @return {Promise<{ oldInventoryTransactions: IInventoryTransaction[] }>}
   */
  public async deleteInventoryTransactions(
    transactionId: number,
    transactionType: string,
    trx?: Knex.Transaction,
    validateStock: boolean = true,
  ): Promise<{ oldInventoryTransactions: InventoryTransaction[] }> {
    // Retrieve the inventory transactions of the given sale invoice.
    let oldInventoryTransactionsQuery = this.inventoryTransactionModel()
      .query(trx)
      .where({ transactionId, transactionType });

    if (trx) {
      oldInventoryTransactionsQuery = oldInventoryTransactionsQuery.forUpdate();
    }
    const oldInventoryTransactions = await oldInventoryTransactionsQuery;

    // Prevent deleting the transactions that would make the items stock negative.
    if (validateStock) {
      await this.stockGuard.assertSufficientStockForDeletion(
        oldInventoryTransactions,
        trx,
      );
    }

    // Deletes the inventory transactions by the given transaction type and id.
    await this.inventoryTransactionModel()
      .query(trx)
      .where({ transactionType, transactionId })
      .delete();

    // Triggers `onInventoryTransactionsDeleted` event.
    await this.eventEmitter.emitAsync(
      events.inventory.onInventoryTransactionsDeleted,
      {
        oldInventoryTransactions,
        transactionId,
        transactionType,
        trx,
      } as IInventoryTransactionsDeletedPayload,
    );
    return { oldInventoryTransactions };
  }

  /**
   * Records the inventory cost lot transaction.
   * @param {InventoryCostLotTracker} inventoryLotEntry
   * @return {Promise<InventoryCostLotTracker>}
   */
  async recordInventoryCostLotTransaction(
    inventoryLotEntry: Partial<InventoryCostLotTracker>,
  ): Promise<InventoryCostLotTracker> {
    return this.inventoryCostLotTracker()
      .query()
      .insert({
        ...inventoryLotEntry,
      });
  }
}
