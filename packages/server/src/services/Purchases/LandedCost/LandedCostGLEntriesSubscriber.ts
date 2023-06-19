import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import LandedCostGLEntries from './LandedCostGLEntries';
import {
  IAllocatedLandedCostCreatedPayload,
  IAllocatedLandedCostDeletedPayload,
} from '@/interfaces';

@Service()
export default class LandedCostGLEntriesSubscriber {
  @Inject()
  billLandedCostGLEntries: LandedCostGLEntries;

  attach(bus) {
    bus.subscribe(
      events.billLandedCost.onCreated,
      this.writeGLEntriesOnceLandedCostCreated
    );
    bus.subscribe(
      events.billLandedCost.onDeleted,
      this.revertGLEntriesOnceLandedCostDeleted
    );
  }

  /**
   * Writes GL entries once landed cost transaction created.
   * @param {IAllocatedLandedCostCreatedPayload} payload -
   */
  private writeGLEntriesOnceLandedCostCreated = async ({
    tenantId,
    billLandedCost,
    trx,
  }: IAllocatedLandedCostCreatedPayload) => {
    await this.billLandedCostGLEntries.createLandedCostGLEntries(
      tenantId,
      billLandedCost.id,
      trx
    );
  };

  /**
   * Reverts GL entries associated to landed cost transaction once deleted.
   * @param {IAllocatedLandedCostDeletedPayload} payload -
   */
  private revertGLEntriesOnceLandedCostDeleted = async ({
    tenantId,
    oldBillLandedCost,
    billId,
    trx,
  }: IAllocatedLandedCostDeletedPayload) => {
    await this.billLandedCostGLEntries.revertLandedCostGLEntries(
      tenantId,
      oldBillLandedCost.id,
      trx
    );
  };
}
