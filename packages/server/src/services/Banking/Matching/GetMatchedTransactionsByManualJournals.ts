import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionManualJournalsTransformer } from './GetMatchedTransactionManualJournalsTransformer';
import { Inject, Service } from 'typedi';
import { GetMatchedTransactionsFilter } from './types';
import { GetMatchedTransactionsByType } from './GetMatchedTransactionsByType';

@Service()
export class GetMatchedTransactionsByManualJournals extends GetMatchedTransactionsByType {
  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve the matched transactions of manual journals.
   * @param {number} tenantId
   * @param {GetMatchedTransactionsFilter} filter
   * @returns
   */
  async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    const manualJournals = await ManualJournal.query();

    return this.transformer.transform(
      tenantId,
      manualJournals,
      new GetMatchedTransactionManualJournalsTransformer()
    );
  }

  /**
   * Retrieves the matched transaction of manual journals.
   * @param {number} tenantId
   * @param {number} transactionId
   * @returns
   */
  async getMatchedTransaction(tenantId: number, transactionId: number) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    const manualJournal = await ManualJournal.query()
      .findById(transactionId)
      .throwIfNotFound();

    return this.transformer.transform(
      tenantId,
      manualJournal,
      new GetMatchedTransactionManualJournalsTransformer()
    );
  }
}
