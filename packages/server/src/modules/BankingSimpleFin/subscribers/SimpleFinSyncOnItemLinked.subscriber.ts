import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ISimpleFinItemLinkedEventPayload } from '../types/BankingSimpleFin.types';
import { SimpleFinSyncQueueService } from '../commands/SimpleFinSyncQueue.service';

@Injectable()
export class SimpleFinSyncOnItemLinkedSubscriber {
  constructor(private readonly syncQueue: SimpleFinSyncQueueService) {}

  /**
   * Triggers the initial transactions sync once accounts get linked.
   * @param {ISimpleFinItemLinkedEventPayload} payload
   */
  @OnEvent(events.simplefin.onItemLinked)
  public async handleSyncOnItemLinked({
    simplefinItemId,
  }: ISimpleFinItemLinkedEventPayload) {
    await this.syncQueue.enqueue(simplefinItemId, true);
  }
}
