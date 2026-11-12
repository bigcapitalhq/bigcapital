import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { RecurringJournal } from '../models/RecurringJournal';

@Injectable()
export class DeleteRecurringJournal {
  constructor(
    private readonly uow: UnitOfWork,

    @Inject(RecurringJournal.name)
    private readonly recurringJournalModel: TenantModelProxy<
      typeof RecurringJournal
    >,
  ) {}

  /**
   * Deletes the recurring journal profile. Generated journals are kept and
   * their recurring link is cleared by the database foreign key.
   */
  public async deleteRecurringJournal(
    recurringJournalId: number,
  ): Promise<void> {
    const recurringJournal = await this.recurringJournalModel()
      .query()
      .findById(recurringJournalId)
      .throwIfNotFound();

    await this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await recurringJournal.$relatedQuery('entries', trx).delete();
      await recurringJournal.$query(trx).delete();
    });
  }
}
