import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Scope } from '@nestjs/common';
import { ClsService, UseCls } from 'nestjs-cls';
import {
  IRecurringInvoicesTenantJobPayload,
  RECURRING_INVOICES_PROCESS_TENANT_JOB,
  RECURRING_INVOICES_QUEUE,
  RECURRING_INVOICES_SCAN_JOB,
} from '../RecurringInvoice.types';
import { ScanRecurringInvoices } from '../services/ScanRecurringInvoices.service';
import { GenerateDueRecurringInvoices } from '../commands/GenerateDueRecurringInvoices.service';

@Processor({
  name: RECURRING_INVOICES_QUEUE,
  scope: Scope.REQUEST,
})
export class RecurringInvoicesProcessor extends WorkerHost {
  constructor(
    private readonly clsService: ClsService,
    private readonly scanRecurringInvoices: ScanRecurringInvoices,
    private readonly generateDueRecurringInvoices: GenerateDueRecurringInvoices,
  ) {
    super();
  }

  @UseCls()
  async process(job: Job): Promise<void> {
    if (job.name === RECURRING_INVOICES_SCAN_JOB) {
      await this.scanRecurringInvoices.scan();
      return;
    }

    if (job.name === RECURRING_INVOICES_PROCESS_TENANT_JOB) {
      const { organizationId, userId } =
        job.data as IRecurringInvoicesTenantJobPayload;

      this.clsService.set('organizationId', organizationId);
      this.clsService.set('userId', userId);

      await this.generateDueRecurringInvoices.generateDueInvoices();
    }
  }
}
