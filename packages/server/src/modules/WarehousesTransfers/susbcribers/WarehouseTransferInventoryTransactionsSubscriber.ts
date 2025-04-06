import {
  IWarehouseTransferEditedPayload,
  IWarehouseTransferDeletedPayload,
  IWarehouseTransferCreated,
  IWarehouseTransferInitiatedPayload,
  IWarehouseTransferTransferredPayload,
} from '@/modules/Warehouses/Warehouse.types';
import { WarehouseTransferInventoryTransactions } from '../commands/WarehouseTransferWriteInventoryTransactions';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WarehouseTransferInventoryTransactionsSubscriber {
  constructor(
    private readonly warehouseTransferInventoryTransactions: WarehouseTransferInventoryTransactions,
  ) {}

  /**
   * Writes inventory transactions once warehouse transfer created.
   * @param {IInventoryTransactionsCreatedPayload} -
   */
  @OnEvent(events.warehouseTransfer.onCreated)
  async writeInventoryTransactionsOnWarehouseTransferCreated({
    warehouseTransfer,
    trx,
  }: IWarehouseTransferCreated) {
    // Can't continue if the warehouse transfer is not initiated yet.
    if (!warehouseTransfer.isInitiated) return;

    // Write all inventory transaction if warehouse transfer initiated and transferred.
    if (warehouseTransfer.isInitiated && warehouseTransfer.isTransferred) {
      await this.warehouseTransferInventoryTransactions.writeAllInventoryTransactions(
        warehouseTransfer,
        false,
        trx,
      );
      // Write initiate inventory transaction if warehouse transfer initited and transferred yet.
    } else if (warehouseTransfer.isInitiated) {
      await this.warehouseTransferInventoryTransactions.writeInitiateInventoryTransactions(
        warehouseTransfer,
        false,
        trx,
      );
    }
  }

  /**
   * Rewrite inventory transactions once warehouse transfer edited.
   * @param {IWarehouseTransferEditedPayload} -
   */
  @OnEvent(events.warehouseTransfer.onEdited)
  async rewriteInventoryTransactionsOnWarehouseTransferEdited({
    warehouseTransfer,
    trx,
  }: IWarehouseTransferEditedPayload) {
    // Can't continue if the warehouse transfer is not initiated yet.
    if (!warehouseTransfer.isInitiated) return;

    // Write all inventory transaction if warehouse transfer initiated and transferred.
    if (warehouseTransfer.isInitiated && warehouseTransfer.isTransferred) {
      await this.warehouseTransferInventoryTransactions.writeAllInventoryTransactions(
        warehouseTransfer,
        true,
        trx,
      );
      // Write initiate inventory transaction if warehouse transfer initited and transferred yet.
    } else if (warehouseTransfer.isInitiated) {
      await this.warehouseTransferInventoryTransactions.writeInitiateInventoryTransactions(
        warehouseTransfer,
        true,
        trx,
      );
    }
  }

  /**
   * Reverts inventory transactions once warehouse transfer deleted.
   * @parma {IWarehouseTransferDeletedPayload} -
   */
  @OnEvent(events.warehouseTransfer.onDeleted)
  async revertInventoryTransactionsOnWarehouseTransferDeleted({
    oldWarehouseTransfer,
    trx,
  }: IWarehouseTransferDeletedPayload) {
    await this.warehouseTransferInventoryTransactions.revertInventoryTransactions(
      oldWarehouseTransfer.id,
      trx,
    );
  }

  /**
   * Write inventory transactions of warehouse transfer once the transfer initiated.
   * @param {IWarehouseTransferInitiatedPayload}
   */
  @OnEvent(events.warehouseTransfer.onInitiated)
  async writeInventoryTransactionsOnTransferInitiated({
    trx,
    warehouseTransfer,
  }: IWarehouseTransferInitiatedPayload) {
    await this.warehouseTransferInventoryTransactions.writeInitiateInventoryTransactions(
      warehouseTransfer,
      false,
      trx,
    );
  }

  /**
   * Write inventory transactions of warehouse transfer once the transfer completed.
   * @param {IWarehouseTransferTransferredPayload}
   */
  @OnEvent(events.warehouseTransfer.onTransferred)
  async writeInventoryTransactionsOnTransferred({
    trx,
    warehouseTransfer,
  }: IWarehouseTransferTransferredPayload) {
    await this.warehouseTransferInventoryTransactions.writeTransferredInventoryTransactions(
      warehouseTransfer,
      false,
      trx,
    );
  }
}
