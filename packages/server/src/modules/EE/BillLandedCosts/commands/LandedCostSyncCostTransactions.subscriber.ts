import { Injectable } from '@nestjs/common';
import {
  IAllocatedLandedCostCreatedPayload,
  IAllocatedLandedCostDeletedPayload,
} from '../types/BillLandedCosts.types';
import { billLandedCostEvents } from '../BillLandedCosts.events';
import { LandedCostSyncCostTransactions } from './LandedCostSyncCostTransactions.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class LandedCostSyncCostTransactionsSubscriber {
  constructor(
    private landedCostSyncCostTransaction: LandedCostSyncCostTransactions,
  ) {}

  /**
   * Increment cost transactions once the landed cost allocated.
   * @param {IAllocatedLandedCostCreatedPayload} payload -
   */
  @OnEvent(billLandedCostEvents.onCreated)
  async incrementCostTransactionsOnceCreated({
    billLandedCost,
    trx,
  }: IAllocatedLandedCostCreatedPayload) {
    // Increment landed cost amount on transaction and entry.
    await this.landedCostSyncCostTransaction.incrementLandedCostAmount(
      billLandedCost.fromTransactionType,
      billLandedCost.fromTransactionId,
      billLandedCost.fromTransactionEntryId,
      billLandedCost.amount,
      trx,
    );
  }

  /**
   * Decrement cost transactions once the allocated landed cost reverted.
   * @param {IAllocatedLandedCostDeletedPayload} payload -
   */
  @OnEvent(billLandedCostEvents.onDeleted)
  async decrementCostTransactionsOnceDeleted({
    oldBillLandedCost,
    trx,
  }: IAllocatedLandedCostDeletedPayload) {
    // Reverts the landed cost amount to the cost transaction.
    await this.landedCostSyncCostTransaction.revertLandedCostAmount(
      oldBillLandedCost.fromTransactionType,
      oldBillLandedCost.fromTransactionId,
      oldBillLandedCost.fromTransactionEntryId,
      oldBillLandedCost.amount,
      trx,
    );
  }
}
