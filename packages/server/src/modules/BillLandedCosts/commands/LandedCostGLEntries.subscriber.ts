import {
  IAllocatedLandedCostCreatedPayload,
  IAllocatedLandedCostDeletedPayload,
} from '../types/BillLandedCosts.types';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { LandedCostGLEntriesService } from './LandedCostGLEntries.service';

@Injectable()
export class LandedCostGLEntriesSubscriber {
  constructor(
    private readonly landedCostGLEntries: LandedCostGLEntriesService,
  ) {}

  /**
   * Writes GL entries once landed cost transaction created.
   * @param {IAllocatedLandedCostCreatedPayload} payload -
   */
  @OnEvent(events.billLandedCost.onCreated)
  async writeGLEntriesOnceLandedCostCreated({
    billLandedCost,
    trx,
  }: IAllocatedLandedCostCreatedPayload) {
    await this.landedCostGLEntries.createLandedCostGLEntries(
      billLandedCost.id,
      trx,
    );
  }

  /**
   * Reverts GL entries associated to landed cost transaction once deleted.
   * @param {IAllocatedLandedCostDeletedPayload} payload -
   */
  @OnEvent(events.billLandedCost.onDeleted)
  async revertGLEntriesOnceLandedCostDeleted({
    oldBillLandedCost,
    trx,
  }: IAllocatedLandedCostDeletedPayload) {
    await this.landedCostGLEntries.revertLandedCostGLEntries(
      oldBillLandedCost.id,
      trx,
    );
  }
}
