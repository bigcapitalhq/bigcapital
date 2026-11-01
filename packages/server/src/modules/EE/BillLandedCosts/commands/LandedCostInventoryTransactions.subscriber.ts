import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IAllocatedLandedCostCreatedPayload,
  IAllocatedLandedCostDeletedPayload,
} from '../types/BillLandedCosts.types';
import { billLandedCostEvents } from '../BillLandedCosts.events';
import { LandedCostInventoryTransactions } from './LandedCostInventoryTransactions.service';

@Injectable()
export class LandedCostInventoryTransactionsSubscriber {
  constructor(
    private readonly landedCostInventory: LandedCostInventoryTransactions,
  ) {}

  /**
   * Writes inventory transactions of the landed cost transaction once created.
   * @param {IAllocatedLandedCostCreatedPayload} payload -
   */
  @OnEvent(billLandedCostEvents.onCreated)
  async writeInventoryTransactionsOnceCreated({
    billLandedCost,
    trx,
    bill,
  }: IAllocatedLandedCostCreatedPayload) {
    // Records the inventory transactions.
    await this.landedCostInventory.recordInventoryTransactions(
      billLandedCost,
      bill,
      trx,
    );
  }

  /**
   * Reverts inventory transactions of the landed cost transaction once deleted.
   * @param {IAllocatedLandedCostDeletedPayload} payload -
   */
  @OnEvent(billLandedCostEvents.onDeleted)
  async revertInventoryTransactionsOnceDeleted({
    oldBillLandedCost,
    trx,
  }: IAllocatedLandedCostDeletedPayload) {
    // Removes the inventory transactions.
    await this.landedCostInventory.removeInventoryTransactions(
      oldBillLandedCost.id,
      trx,
    );
  }
}
