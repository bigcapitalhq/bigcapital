import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { RecurringJournal } from '../models/RecurringJournal';
import { CreateRecurringJournalDto } from '../dtos/RecurringJournal.dto';
import { RecurringJournalDTOTransformer } from './RecurringJournalDTOTransformer.service';
import { RecurringJournalValidators } from './RecurringJournalValidators.service';
import { ERRORS, RecurringJournalStatus } from '../RecurringJournal.types';
import { getFirstOccurrenceOnOrAfter, getTodayDate } from '@/utils/recurrence';

@Injectable()
export class CreateRecurringJournal {
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
   * Creates a new recurring journal profile.
   */
  public async createRecurringJournal(
    recurringJournalDTO: CreateRecurringJournalDto,
  ): Promise<RecurringJournal> {
    this.validators.validateProfileName(recurringJournalDTO.profileName);
    this.validators.validateDateRange(
      recurringJournalDTO.startDate,
      recurringJournalDTO.endDate,
    );
    await this.validators.validateAutoIncrement();

    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const today = getTodayDate(tenantMetadata?.timezone);

    const nextJournalDate = getFirstOccurrenceOnOrAfter(
      recurringJournalDTO.startDate,
      today,
      recurringJournalDTO.frequency,
      recurringJournalDTO.repeatInterval || 1,
      recurringJournalDTO.endDate,
    );

    if (!nextJournalDate) {
      throw new ServiceError(ERRORS.RECURRING_JOURNAL_END_CONDITION_REACHED);
    }

    await this.validators.validateEntries(
      recurringJournalDTO,
      tenantMetadata?.baseCurrency,
    );

    const recurringJournalObj = await this.transformerDTO.transformDTOToModel(
      recurringJournalDTO,
      nextJournalDate,
      RecurringJournalStatus.Active,
    );

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const recurringJournal = await this.recurringJournalModel()
        .query(trx)
        .insertGraph(recurringJournalObj);

      return this.recurringJournalModel()
        .query(trx)
        .findById(recurringJournal.id)
        .withGraphFetched('entries.account')
        .withGraphFetched('entries.contact')
        .withGraphFetched('entries.branch')
        .withGraphFetched('entries.trackingCategories')
        .throwIfNotFound();
    });
  }
}
