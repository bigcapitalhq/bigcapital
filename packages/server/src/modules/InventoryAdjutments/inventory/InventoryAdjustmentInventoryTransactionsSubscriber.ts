import { Injectable } from '@nestjs/common';
import {
  IInventoryAdjustmentEventCreatedPayload,
  IInventoryAdjustmentEventPublishedPayload,
} from '../types/InventoryAdjustments.types';
import { IInventoryAdjustmentEventDeletedPayload } from '../types/InventoryAdjustments.types';
import { InventoryAdjustmentInventoryTransactions } from './InventoryAdjustmentInventoryTransactions';
import { events } from '@/common/events/events';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class InventoryAdjustmentInventoryTransactionsSubscriber {
  constructor(
    private readonly inventoryTransactions: InventoryAdjustmentInventoryTransactions,
  ) {}

  /**
   * Handles writing inventory transactions once the adjustment is published
   * (either created as published, or published later from draft).
   * @param {IInventoryAdjustmentEventPublishedPayload} payload
   * @param {IInventoryAdjustmentEventCreatedPayload} payload -
   */
  @OnEvent(events.inventoryAdjustment.onQuickCreated)
  @OnEvent(events.inventoryAdjustment.onPublished)
  public async handleWriteInventoryTransactionsOncePublished({
    inventoryAdjustment,
    trx,
  }:
    | IInventoryAdjustmentEventPublishedPayload
    | IInventoryAdjustmentEventCreatedPayload) {
    // Draft adjustments must not change on-hand quantity until published;
    // otherwise deleting an unpublished draft skips revert and leaves qty wrong.
    if (!inventoryAdjustment.isPublished) {
      return;
    }

    await this.inventoryTransactions.writeInventoryTransactions(
      inventoryAdjustment,
      false,
      trx,
    );
  }

  /**
   * Handles reverting invetory transactions once the inventory adjustment deleted.
   * @param {IInventoryAdjustmentEventDeletedPayload} payload -
   */
  @OnEvent(events.inventoryAdjustment.onDeleted)
  public async handleRevertInventoryTransactionsOnceDeleted({
    inventoryAdjustmentId,
    oldInventoryAdjustment,
    trx,
  }: IInventoryAdjustmentEventDeletedPayload) {
    // Can't continue if the inventory adjustment is not published.
    if (!oldInventoryAdjustment.isPublished) {
      return;
    }
    // Reverts the inventory transactions of adjustment transaction.
    await this.inventoryTransactions.revertInventoryTransactions(
      inventoryAdjustmentId,
      trx,
    );
  }
}
