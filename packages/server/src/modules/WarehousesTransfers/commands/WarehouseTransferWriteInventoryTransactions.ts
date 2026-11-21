import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { InventoryTransactionsService } from '../../InventoryCost/commands/InventoryTransactions.service';
import { ModelObject } from 'objection';
import { IInventoryTransactionRecord } from '@/modules/InventoryCost/types/InventoryCost.types';
import { WarehouseTransfer } from '../models/WarehouseTransfer';
import { WarehouseTransferEntry } from '../models/WarehouseTransferEntry';
import { Inject } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { BatchWarehouseBalance } from '@/modules/EE/Batches/models/BatchWarehouseBalance';
import { Batch } from '@/modules/EE/Batches/models/Batch';
import { ServiceError } from '@/modules/Items/ServiceError';
import { BATCHES_ERRORS } from '@/modules/EE/Batches/types/Batches.types';

@Injectable()
export class WarehouseTransferInventoryTransactions {
  constructor(
    private readonly inventory: InventoryTransactionsService,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,

    @Inject(BatchWarehouseBalance.name)
    private readonly batchWarehouseBalanceModel: TenantModelProxy<
      typeof BatchWarehouseBalance
    >,

    @Inject(Batch.name)
    private readonly batchModel: TenantModelProxy<typeof Batch>,
  ) {}

  /**
   * Writes all (initiate and transfer) inventory transactions.
   * @param {ModelObject<WarehouseTransfer>} warehouseTransfer - Warehouse transfer.
   * @param {Boolean} override - Override the inventory transactions.
   * @param {Knex.Transaction} trx - Knex transcation.
   * @returns {Promise<void>}
   */
  public writeAllInventoryTransactions = async (
    warehouseTransfer: ModelObject<WarehouseTransfer>,
    override?: boolean,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const fromTransactions =
      await this.getWarehouseFromTransferInventoryTransactions(
        warehouseTransfer,
        trx,
        override,
      );
    const toTransactions = fromTransactions.map((transaction) => ({
      ...transaction,
      direction: 'IN' as const,
      warehouseId: warehouseTransfer.toWarehouseId,
    }));

    await this.inventory.recordInventoryTransactions(
      [...toTransactions, ...fromTransactions],
      override,
      trx,
    );
  };

  /**
   * Writes initiate inventory transactions of warehouse transfer transaction.
   * @param {ModelObject<WarehouseTransfer>} warehouseTransfer - Warehouse transfer.
   * @param {boolean} override - Override the inventory transactions.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public writeInitiateInventoryTransactions = async (
    warehouseTransfer: ModelObject<WarehouseTransfer>,
    override?: boolean,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const inventoryTransactions =
      await this.getWarehouseFromTransferInventoryTransactions(
        warehouseTransfer,
        trx,
        override,
      );

    await this.inventory.recordInventoryTransactions(
      inventoryTransactions,
      override,
      trx,
    );
  };

  /**
   * Writes transferred inventory transaction of warehouse transfer transaction.
   * @param   {ModelObject<WarehouseTransfer>} warehouseTransfer - Warehouse transfer.
   * @param   {boolean} override - Override the inventory transactions.
   * @param   {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public writeTransferredInventoryTransactions = async (
    warehouseTransfer: ModelObject<WarehouseTransfer>,
    override?: boolean,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const inventoryTransactions =
      await this.getWarehouseToTransferInventoryTransactions(
        warehouseTransfer,
        trx,
      );

    await this.inventory.recordInventoryTransactions(
      inventoryTransactions,
      override,
      trx,
    );
  };

  /**
   * Reverts warehouse transfer inventory transactions.
   * @param   {number} warehouseTransferId - Warehouse transfer id.
   * @param   {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public revertInventoryTransactions = async (
    warehouseTransferId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    await this.inventory.deleteInventoryTransactions(
      warehouseTransferId,
      'WarehouseTransfer',
      trx,
    );
  };

  /**
   * Retrieves the inventory transactions of the given warehouse transfer.
   * @param   {IWarehouseTransfer} warehouseTransfer
   * @returns {IInventoryTransaction[]}
   */
  private getWarehouseFromTransferInventoryTransactions = async (
    warehouseTransfer: ModelObject<WarehouseTransfer>,
    trx?: Knex.Transaction,
    override?: boolean,
  ): Promise<IInventoryTransactionRecord[]> => {
    const commonEntry = {
      date: warehouseTransfer.date,
      transactionType: 'WarehouseTransfer',
      transactionId: warehouseTransfer.id,
    };
    const transactions: IInventoryTransactionRecord[] = [];
    for (const entry of warehouseTransfer.entries as ModelObject<WarehouseTransferEntry>[]) {
      const allocations = await this.getBatchAllocations(
        Number(entry.itemId),
        Number(warehouseTransfer.fromWarehouseId),
        Number(entry.quantity),
        trx,
        override ? Number(warehouseTransfer.id) : undefined,
      );
      if (!allocations) {
        transactions.push({
          ...commonEntry,
          entryId: entry.id,
          itemId: entry.itemId,
          quantity: entry.quantity,
          rate: entry.cost,
          direction: 'OUT',
          warehouseId: warehouseTransfer.fromWarehouseId,
        });
        continue;
      }
      allocations.forEach((allocation) => {
        transactions.push({
          ...commonEntry,
          entryId: entry.id,
          itemId: entry.itemId,
          quantity: allocation.quantity,
          rate: entry.cost,
          direction: 'OUT',
          warehouseId: warehouseTransfer.fromWarehouseId,
          batchId: allocation.batchId,
        });
      });
    }
    return transactions;
  };

