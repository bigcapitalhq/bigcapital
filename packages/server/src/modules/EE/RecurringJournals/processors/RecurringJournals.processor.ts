import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Scope } from '@nestjs/common';
import { ClsService, UseCls } from 'nestjs-cls';
import {
  IRecurringJournalsTenantJobPayload,
  RECURRING_JOURNALS_PROCESS_TENANT_JOB,
  RECURRING_JOURNALS_QUEUE,
  RECURRING_JOURNALS_SCAN_JOB,
} from '../RecurringJournal.types';
import { ScanRecurringJournals } from '../services/ScanRecurringJournals.service';
import { GenerateDueRecurringJournals } from '../commands/GenerateDueRecurringJournals.service';

@Processor({
  name: RECURRING_JOURNALS_QUEUE,
  scope: Scope.REQUEST,
})
export class RecurringJournalsProcessor extends WorkerHost {
  constructor(
    private readonly clsService: ClsService,
    private readonly scanRecurringJournals: ScanRecurringJournals,
    private readonly generateDueRecurringJournals: GenerateDueRecurringJournals,
  ) {
    super();
  }

  @UseCls()
  async process(job: Job): Promise<void> {
    if (job.name === RECURRING_JOURNALS_SCAN_JOB) {
      await this.scanRecurringJournals.scan();
      return;
    }

    if (job.name === RECURRING_JOURNALS_PROCESS_TENANT_JOB) {
      const { organizationId, userId } =
        job.data as IRecurringJournalsTenantJobPayload;

      this.clsService.set('organizationId', organizationId);
      this.clsService.set('userId', userId);

      await this.generateDueRecurringJournals.generateDueJournals();
    }
  }
}
