import { Inject, Service } from 'typedi';
import {
  IAllocatedLandedCostCreatedPayload,
  IAllocatedLandedCostDeletedPayload,
} from '@/interfaces';
import events from '@/subscribers/events';
import LandedCostInventoryTransactions from './LandedCostInventoryTransactions';

@Service()
export default class LandedCostInventoryTransactionsSubscriber {
  @Inject()
  landedCostInventory: LandedCostInventoryTransactions;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.billLandedCost.onCreated,
      this.writeInventoryTransactionsOnceCreated
    );
    bus.subscribe(
      events.billLandedCost.onDeleted,
      this.revertInventoryTransactionsOnceDeleted
    );
  }

  /**
   * Writes inventory transactions of the landed cost transaction once created.
   * @param {IAllocatedLandedCostCreatedPayload} payload -
   */
  private writeInventoryTransactionsOnceCreated = async ({
    billLandedCost,
    tenantId,
    trx,
    bill,
  }: IAllocatedLandedCostCreatedPayload) => {
    // Records the inventory transactions.
    await this.landedCostInventory.recordInventoryTransactions(
      tenantId,
      billLandedCost,
      bill,
      trx
    );
  };

  /**
   * Reverts inventory transactions of the landed cost transaction once deleted.
   * @param {IAllocatedLandedCostDeletedPayload} payload -
   */
  private revertInventoryTransactionsOnceDeleted = async ({
    tenantId,
    oldBillLandedCost,
    trx,
  }: IAllocatedLandedCostDeletedPayload) => {
    // Removes the inventory transactions.
    await this.landedCostInventory.removeInventoryTransactions(
      tenantId,
      oldBillLandedCost.id,
      trx
    );
  };
}
