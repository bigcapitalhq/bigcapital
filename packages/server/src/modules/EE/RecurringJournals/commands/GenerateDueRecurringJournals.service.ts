import { Inject, Injectable, Logger } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { FeaturesManager } from '@/modules/Features/FeaturesManager';
import { Features } from '@/common/types/Features';
import { RecurringJournal } from '../models/RecurringJournal';
import { GenerateRecurringJournal } from './GenerateRecurringJournal.service';
import { RecurringJournalStatus } from '../RecurringJournal.types';
import { getTodayDate } from '@/utils/recurrence';

export const MAX_PROFILES_PER_TENANT_RUN = 100;
export const MAX_OCCURRENCES_PER_PROFILE_RUN = 100;
export const MAX_CONSECUTIVE_FAILURES = 5;

@Injectable()
export class GenerateDueRecurringJournals {
  private readonly logger = new Logger(GenerateDueRecurringJournals.name);

  constructor(
    private readonly generateRecurringJournal: GenerateRecurringJournal,
    private readonly tenancyContext: TenancyContext,
    private readonly featuresManager: FeaturesManager,

    @Inject(RecurringJournal.name)
    private readonly recurringJournalModel: TenantModelProxy<
      typeof RecurringJournal
    >,
  ) {}

  /**
   * Generates all due recurring journals for the current tenant.
   */
  public async generateDueJournals(): Promise<void> {
    const isFeatureEnabled = await this.featuresManager.accessible(
      Features.RECURRING_JOURNALS,
    );

    if (!isFeatureEnabled) {
      return;
    }

    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const today = getTodayDate(tenantMetadata?.timezone);

    const dueProfiles = await this.recurringJournalModel()
      .query()
      .modify('due', today)
      .orderBy('next_journal_date', 'ASC')
      .limit(MAX_PROFILES_PER_TENANT_RUN);

    for (const profile of dueProfiles) {
      try {
        await this.generateRecurringJournal.generateDueJournals(
          profile.id,
          today,
          MAX_OCCURRENCES_PER_PROFILE_RUN,
        );
      } catch (error) {
        await this.handleProfileFailure(profile.id, error);
      }
    }
  }

  /**
   * Records the failure and pauses the profile after repeated failures.
   */
  private async handleProfileFailure(
    recurringJournalId: number,
    error: unknown,
  ): Promise<void> {
    const message =
      (error as any)?.message ||
      (error as any)?.errorType ||
      'Failed to generate journal.';

    this.logger.error(
      `Recurring journal ${recurringJournalId} failed: ${message}`,
      error instanceof Error ? error.stack : undefined,
    );

    const profile = await this.recurringJournalModel()
      .query()
      .findById(recurringJournalId);

    if (!profile) {
      return;
    }

    const failureCount = Number(profile.failureCount) + 1;
    const shouldPause = failureCount >= MAX_CONSECUTIVE_FAILURES;

    await this.recurringJournalModel()
      .query()
      .patchAndFetchById(recurringJournalId, {
        failureCount,
        lastError: message,
        status: shouldPause ? RecurringJournalStatus.Paused : profile.status,
      });
  }
}
