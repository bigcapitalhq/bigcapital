import { Inject, Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { RecurringJournal } from '../models/RecurringJournal';
import { ERRORS } from '../RecurringJournal.types';
import { RecurringJournalTransformer } from './RecurringJournal.transformer';

@Injectable()
export class GetRecurringJournal {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(RecurringJournal.name)
    private readonly recurringJournalModel: TenantModelProxy<
      typeof RecurringJournal
    >,
  ) {}

  /**
   * Retrieves the recurring journal profile graph.
   */
  public async getRecurringJournal(recurringJournalId: number) {
    const recurringJournal = await this.recurringJournalModel()
      .query()
      .findById(recurringJournalId)
      .withGraphFetched('entries.account')
      .withGraphFetched('entries.contact')
      .withGraphFetched('entries.branch')
      .withGraphFetched('entries.trackingCategories')
      .withGraphFetched('entries.trackingCategories.category')
      .withGraphFetched('entries.trackingCategories.option');

    if (!recurringJournal) {
      throw new ServiceError(ERRORS.RECURRING_JOURNAL_NOT_FOUND);
    }

    return this.transformer.transform(
      recurringJournal,
      new RecurringJournalTransformer(),
    );
  }
}
