import { Service, Inject } from 'typedi';
import {
  IAllocatedLandedCostCreatedPayload,
  IAllocatedLandedCostDeletedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import LandedCostSyncCostTransactions from './LandedCostSyncCostTransactions';

@Service()
export default class LandedCostSyncCostTransactionsSubscriber {
  @Inject()
  private landedCostSyncCostTransaction: LandedCostSyncCostTransactions;

  /**
   * Attaches events with handlers.
   */
  attach(bus) {
    bus.subscribe(
      events.billLandedCost.onCreated,
      this.incrementCostTransactionsOnceCreated
    );
    bus.subscribe(
      events.billLandedCost.onDeleted,
      this.decrementCostTransactionsOnceDeleted
    );
  }

  /**
   * Increment cost transactions once the landed cost allocated.
   * @param {IAllocatedLandedCostCreatedPayload} payload -
   */
  private incrementCostTransactionsOnceCreated = async ({
    tenantId,
    billLandedCost,
    trx,
  }: IAllocatedLandedCostCreatedPayload) => {
    // Increment landed cost amount on transaction and entry.
    await this.landedCostSyncCostTransaction.incrementLandedCostAmount(
      tenantId,
      billLandedCost.fromTransactionType,
      billLandedCost.fromTransactionId,
      billLandedCost.fromTransactionEntryId,
      billLandedCost.amount,
      trx
    );
  };

  /**
   * Decrement cost transactions once the allocated landed cost reverted.
   * @param {IAllocatedLandedCostDeletedPayload} payload -
   */
  private decrementCostTransactionsOnceDeleted = async ({
    oldBillLandedCost,
    tenantId,
    trx,
  }: IAllocatedLandedCostDeletedPayload) => {
    // Reverts the landed cost amount to the cost transaction.
    await this.landedCostSyncCostTransaction.revertLandedCostAmount(
      tenantId,
      oldBillLandedCost.fromTransactionType,
      oldBillLandedCost.fromTransactionId,
      oldBillLandedCost.fromTransactionEntryId,
      oldBillLandedCost.amount,
      trx
    );
  };
}
