import { Knex } from 'knex';
import { IWarehouseTransferEntry } from '@/modules/Warehouses/Warehouse.types';
import { Injectable } from '@nestjs/common';
import { InventoryTransactionsService } from '../../InventoryCost/commands/InventoryTransactions.service';
import { ModelObject } from 'objection';
import { WarehouseTransfer } from '../models/WarehouseTransfer';
import { InventoryTransaction } from '../../InventoryCost/models/InventoryTransaction';
import { WarehouseTransferEntry } from '../models/WarehouseTransferEntry';

@Injectable()
export class WarehouseTransferInventoryTransactions {
  constructor(private readonly inventory: InventoryTransactionsService) {}

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
    const inventoryTransactions =
      this.getWarehouseTransferInventoryTransactions(warehouseTransfer);

    await this.inventory.recordInventoryTransactions(
      inventoryTransactions,
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
      this.getWarehouseFromTransferInventoryTransactions(warehouseTransfer);

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
      this.getWarehouseToTransferInventoryTransactions(warehouseTransfer);

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
  private getWarehouseFromTransferInventoryTransactions = (
    warehouseTransfer: ModelObject<WarehouseTransfer>,
  ) => {
    const commonEntry = {
      date: warehouseTransfer.date,
      transactionType: 'WarehouseTransfer',
      transactionId: warehouseTransfer.id,
    };
    return warehouseTransfer.entries.map(
      (entry: ModelObject<WarehouseTransferEntry>) => ({
        ...commonEntry,
        entryId: entry.id,
        itemId: entry.itemId,
        quantity: entry.quantity,
        rate: entry.cost,
        direction: 'OUT',
        warehouseId: warehouseTransfer.fromWarehouseId,
      }),
    );
  };

  /**
   * Retrieves the inventory transactions of the given warehouse transfer.
   * @param   {ModelObject<WarehouseTransfer>} warehouseTransfer - Warehouse transfer.
   * @returns {IInventoryTransaction[]}
   */
  private getWarehouseToTransferInventoryTransactions = (
    warehouseTransfer: ModelObject<WarehouseTransfer>,
  ) => {
    const commonEntry = {
      date: warehouseTransfer.date,
      transactionType: 'WarehouseTransfer',
      transactionId: warehouseTransfer.id,
    };
    return warehouseTransfer.entries.map(
      (entry: ModelObject<WarehouseTransferEntry>) => ({
        ...commonEntry,
        entryId: entry.id,
        itemId: entry.itemId,
        quantity: entry.quantity,
        rate: entry.cost,
        direction: 'IN',
        warehouseId: warehouseTransfer.toWarehouseId,
      }),
    );
  };

  /**
   * Retrieves the inventory transactions of the given warehouse transfer.
   * @param {ModelObject<WarehouseTransfer>} warehouseTransfer - Warehouse transfer.
   * @returns {IInventoryTransaction[]}
   */
  private getWarehouseTransferInventoryTransactions = (
    warehouseTransfer: ModelObject<WarehouseTransfer>,
  ) => {
    // Retrieve the to inventory transactions of warehouse transfer.
    const toTransactions =
      this.getWarehouseToTransferInventoryTransactions(warehouseTransfer);

    // Retrieve the from inventory transactions of warehouse transfer.
    const fromTransactions =
      this.getWarehouseFromTransferInventoryTransactions(warehouseTransfer);

    return [...toTransactions, ...fromTransactions];
  };
}
