import Knex from 'knex';
import { Service, Inject } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import BaseLandedCost from './BaseLandedCost';
import { IAllocatedLandedCostDeletedPayload } from '@/interfaces';

@Service()
export default class RevertAllocatedLandedCost extends BaseLandedCost {
  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Deletes the allocated landed cost.
   * ==================================
   * - Delete bill landed cost transaction with associated allocate entries.
   * - Delete the associated inventory transactions.
   * - Decrement allocated amount of landed cost transaction and entry.
   * - Revert journal entries.
   * ----------------------------------
   * @param  {number} tenantId - Tenant id.
   * @param  {number} landedCostId - Landed cost id.
   * @return {Promise<void>}
   */
  public deleteAllocatedLandedCost = async (
    tenantId: number,
    landedCostId: number
  ): Promise<{
    landedCostId: number;
  }> => {
    // Retrieves the bill landed cost.
    const oldBillLandedCost = await this.getBillLandedCostOrThrowError(
      tenantId,
      landedCostId
    );
    //  Deletes landed cost with associated transactions.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Delete landed cost transaction with associated locate entries.
      await this.deleteLandedCost(tenantId, landedCostId, trx);

      // Triggers the event `onBillLandedCostCreated`.
      await this.eventPublisher.emitAsync(events.billLandedCost.onDeleted, {
        tenantId,
        oldBillLandedCost: oldBillLandedCost,
        billId: oldBillLandedCost.billId,
        trx,
      } as IAllocatedLandedCostDeletedPayload);

      return { landedCostId };
    });
  };

  /**
   * Deletes the landed cost transaction with associated allocate entries.
   * @param {number} tenantId - Tenant id.
   * @param {number} landedCostId - Landed cost id.
   */
  public deleteLandedCost = async (
    tenantId: number,
    landedCostId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { BillLandedCost, BillLandedCostEntry } =
      this.tenancy.models(tenantId);

    // Deletes the bill landed cost allocated entries associated to landed cost.
    await BillLandedCostEntry.query(trx)
      .where('bill_located_cost_id', landedCostId)
      .delete();

    // Delete the bill landed cost from the storage.
    await BillLandedCost.query(trx).where('id', landedCostId).delete();
  };
}
