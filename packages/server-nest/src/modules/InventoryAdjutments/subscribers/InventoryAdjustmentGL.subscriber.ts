import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InventoryAdjustmentsGLEntries } from '../commands/ledger/InventoryAdjustmentsGLEntries';
import { IInventoryAdjustmentEventDeletedPayload } from '../types/InventoryAdjustments.types';
import { IInventoryAdjustmentEventCreatedPayload } from '../types/InventoryAdjustments.types';
import { events } from '@/common/events/events';

@Injectable()
export class InventoryAdjustmentsGLSubscriber {
  constructor(
    private readonly inventoryAdjustmentGL: InventoryAdjustmentsGLEntries,
  ) {}

  /**
   * Handles writing increment inventory adjustment GL entries.
   */
  @OnEvent(events.inventoryAdjustment.onQuickCreated)
  @OnEvent(events.inventoryAdjustment.onPublished)
  public async handleGLEntriesOnceIncrementAdjustmentCreated({
    inventoryAdjustmentId,
    inventoryAdjustment,
    trx,
  }: IInventoryAdjustmentEventCreatedPayload) {
    // Can't continue if the inventory adjustment is not published.
    if (!inventoryAdjustment.isPublished) {
      return;
    }
    // Can't continue if the inventory adjustment direction is not `IN`.
    if (inventoryAdjustment.type !== 'increment') {
      return;
    }
    await this.inventoryAdjustmentGL.writeAdjustmentGLEntries(
      inventoryAdjustmentId,
      trx,
    );
  }

  /**
   * Reverts the inventory adjustment GL entries once the transaction deleted.
   * @param {IInventoryAdjustmentEventDeletedPayload} payload -
   */
  @OnEvent(events.inventoryAdjustment.onDeleted)
  public async revertAdjustmentGLEntriesOnceDeleted({
    inventoryAdjustmentId,
    oldInventoryAdjustment,
  }: IInventoryAdjustmentEventDeletedPayload) {
    // Can't continue if the inventory adjustment is not published.
    if (!oldInventoryAdjustment.isPublished) {
      return;
    }
    await this.inventoryAdjustmentGL.revertAdjustmentGLEntries(
      inventoryAdjustmentId,
    );
  }

  /**
   * Handles writing inventory transactions once the quick adjustment created.
   * @param {IInventoryAdjustmentEventPublishedPayload} payload
   * @param {IInventoryAdjustmentEventCreatedPayload} payload -
   */
  // private handleWriteInventoryTransactionsOncePublished = async ({
  //   inventoryAdjustment,
  //   trx,
  // }:
  //   | IInventoryAdjustmentEventPublishedPayload
  //   | IInventoryAdjustmentEventCreatedPayload) => {
  //   await this.inventoryAdjustment.writeInventoryTransactions(
  //     tenantId,
  //     inventoryAdjustment,
  //     false,
  //     trx
  //   );
  // };

  /**
   * Handles reverting invetory transactions once the inventory adjustment deleted.
   * @param {IInventoryAdjustmentEventDeletedPayload} payload -
   */
  // private handleRevertInventoryTransactionsOnceDeleted = async ({
  //   tenantId,
  //   inventoryAdjustmentId,
  //   oldInventoryAdjustment,
  //   trx,
  // }: IInventoryAdjustmentEventDeletedPayload) => {
  //   // Can't continue if the inventory adjustment is not published.
  //   if (!oldInventoryAdjustment.isPublished) {
  //     return;
  //   }
  //   // Reverts the inventory transactions of adjustment transaction.
  //   await this.inventoryAdjustment.revertInventoryTransactions(
  //     tenantId,
  //     inventoryAdjustmentId,
  //     trx
  //   );
  // };
}
