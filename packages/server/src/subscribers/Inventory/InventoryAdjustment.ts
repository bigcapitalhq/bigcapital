import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import InventoryAdjustmentService from '@/services/Inventory/InventoryAdjustmentService';
import InventoryAdjustmentsGL from '@/services/Inventory/InventoryAdjustmentGL';
import {
  IInventoryAdjustmentEventCreatedPayload,
  IInventoryAdjustmentEventDeletedPayload,
  IInventoryAdjustmentEventPublishedPayload,
} from '@/interfaces';

@Service()
export default class InventoryAdjustmentsSubscriber {
  @Inject()
  private inventoryAdjustment: InventoryAdjustmentService;

  @Inject()
  private inventoryAdjustmentGL: InventoryAdjustmentsGL;

  /**
   * Attaches events with handles.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(
      events.inventoryAdjustment.onQuickCreated,
      this.handleWriteInventoryTransactionsOncePublished
    );
    bus.subscribe(
      events.inventoryAdjustment.onQuickCreated,
      this.handleGLEntriesOnceIncrementAdjustmentCreated
    );
    bus.subscribe(
      events.inventoryAdjustment.onPublished,
      this.handleGLEntriesOnceIncrementAdjustmentCreated
    );
    bus.subscribe(
      events.inventoryAdjustment.onPublished,
      this.handleWriteInventoryTransactionsOncePublished
    );
    bus.subscribe(
      events.inventoryAdjustment.onDeleted,
      this.handleRevertInventoryTransactionsOnceDeleted
    );
    bus.subscribe(
      events.inventoryAdjustment.onDeleted,
      this.revertAdjustmentGLEntriesOnceDeleted
    );
  }

  /**
   * Handles writing increment inventory adjustment GL entries.
   */
  private handleGLEntriesOnceIncrementAdjustmentCreated = async ({
    tenantId,
    inventoryAdjustmentId,
    inventoryAdjustment,
    trx,
  }: IInventoryAdjustmentEventCreatedPayload) => {
    // Can't continue if the inventory adjustment is not published.
    if (!inventoryAdjustment.isPublished) {
      return;
    }
    // Can't continue if the inventory adjustment direction is not `IN`.
    if (inventoryAdjustment.type !== 'increment') {
      return;
    }
    await this.inventoryAdjustmentGL.writeAdjustmentGLEntries(
      tenantId,
      inventoryAdjustmentId,
      trx
    );
  };

  /**
   * Handles writing inventory transactions once the quick adjustment created.
   * @param {IInventoryAdjustmentEventPublishedPayload} payload
   * @param {IInventoryAdjustmentEventCreatedPayload} payload -
   */
  private handleWriteInventoryTransactionsOncePublished = async ({
    tenantId,
    inventoryAdjustment,
    trx,
  }:
    | IInventoryAdjustmentEventPublishedPayload
    | IInventoryAdjustmentEventCreatedPayload) => {
    await this.inventoryAdjustment.writeInventoryTransactions(
      tenantId,
      inventoryAdjustment,
      false,
      trx
    );
  };

  /**
   * Handles reverting inventory transactions once the inventory adjustment deleted.
   * @param {IInventoryAdjustmentEventDeletedPayload} payload -
   */
  private handleRevertInventoryTransactionsOnceDeleted = async ({
    tenantId,
    inventoryAdjustmentId,
    oldInventoryAdjustment,
    trx,
  }: IInventoryAdjustmentEventDeletedPayload) => {
    // Can't continue if the inventory adjustment is not published.
    if (!oldInventoryAdjustment.isPublished) {
      return;
    }
    // Reverts the inventory transactions of adjustment transaction.
    await this.inventoryAdjustment.revertInventoryTransactions(
      tenantId,
      inventoryAdjustmentId,
      trx
    );
  };

  /**
   * Reverts the inventory adjustment GL entries once the transaction deleted.
   * @param {IInventoryAdjustmentEventDeletedPayload} payload -
   */
  private revertAdjustmentGLEntriesOnceDeleted = async ({
    tenantId,
    inventoryAdjustmentId,
    oldInventoryAdjustment,
  }: IInventoryAdjustmentEventDeletedPayload) => {
    // Can't continue if the inventory adjustment is not published.
    if (!oldInventoryAdjustment.isPublished) {
      return;
    }
    await this.inventoryAdjustmentGL.revertAdjustmentGLEntries(
      tenantId,
      inventoryAdjustmentId
    );
  };
}
