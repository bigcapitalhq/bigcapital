import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  SimpleFinSyncJob,
  SimpleFinSyncJobPayload,
  SimpleFinSyncQueue,
} from '../types/BankingSimpleFin.types';

@Injectable()
export class SimpleFinSyncQueueService {
  constructor(
    @InjectQueue(SimpleFinSyncQueue)
    private readonly syncQueue: Queue,
  ) {}

  /**
   * Enqueues a sync job for the given SimpleFIN item. Jobs are de-duplicated
   * by the item id so overlapping triggers (manual refresh, schedule, link)
   * coalesce into a single in-flight sync.
   * @param {string} simplefinItemId
   * @param {boolean} force - Skip the scheduled interval check.
   */
  public async enqueue(
    simplefinItemId: string,
    force: boolean = false,
  ): Promise<void> {
    const payload: SimpleFinSyncJobPayload = { simplefinItemId, force };

    await this.syncQueue.add(SimpleFinSyncJob, payload, {
      jobId: `${simplefinItemId}${force ? ':force' : ''}`,
    });
  }
}
