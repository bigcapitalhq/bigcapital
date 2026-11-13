import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { RecurringJournal } from '../models/RecurringJournal';
import { RecurringJournalValidators } from './RecurringJournalValidators.service';
import { RecurringJournalStatus } from '../RecurringJournal.types';

@Injectable()
export class PauseRecurringJournal {
  constructor(
    private readonly validators: RecurringJournalValidators,
    private readonly uow: UnitOfWork,

    @Inject(RecurringJournal.name)
    private readonly recurringJournalModel: TenantModelProxy<
      typeof RecurringJournal
    >,
  ) {}

  /**
   * Pauses the recurring journal profile.
   */
  public async pauseRecurringJournal(
    recurringJournalId: number,
  ): Promise<RecurringJournal> {
    const recurringJournal = await this.recurringJournalModel()
      .query()
      .findById(recurringJournalId)
      .throwIfNotFound();

    this.validators.validateCanPause(recurringJournal);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      return this.recurringJournalModel()
        .query(trx)
        .patchAndFetchById(recurringJournalId, {
          status: RecurringJournalStatus.Paused,
        });
    });
  }
}
