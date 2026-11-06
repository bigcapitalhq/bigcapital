import { Inject, Injectable, Logger } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { RecurringInvoice } from '../models/RecurringInvoice';
import { GenerateRecurringInvoice } from './GenerateRecurringInvoice.service';
import { RecurringInvoiceStatus } from '../RecurringInvoice.types';
import { getTodayDate } from '../utils/recurrence';

export const MAX_PROFILES_PER_TENANT_RUN = 100;
export const MAX_OCCURRENCES_PER_PROFILE_RUN = 100;
export const MAX_CONSECUTIVE_FAILURES = 5;

@Injectable()
export class GenerateDueRecurringInvoices {
  private readonly logger = new Logger(GenerateDueRecurringInvoices.name);

  constructor(
    private readonly generateRecurringInvoice: GenerateRecurringInvoice,
    private readonly tenancyContext: TenancyContext,

    @Inject(RecurringInvoice.name)
    private readonly recurringInvoiceModel: TenantModelProxy<
      typeof RecurringInvoice
    >,
  ) {}

  /**
   * Generates all due recurring invoices for the current tenant.
   */
  public async generateDueInvoices(): Promise<void> {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const today = getTodayDate(tenantMetadata?.timezone);

    const dueProfiles = await this.recurringInvoiceModel()
      .query()
      .modify('due', today)
      .orderBy('next_invoice_date', 'ASC')
      .limit(MAX_PROFILES_PER_TENANT_RUN);

    for (const profile of dueProfiles) {
      try {
        await this.generateRecurringInvoice.generateDueInvoices(
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
    recurringInvoiceId: number,
    error: unknown,
  ): Promise<void> {
    const message =
      (error as any)?.message ||
      (error as any)?.errorType ||
      'Failed to generate invoice.';

    this.logger.error(
      `Recurring invoice ${recurringInvoiceId} failed: ${message}`,
      error instanceof Error ? error.stack : undefined,
    );

    const profile = await this.recurringInvoiceModel()
      .query()
      .findById(recurringInvoiceId);

    if (!profile) {
      return;
    }

    const failureCount = Number(profile.failureCount) + 1;
    const shouldPause = failureCount >= MAX_CONSECUTIVE_FAILURES;

    await this.recurringInvoiceModel()
      .query()
      .patchAndFetchById(recurringInvoiceId, {
        failureCount,
        lastError: message,
        status: shouldPause ? RecurringInvoiceStatus.Paused : profile.status,
      });
  }
}