  /**
   * Retrieves the inventory transactions of the given warehouse transfer.
   * @param   {ModelObject<WarehouseTransfer>} warehouseTransfer - Warehouse transfer.
   * @returns {IInventoryTransaction[]}
   */
  private getWarehouseToTransferInventoryTransactions = async (
    warehouseTransfer: ModelObject<WarehouseTransfer>,
    trx?: Knex.Transaction,
  ): Promise<IInventoryTransactionRecord[]> => {
    const commonEntry = {
      date: warehouseTransfer.date,
      transactionType: 'WarehouseTransfer',
      transactionId: warehouseTransfer.id,
    };
    const sourceTransactions = await this.inventoryTransactionModel()
      .query(trx)
      .where({
        transactionType: 'WarehouseTransfer',
        transactionId: warehouseTransfer.id,
        direction: 'OUT',
      });
    return sourceTransactions.map((transaction) => ({
      ...commonEntry,
      entryId: transaction.entryId,
      itemId: transaction.itemId,
      quantity: transaction.quantity,
      rate: transaction.rate,
      direction: 'IN',
      warehouseId: warehouseTransfer.toWarehouseId,
      batchId: transaction.batchId,
    }));
  };

  /** Allocates tracked stock by earliest expiry date. Returns undefined when
   * the item has no batch balances in the source warehouse. */
  private getBatchAllocations = async (
    itemId: number,
    warehouseId: number,
    quantity: number,
    trx?: Knex.Transaction,
    restoreTransactionId?: number,
  ): Promise<Array<{ batchId: number; quantity: number }> | undefined> => {
    const previousTransactions = restoreTransactionId
      ? await this.inventoryTransactionModel().query(trx).where({
          transactionType: 'WarehouseTransfer',
          transactionId: restoreTransactionId,
          direction: 'OUT',
        })
      : [];
    const balances = await this.batchWarehouseBalanceModel()
      .query(trx)
      .where('warehouseId', warehouseId)
      .where('quantityOnHand', '>', 0);
    const batchIds = [
      ...new Set([
        ...balances.map((balance) => Number(balance.batchId)),
        ...previousTransactions
          .map((transaction) => Number(transaction.batchId))
          .filter(Boolean),
      ]),
    ];
    const batches = await this.batchModel()
      .query(trx)
      .where('itemId', itemId)
      .whereIn('id', batchIds);
    if (batches.length === 0) return undefined;

    const balanceByBatch = new Map(
      balances.map((balance) => [
        Number(balance.batchId),
        Number(balance.quantityOnHand),
      ]),
    );
    previousTransactions.forEach((transaction) => {
      if (transaction.batchId) {
        const batchId = Number(transaction.batchId);
        balanceByBatch.set(
          batchId,
          (balanceByBatch.get(batchId) ?? 0) +
            Number(transaction.quantity ?? 0),
        );
      }
    });
    batches.sort((a, b) => {
      if (!a.expiryDate && !b.expiryDate) return a.id - b.id;
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return (
        new Date(String(a.expiryDate)).getTime() -
          new Date(String(b.expiryDate)).getTime() || a.id - b.id
      );
    });

    let remaining = quantity;
    const allocations = [];
    for (const batch of batches) {
      const available = balanceByBatch.get(batch.id) ?? 0;
      const allocated = Math.min(available, remaining);
      if (allocated > 0) {
        allocations.push({ batchId: batch.id, quantity: allocated });
        remaining = Number((remaining - allocated).toFixed(3));
      }
      if (remaining <= 0.0001) break;
    }
    if (remaining > 0.0001) {
      throw new ServiceError(
        BATCHES_ERRORS.BATCH_INSUFFICIENT_QUANTITY,
        undefined,
        {
          itemId,
          warehouseId,
          requestedQuantity: quantity,
          availableQuantity: quantity - remaining,
        },
      );
    }
    return allocations;
  };
}
