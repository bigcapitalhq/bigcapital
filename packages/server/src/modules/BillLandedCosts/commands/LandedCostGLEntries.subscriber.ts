import {
  IAllocatedLandedCostCreatedPayload,
  IAllocatedLandedCostDeletedPayload,
} from '../types/BillLandedCosts.types';
import { OnEvent } from '@nestjs/event-emitter';
// import { LandedCostGLEntries } from './LandedCostGLEntries.service';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';

@Injectable()
export class LandedCostGLEntriesSubscriber {
  constructor() // private readonly billLandedCostGLEntries: LandedCostGLEntries,
  {}

  /**
   * Writes GL entries once landed cost transaction created.
   * @param {IAllocatedLandedCostCreatedPayload} payload -
   */
  @OnEvent(events.billLandedCost.onCreated)
  async writeGLEntriesOnceLandedCostCreated({
    billLandedCost,
    trx,
  }: IAllocatedLandedCostCreatedPayload) {
    // await this.billLandedCostGLEntries.createLandedCostGLEntries(
    //   billLandedCost.id,
    //   trx
    // );
  }

  /**
   * Reverts GL entries associated to landed cost transaction once deleted.
   * @param {IAllocatedLandedCostDeletedPayload} payload -
   */
  @OnEvent(events.billLandedCost.onDeleted)
  async revertGLEnteriesOnceLandedCostDeleted({
    oldBillLandedCost,
    trx,
  }: IAllocatedLandedCostDeletedPayload) {
    // await this.billLandedCostGLEntries.revertLandedCostGLEntries(
    //   oldBillLandedCost.id,
    //   trx
    // );
  }
}
