import { Inject, Injectable } from '@nestjs/common';
import { GetMatchedTransactionManualJournalsTransformer } from './GetMatchedTransactionManualJournalsTransformer';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { GetMatchedTransactionsFilter } from '../types';
import { ManualJournal } from '@/modules/ManualJournals/models/ManualJournal';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetMatchedTransactionsByManualJournals extends GetMatchedTransactionsByType {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(ManualJournal.name)
    private readonly manualJournalModel: TenantModelProxy<typeof ManualJournal>,
  ) {
    super();
  }

  /**
   * Retrieve the matched transactions of manual journals.
   * @param {GetMatchedTransactionsFilter} filter
   * @returns
   */
  async getMatchedTransactions(
    filter: Omit<GetMatchedTransactionsFilter, 'transactionType'>,
  ) {
    // @todo: get the account id from the filter
    const accountId = 1000;

    const manualJournals = await this.manualJournalModel()
      .query()
      .onBuild((query) => {
        query.withGraphJoined('matchedBankTransaction');
        query.whereNull('matchedBankTransaction.id');

        query.withGraphJoined('entries');
        query.where('entries.accountId', accountId);
        query.modify('filterByPublished');

        if (filter.fromDate) {
          query.where('date', '>=', filter.fromDate);
        }
        if (filter.toDate) {
          query.where('date', '<=', filter.toDate);
        }
        if (filter.minAmount) {
          query.where('amount', '>=', filter.minAmount);
        }
        if (filter.maxAmount) {
          query.where('amount', '<=', filter.maxAmount);
        }
      });
    return this.transformer.transform(
      manualJournals,
      new GetMatchedTransactionManualJournalsTransformer(),
    );
  }

  /**
   * Retrieves the matched transaction of manual journals.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns
   */
  public async getMatchedTransaction(transactionId: number) {
    const manualJournal = await this.manualJournalModel()
      .query()
      .findById(transactionId)
      .whereNotExists(ManualJournal.relatedQuery('matchedBankTransaction'))
      .throwIfNotFound();

    return this.transformer.transform(
      manualJournal,
      new GetMatchedTransactionManualJournalsTransformer(),
    );
  }
}
