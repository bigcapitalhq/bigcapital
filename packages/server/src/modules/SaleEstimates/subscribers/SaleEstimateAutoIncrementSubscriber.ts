import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { SaleEstimateIncrement } from '../commands/SaleEstimateIncrement.service';
import { ISaleEstimateCreatedPayload } from '../types/SaleEstimates.types';

@Injectable()
export class SaleEstimateAutoIncrementSubscriber {
  constructor(private readonly estimateIncrement: SaleEstimateIncrement) { }

  /**
   * Handles increment next number of estimate once be created.
   * @param {ISaleEstimateCreatedPayload} payload -
   */
  @OnEvent(events.saleEstimate.onCreated)
  private async handleEstimateNextNumberIncrement({ }: ISaleEstimateCreatedPayload) {
    await this.estimateIncrement.incrementNextEstimateNumber();
  }
}
