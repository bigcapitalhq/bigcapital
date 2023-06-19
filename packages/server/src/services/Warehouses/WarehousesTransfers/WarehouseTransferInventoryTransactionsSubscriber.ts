import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import {
  IWarehouseTransferEditedPayload,
  IWarehouseTransferDeletedPayload,
  IWarehouseTransferCreated,
  IWarehouseTransferInitiatedPayload,
  IWarehouseTransferTransferredPayload,
} from '@/interfaces';
import { WarehouseTransferInventoryTransactions } from './WriteInventoryTransactions';

@Service()
export class WarehouseTransferInventoryTransactionsSubscriber {
  @Inject()
  private warehouseTransferInventoryTransactions: WarehouseTransferInventoryTransactions;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.warehouseTransfer.onCreated,
      this.writeInventoryTransactionsOnWarehouseTransferCreated
    );
    bus.subscribe(
      events.warehouseTransfer.onEdited,
      this.rewriteInventoryTransactionsOnWarehouseTransferEdited
    );
    bus.subscribe(
      events.warehouseTransfer.onDeleted,
      this.revertInventoryTransactionsOnWarehouseTransferDeleted
    );
    bus.subscribe(
      events.warehouseTransfer.onInitiated,
      this.writeInventoryTransactionsOnTransferInitiated
    );
    bus.subscribe(
      events.warehouseTransfer.onTransferred,
      this.writeInventoryTransactionsOnTransferred
    );
    return bus;
  };

  /**
   * Writes inventory transactions once warehouse transfer created.
   * @param {IInventoryTransactionsCreatedPayload} -
   */
  private writeInventoryTransactionsOnWarehouseTransferCreated = async ({
    warehouseTransfer,
    tenantId,
    trx,
  }: IWarehouseTransferCreated) => {
    // Can't continue if the warehouse transfer is not initiated yet.
    if (!warehouseTransfer.isInitiated) return;

    // Write all inventory transaction if warehouse transfer initiated and transferred.
    if (warehouseTransfer.isInitiated && warehouseTransfer.isTransferred) {
      await this.warehouseTransferInventoryTransactions.writeAllInventoryTransactions(
        tenantId,
        warehouseTransfer,
        false,
        trx
      );
      // Write initiate inventory transaction if warehouse transfer initiated and transferred yet.
    } else if (warehouseTransfer.isInitiated) {
      await this.warehouseTransferInventoryTransactions.writeInitiateInventoryTransactions(
        tenantId,
        warehouseTransfer,
        false,
        trx
      );
    }
  };

  /**
   * Rewrite inventory transactions once warehouse transfer edited.
   * @param {IWarehouseTransferEditedPayload} -
   */
  private rewriteInventoryTransactionsOnWarehouseTransferEdited = async ({
    tenantId,
    warehouseTransfer,
    trx,
  }: IWarehouseTransferEditedPayload) => {
    // Can't continue if the warehouse transfer is not initiated yet.
    if (!warehouseTransfer.isInitiated) return;

    // Write all inventory transaction if warehouse transfer initiated and transferred.
    if (warehouseTransfer.isInitiated && warehouseTransfer.isTransferred) {
      await this.warehouseTransferInventoryTransactions.writeAllInventoryTransactions(
        tenantId,
        warehouseTransfer,
        true,
        trx
      );
      // Write initiate inventory transaction if warehouse transfer initiated and transferred yet.
    } else if (warehouseTransfer.isInitiated) {
      await this.warehouseTransferInventoryTransactions.writeInitiateInventoryTransactions(
        tenantId,
        warehouseTransfer,
        true,
        trx
      );
    }
  };

  /**
   * Reverts inventory transactions once warehouse transfer deleted.
   * @parma {IWarehouseTransferDeletedPayload} -
   */
  private revertInventoryTransactionsOnWarehouseTransferDeleted = async ({
    tenantId,
    oldWarehouseTransfer,
    trx,
  }: IWarehouseTransferDeletedPayload) => {
    await this.warehouseTransferInventoryTransactions.revertInventoryTransactions(
      tenantId,
      oldWarehouseTransfer.id,
      trx
    );
  };

  /**
   * Write inventory transactions of warehouse transfer once the transfer initiated.
   * @param {IWarehouseTransferInitiatedPayload}
   */
  private writeInventoryTransactionsOnTransferInitiated = async ({
    trx,
    warehouseTransfer,
    tenantId,
  }: IWarehouseTransferInitiatedPayload) => {
    await this.warehouseTransferInventoryTransactions.writeInitiateInventoryTransactions(
      tenantId,
      warehouseTransfer,
      false,
      trx
    );
  };

  /**
   * Write inventory transactions of warehouse transfer once the transfer completed.
   * @param {IWarehouseTransferTransferredPayload}
   */
  private writeInventoryTransactionsOnTransferred = async ({
    trx,
    warehouseTransfer,
    tenantId,
  }: IWarehouseTransferTransferredPayload) => {
    await this.warehouseTransferInventoryTransactions.writeTransferredInventoryTransactions(
      tenantId,
      warehouseTransfer,
      false,
      trx
    );
  };
}
