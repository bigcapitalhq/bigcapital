import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InventoryAdjustmentsGLEntries } from '../commands/ledger/InventoryAdjustmentsGLEntries';
import {
  IInventoryAdjustmentDeletingPayload,
  IInventoryAdjustmentEventPublishedPayload,
} from '../types/InventoryAdjustments.types';
import { IInventoryAdjustmentEventCreatedPayload } from '../types/InventoryAdjustments.types';
import { events } from '@/common/events/events';

@Injectable()
export class InventoryAdjustmentsGLSubscriber {
  constructor(
    private readonly inventoryAdjustmentGL: InventoryAdjustmentsGLEntries,
  ) {}

  /**
   * Handles writing increment inventory adjustment GL entries.
   * @param {IInventoryAdjustmentEventCreatedPayload} payload - 
   */
  @OnEvent(events.inventoryAdjustment.onQuickCreated)
  @OnEvent(events.inventoryAdjustment.onPublished)
  async handleGLEntriesOnceIncrementAdjustmentCreated({
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
   * @param {IInventoryAdjustmentDeletingPayload} payload -
   */
  @OnEvent(events.inventoryAdjustment.onDeleting)
  async revertAdjustmentGLEntriesOnceDeleted({
    inventoryAdjustment,
    trx,
  }: IInventoryAdjustmentDeletingPayload) {
    // Can't continue if the inventory adjustment is not published.
    if (!inventoryAdjustment.isPublished) {
      return;
    }
    await this.inventoryAdjustmentGL.revertAdjustmentGLEntries(
      inventoryAdjustment.id,
      trx,
    );
  }

  /**
   * Handles writing inventory transactions once the quick adjustment created.
   * @param {IInventoryAdjustmentEventPublishedPayload} payload
   * @param {IInventoryAdjustmentEventCreatedPayload} payload -
   */
  @OnEvent(events.inventoryAdjustment.onPublished)
  async handleWriteInventoryTransactionsOncePublished({
    inventoryAdjustmentId,
    trx,
  }:
    | IInventoryAdjustmentEventPublishedPayload
    | IInventoryAdjustmentEventCreatedPayload) {
    await this.inventoryAdjustmentGL.writeAdjustmentGLEntries(
      inventoryAdjustmentId,
      trx,
    );
  }
}
