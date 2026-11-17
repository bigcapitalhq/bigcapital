import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  IRecurringInvoicesTenantJobPayload,
  RECURRING_INVOICES_PROCESS_TENANT_JOB,
  RECURRING_INVOICES_QUEUE,
  RECURRING_INVOICES_SCAN_JOB,
} from '../RecurringInvoice.types';

@Injectable()
export class RecurringInvoicesQueue {
  constructor(
    @InjectQueue(RECURRING_INVOICES_QUEUE)
    private readonly queue: Queue,
  ) {}

  /**
   * Registers the periodic safety scan. BullMQ deduplicates repeatable jobs
   * with the same name/pattern across application instances.
   */
  public async registerScan(): Promise<void> {
    await this.queue.add(
      RECURRING_INVOICES_SCAN_JOB,
      {},
      {
        repeat: { pattern: '*/10 * * * *' },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }

  /**
   * Enqueues an immediate processing job for one tenant.
   */
  public async enqueueTenant(
    payload: IRecurringInvoicesTenantJobPayload,
  ): Promise<void> {
    const bucket = Math.floor(Date.now() / 60000);

    await this.queue.add(RECURRING_INVOICES_PROCESS_TENANT_JOB, payload, {
      jobId: `recurring-invoices-${payload.organizationId}-${bucket}`,
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
  }
}
