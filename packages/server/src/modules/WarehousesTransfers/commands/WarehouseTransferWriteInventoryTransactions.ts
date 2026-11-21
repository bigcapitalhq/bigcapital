import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { InventoryTransactionsService } from '../../InventoryCost/commands/InventoryTransactions.service';
import { ModelObject } from 'objection';
import { IInventoryTransactionRecord } from '@/modules/InventoryCost/types/InventoryCost.types';
import { WarehouseTransfer } from '../models/WarehouseTransfer';
import { WarehouseTransferEntry } from '../models/WarehouseTransferEntry';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { BatchAllocationsBridge } from '@/modules/TransactionItemEntry/integrations/BatchAllocationsBridge';

@Injectable()
export class WarehouseTransferInventoryTransactions {
  constructor(
    private readonly inventory: InventoryTransactionsService,

    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,

    private readonly batchAllocations: BatchAllocationsBridge,
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
    const entries = warehouseTransfer.entries.map(
      (
        entry: ModelObject<WarehouseTransferEntry>,
      ): IInventoryTransactionRecord => ({
        ...commonEntry,
        entryId: entry.id,
        itemId: entry.itemId,
        quantity: entry.quantity,
        rate: entry.cost,
        direction: 'OUT',
        warehouseId: warehouseTransfer.fromWarehouseId,
      }),
    );
    return this.batchAllocations.allocateTransfer(entries, override, trx);
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
}
