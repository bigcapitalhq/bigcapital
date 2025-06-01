import { events } from '@/common/events/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IPlaidItemCreatedEventPayload,
  UpdateBankingPlaidTransitionsJob,
  UpdateBankingPlaidTransitionsQueueJob,
} from '../types/BankingPlaid.types';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class PlaidUpdateTransactionsOnItemCreatedSubscriber {
  constructor(
    @InjectQueue(UpdateBankingPlaidTransitionsQueueJob)
    private readonly updateTransitionsQueue: Queue,
  ) {}

  /**
   * Updates the Plaid item transactions
   * @param {IPlaidItemCreatedEventPayload} payload - Event payload.
   */
  @OnEvent(events.plaid.onItemCreated)
  public async handleUpdateTransactionsOnItemCreated({
    plaidItemId,
  }: IPlaidItemCreatedEventPayload) {
    const payload = { plaidItemId };

    await this.updateTransitionsQueue.add(
      UpdateBankingPlaidTransitionsJob,
      payload,
    );
  }
}
