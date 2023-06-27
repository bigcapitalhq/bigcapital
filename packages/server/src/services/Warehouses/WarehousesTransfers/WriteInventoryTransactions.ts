import { Knex } from 'knex';
import {
  IWarehouseTransfer,
  IInventoryTransaction,
  IWarehouseTransferEntry,
} from '@/interfaces';
import { Inject, Service } from 'typedi';
import InventoryService from '@/services/Inventory/Inventory';

@Service()
export class WarehouseTransferInventoryTransactions {
  @Inject()
  private inventory: InventoryService;

  /**
   * Writes all (initiate and transfer) inventory transactions.
   * @param   {number} tenantId
   * @param   {IWarehouseTransfer} warehouseTransfer
   * @param   {Boolean} override
   * @param   {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public writeAllInventoryTransactions = async (
    tenantId: number,
    warehouseTransfer: IWarehouseTransfer,
    override?: boolean,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const inventoryTransactions =
      this.getWarehouseTransferInventoryTransactions(warehouseTransfer);

    await this.inventory.recordInventoryTransactions(
      tenantId,
      inventoryTransactions,
      override,
      trx
    );
  };

  /**
   * Writes initiate inventory transactions of warehouse transfer transaction.
   * @param   {number} tenantId
   * @param   {IWarehouseTransfer} warehouseTransfer
   * @param   {boolean} override
   * @param   {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public writeInitiateInventoryTransactions = async (
    tenantId: number,
    warehouseTransfer: IWarehouseTransfer,
    override?: boolean,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const inventoryTransactions =
      this.getWarehouseFromTransferInventoryTransactions(warehouseTransfer);

    await this.inventory.recordInventoryTransactions(
      tenantId,
      inventoryTransactions,
      override,
      trx
    );
  };

  /**
   * Writes transferred inventory transaction of warehouse transfer transaction.
   * @param   {number} tenantId
   * @param   {IWarehouseTransfer} warehouseTransfer
   * @param   {boolean} override
   * @param   {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  public writeTransferredInventoryTransactions = async (
    tenantId: number,
    warehouseTransfer: IWarehouseTransfer,
    override?: boolean,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const inventoryTransactions =
      this.getWarehouseToTransferInventoryTransactions(warehouseTransfer);

    await this.inventory.recordInventoryTransactions(
      tenantId,
      inventoryTransactions,
      override,
      trx
    );
  };

  /**
   * Reverts warehouse transfer inventory transactions.
   * @param   {number} tenantId
   * @param   {number} warehouseTransferId
   * @param   {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public revertInventoryTransactions = async (
    tenantId: number,
    warehouseTransferId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    await this.inventory.deleteInventoryTransactions(
      tenantId,
      warehouseTransferId,
      'WarehouseTransfer',
      trx
    );
  };

  /**
   * Retrieves the inventory transactions of the given warehouse transfer.
   * @param   {IWarehouseTransfer} warehouseTransfer
   * @returns {IInventoryTransaction[]}
   */
  private getWarehouseFromTransferInventoryTransactions = (
    warehouseTransfer: IWarehouseTransfer
  ): IInventoryTransaction[] => {
    const commonEntry = {
      date: warehouseTransfer.date,
      transactionType: 'WarehouseTransfer',
      transactionId: warehouseTransfer.id,
    };
    return warehouseTransfer.entries.map((entry: IWarehouseTransferEntry) => ({
      ...commonEntry,
      entryId: entry.id,
      itemId: entry.itemId,
      quantity: entry.quantity,
      rate: entry.cost,
      direction: 'OUT',
      warehouseId: warehouseTransfer.fromWarehouseId,
    }));
  };

  /**
   *
   * @param   {IWarehouseTransfer} warehouseTransfer
   * @returns {IInventoryTransaction[]}
   */
  private getWarehouseToTransferInventoryTransactions = (
    warehouseTransfer: IWarehouseTransfer
  ): IInventoryTransaction[] => {
    const commonEntry = {
      date: warehouseTransfer.date,
      transactionType: 'WarehouseTransfer',
      transactionId: warehouseTransfer.id,
    };
    return warehouseTransfer.entries.map((entry: IWarehouseTransferEntry) => ({
      ...commonEntry,
      entryId: entry.id,
      itemId: entry.itemId,
      quantity: entry.quantity,
      rate: entry.cost,
      direction: 'IN',
      warehouseId: warehouseTransfer.toWarehouseId,
    }));
  };

  /**
   *
   * @param   {IWarehouseTransfer} warehouseTransfer
   * @returns {IInventoryTransaction[]}
   */
  private getWarehouseTransferInventoryTransactions = (
    warehouseTransfer: IWarehouseTransfer
  ): IInventoryTransaction[] => {
    // Retrieve the to inventory transactions of warehouse transfer.
    const toTransactions =
      this.getWarehouseToTransferInventoryTransactions(warehouseTransfer);

    // Retrieve the from inventory transactions of warehouse transfer.
    const fromTransactions =
      this.getWarehouseFromTransferInventoryTransactions(warehouseTransfer);

    return [...toTransactions, ...fromTransactions];
  };
}
