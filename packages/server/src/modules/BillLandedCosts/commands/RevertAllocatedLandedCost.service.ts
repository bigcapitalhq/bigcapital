import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseLandedCostService } from '../BaseLandedCost.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { IAllocatedLandedCostDeletedPayload } from '../types/BillLandedCosts.types';
import { BillLandedCostEntry } from '../models/BillLandedCostEntry';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class RevertAllocatedLandedCost extends BaseLandedCostService {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(BillLandedCostEntry.name)
    private readonly billLandedCostEntryModel: TenantModelProxy<
      typeof BillLandedCostEntry
    >,
  ) {
    super();
  }

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
  public async deleteAllocatedLandedCost(landedCostId: number): Promise<{
    landedCostId: number;
  }> {
    // Retrieves the bill landed cost.
    const oldBillLandedCost =
      await this.getBillLandedCostOrThrowError(landedCostId);
    //  Deletes landed cost with associated transactions.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Delete landed cost transaction with associated locate entries.
      await this.deleteLandedCost(landedCostId, trx);

      // Triggers the event `onBillLandedCostCreated`.
      await this.eventPublisher.emitAsync(events.billLandedCost.onDeleted, {
        oldBillLandedCost: oldBillLandedCost,
        billId: oldBillLandedCost.billId,
        trx,
      } as IAllocatedLandedCostDeletedPayload);

      return { landedCostId };
    });
  }

  /**
   * Deletes the landed cost transaction with associated allocate entries.
   * @param {number} landedCostId - Landed cost id.
   */
  public deleteLandedCost = async (
    landedCostId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    // Deletes the bill landed cost allocated entries associated to landed cost.
    await this.billLandedCostEntryModel()
      .query(trx)
      .where('bill_located_cost_id', landedCostId)
      .delete();

    // Delete the bill landed cost from the storage.
    await this.billLandedCostModel()
      .query(trx)
      .where('id', landedCostId)
      .delete();
  };
}
