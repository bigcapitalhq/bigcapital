import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { omit } from 'lodash';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { RecurringJournal } from '../models/RecurringJournal';
import { EditRecurringJournalDto } from '../dtos/RecurringJournal.dto';
import { RecurringJournalDTOTransformer } from './RecurringJournalDTOTransformer.service';
import { RecurringJournalValidators } from './RecurringJournalValidators.service';
import { RecurringJournalStatus } from '../RecurringJournal.types';
import {
  getFirstOccurrenceOnOrAfter,
  getTodayDate,
  isScheduleExhausted,
} from '@/utils/recurrence';

@Injectable()
export class EditRecurringJournal {
  constructor(
    private readonly validators: RecurringJournalValidators,
    private readonly transformerDTO: RecurringJournalDTOTransformer,
    private readonly tenancyContext: TenancyContext,
    private readonly uow: UnitOfWork,

    @Inject(RecurringJournal.name)
    private readonly recurringJournalModel: TenantModelProxy<
      typeof RecurringJournal
    >,
  ) {}

  /**
   * Edits the given recurring journal profile. Changes apply to future
   * generated journals only.
   */
  public async editRecurringJournal(
    recurringJournalId: number,
    recurringJournalDTO: EditRecurringJournalDto,
  ): Promise<RecurringJournal> {
    this.validators.validateProfileName(recurringJournalDTO.profileName);
    this.validators.validateDateRange(
      recurringJournalDTO.startDate,
      recurringJournalDTO.endDate,
    );
    await this.validators.validateAutoIncrement();

    const oldRecurringJournal = await this.recurringJournalModel()
      .query()
      .findById(recurringJournalId)
      .withGraphFetched('entries')
      .throwIfNotFound();

    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const today = getTodayDate(tenantMetadata?.timezone);

    await this.validators.validateEntries(
      recurringJournalDTO,
      tenantMetadata?.baseCurrency,
    );

    const scheduleChanged =
      oldRecurringJournal.startDate !== recurringJournalDTO.startDate ||
      oldRecurringJournal.frequency !== recurringJournalDTO.frequency ||
      Number(oldRecurringJournal.repeatInterval) !==
        Number(recurringJournalDTO.repeatInterval || 1);

    const previousStatus = oldRecurringJournal.status;
    let status = previousStatus;
    let nextJournalDate = oldRecurringJournal.nextJournalDate;

    if (previousStatus !== RecurringJournalStatus.Paused) {
      if (
        previousStatus === RecurringJournalStatus.Completed ||
        scheduleChanged ||
        !nextJournalDate ||
        nextJournalDate < today
      ) {
        nextJournalDate = getFirstOccurrenceOnOrAfter(
          recurringJournalDTO.startDate,
          today,
          recurringJournalDTO.frequency,
          recurringJournalDTO.repeatInterval || 1,
          recurringJournalDTO.endDate,
        );
      }

      if (!nextJournalDate) {
        status = RecurringJournalStatus.Completed;
      } else {
        status = RecurringJournalStatus.Active;
      }
    }

    const recurringJournalObj = await this.transformerDTO.transformDTOToModel(
      recurringJournalDTO,
      nextJournalDate,
      status,
    );

    // Preserve the creation metadata and generation counters on edit.
    recurringJournalObj.userId = oldRecurringJournal.userId;
    recurringJournalObj.branchId =
      recurringJournalDTO.branchId ?? oldRecurringJournal.branchId;
    recurringJournalObj.occurrencesCount = oldRecurringJournal.occurrencesCount;
    recurringJournalObj.lastJournalDate = oldRecurringJournal.lastJournalDate;
    recurringJournalObj.failureCount = 0;
    recurringJournalObj.lastError = null;

    if (
      status === RecurringJournalStatus.Active &&
      isScheduleExhausted({
        endDate: recurringJournalDTO.endDate,
        maxOccurrences: recurringJournalDTO.maxOccurrences,
        occurrencesCount: recurringJournalObj.occurrencesCount,
        nextInvoiceDate: nextJournalDate,
      })
    ) {
      status = RecurringJournalStatus.Completed;
      recurringJournalObj.status = status;
      recurringJournalObj.nextJournalDate = null;
    }

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const { entries, ...recurringJournalFields } = recurringJournalObj;

      await this.recurringJournalModel()
        .query(trx)
        .patchAndFetchById(
          recurringJournalId,
          omit(recurringJournalFields, ['id']),
        );

      await oldRecurringJournal.$relatedQuery('entries', trx).delete();

      if (entries.length) {
        await oldRecurringJournal
          .$relatedQuery('entries', trx)
          .insertGraph(entries);
      }

      return this.recurringJournalModel()
        .query(trx)
        .findById(recurringJournalId)
        .withGraphFetched('entries.account')
        .withGraphFetched('entries.contact')
        .withGraphFetched('entries.branch')
        .withGraphFetched('entries.trackingCategories')
        .throwIfNotFound();
    });
  }
}
