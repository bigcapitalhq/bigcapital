import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ManualJournal } from '@/modules/ManualJournals/models/ManualJournal';
import { RecurringJournal } from '../models/RecurringJournal';
import { RecurringJournalValidators } from './RecurringJournalValidators.service';
import { ERRORS, RecurringJournalStatus } from '../RecurringJournal.types';
import {
  addOccurrence,
  getFirstOccurrenceOnOrAfter,
  getTodayDate,
} from '@/utils/recurrence';

@Injectable()
export class ResumeRecurringJournal {
  constructor(
    private readonly validators: RecurringJournalValidators,
    private readonly tenancyContext: TenancyContext,
    private readonly uow: UnitOfWork,

    @Inject(RecurringJournal.name)
    private readonly recurringJournalModel: TenantModelProxy<
      typeof RecurringJournal
    >,

    @Inject(ManualJournal.name)
    private readonly manualJournalModel: TenantModelProxy<typeof ManualJournal>,
  ) {}

  /**
   * Resumes a paused recurring journal profile. Missed occurrences while
   * paused are skipped.
   */
  public async resumeRecurringJournal(
    recurringJournalId: number,
  ): Promise<RecurringJournal> {
    const recurringJournal = await this.recurringJournalModel()
      .query()
      .findById(recurringJournalId)
      .throwIfNotFound();

    this.validators.validateCanResume(recurringJournal);

    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const today = getTodayDate(tenantMetadata?.timezone);

    let nextJournalDate = getFirstOccurrenceOnOrAfter(
      recurringJournal.startDate,
      today,
      recurringJournal.frequency,
      recurringJournal.repeatInterval,
      recurringJournal.endDate,
    );

    if (!nextJournalDate) {
      throw new ServiceError(ERRORS.RECURRING_JOURNAL_END_CONDITION_REACHED);
    }

    // Skip dates that already have generated journals.
    for (let index = 0; index < 10000; index++) {
      const existingJournal = await this.manualJournalModel().query().findOne({
        recurringJournalId,
        recurringJournalDate: nextJournalDate,
      });

      if (!existingJournal) {
        break;
      }
      nextJournalDate = addOccurrence(
        nextJournalDate,
        recurringJournal.startDate,
        recurringJournal.frequency,
        recurringJournal.repeatInterval,
      );

      if (
        recurringJournal.endDate &&
        nextJournalDate > recurringJournal.endDate
      ) {
        throw new ServiceError(ERRORS.RECURRING_JOURNAL_END_CONDITION_REACHED);
      }
    }

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      return this.recurringJournalModel()
        .query(trx)
        .patchAndFetchById(recurringJournalId, {
          status: RecurringJournalStatus.Active,
          nextJournalDate,
          failureCount: 0,
          lastError: null,
        });
    });
  }
}
