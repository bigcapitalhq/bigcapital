import { Inject, Injectable } from '@nestjs/common';
import { GetMatchedTransactionManualJournalsTransformer } from './GetMatchedTransactionManualJournalsTransformer';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';
import { ERRORS, GetMatchedTransactionsByTypeFilter } from '../types';
import { ServiceError } from '@/modules/Items/ServiceError';
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
   * @param {GetMatchedTransactionsByTypeFilter} filter
   * @returns
   */
  async getMatchedTransactions(
    filter: Omit<GetMatchedTransactionsByTypeFilter, 'transactionType'>,
  ) {
    const manualJournals = await this.manualJournalModel()
      .query()
      .onBuild((query) => {
        query.withGraphJoined('matchedBankTransaction');
        query.whereNull('matchedBankTransaction.id');

        // Only journals with an entry on the bank transactions' accounts.
        query.withGraphJoined('entries');
        query.whereIn('entries.accountId', filter.accountIds);
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
   * Retrieves the matched transaction of manual journals, only when it's
   * published, not matched yet, and has an entry on one of the given bank
   * accounts. Like the candidate list, only those entries are loaded, so the
   * amount is the journal's effect on the bank account.
   * @param {number} transactionId
   * @param {Array<number>} accountIds - Accounts of the bank transactions being matched.
   * @returns
   */
  public async getMatchedTransaction(
    transactionId: number,
    accountIds: Array<number>,
  ) {
    const manualJournal = await this.manualJournalModel()
      .query()
      .findById(transactionId)
      .modify('filterByPublished')
      .whereNotExists(ManualJournal.relatedQuery('matchedBankTransaction'))
      .withGraphFetched('entries')
      .modifyGraph('entries', (builder) => {
        builder.whereIn('accountId', accountIds);
      })
      .throwIfNotFound();

    if (manualJournal.entries.length === 0) {
      throw new ServiceError(ERRORS.MATCHING_TRANSACTION_ACCOUNT_INVALID);
    }
    return this.transformer.transform(
      manualJournal,
      new GetMatchedTransactionManualJournalsTransformer(),
    );
  }
}
