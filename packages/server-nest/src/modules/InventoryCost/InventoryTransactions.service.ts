// @ts-nocheck
import { Knex } from 'knex';
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IInventoryTransactionsDeletedPayload,
  TInventoryTransactionDirection,
} from './types/InventoryCost.types';
import { InventoryCostLotTracker } from './models/InventoryCostLotTracker';
import { InventoryTransaction } from './models/InventoryTransaction';
import { events } from '@/common/events/events';
import { IInventoryTransactionsCreatedPayload } from './types/InventoryCost.types';
import { transformItemEntriesToInventory } from './utils';
import { IItemEntryTransactionType } from '../TransactionItemEntry/ItemEntry.types';
import { ItemEntry } from '../TransactionItemEntry/models/ItemEntry';

export class InventoryTransactionsService {
  constructor(
    private readonly eventEmitter: EventEmitter2,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: typeof InventoryTransaction,

    @Inject(InventoryCostLotTracker.name)
    private readonly inventoryCostLotTracker: typeof InventoryCostLotTracker,
  ) {}

  /**
   * Records the inventory transactions.
   * @param {InventoryTransaction[]} transactions - Inventory transactions.
   * @param {boolean} override - Override the existing transactions.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @return {Promise<void>}
   */
  async recordInventoryTransactions(
    transactions: InventoryTransaction[],
    override: boolean = false,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const bulkInsertOpers = [];

    transactions.forEach((transaction: InventoryTransaction) => {
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
    inventoryEntry: InventoryTransaction,
    deleteOld: boolean = false,
    trx: Knex.Transaction,
  ): Promise<InventoryTransaction> {
    if (deleteOld) {
      await this.deleteInventoryTransactions(
        inventoryEntry.transactionId,
        inventoryEntry.transactionType,
        trx,
      );
    }
    return this.inventoryTransactionModel.query(trx).insertGraph({
      ...inventoryEntry,
    });
  }

  /**
   * Records the inventory transactions from items entries that have (inventory) type.
   *
   * @param {number} tenantId
   * @param {number} transactionId
   * @param {string} transactionType
   * @param {Date|string} transactionDate
   * @param {boolean} override
   */
  async recordInventoryTransactionsFromItemsEntries(
    transaction: {
      transactionId: number;
      transactionType: IItemEntryTransactionType;
      exchangeRate: number;

      date: Date | string;
      direction: TInventoryTransactionDirection;
      entries: ItemEntry[];
      createdAt: Date | string;

      warehouseId?: number;
    },
    override: boolean = false,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Can't continue if there is no entries has inventory items in the invoice.
    if (transaction.entries.length <= 0) {
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
   * @return {Promise<{ oldInventoryTransactions: IInventoryTransaction[] }>}
   */
  public async deleteInventoryTransactions(
    transactionId: number,
    transactionType: string,
    trx?: Knex.Transaction,
  ): Promise<{ oldInventoryTransactions: InventoryTransaction[] }> {
    // Retrieve the inventory transactions of the given sale invoice.
    const oldInventoryTransactions = await this.inventoryTransactionModel
      .query(trx)
      .where({ transactionId, transactionType });

    // Deletes the inventory transactions by the given transaction type and id.
    await this.inventoryTransactionModel
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
    return this.inventoryCostLotTracker.query().insert({
      ...inventoryLotEntry,
    });
  }
}
