import { Account, AccountTransaction } from '@/models';
import JournalPoster from '@/services/Accounting/JournalPoster';


export default class JournalPosterService {
  /**
   * Deletes the journal transactions that associated to the given reference id.
   */
  static async deleteJournalTransactions(referenceId) {
    const transactions = await AccountTransaction.tenant()
      .query()
      .whereIn('reference_type', ['SaleInvoice'])
      .where('reference_id', referenceId)
      .withGraphFetched('account.type');

    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);

    journal.loadEntries(transactions);
    journal.removeEntries();

    await Promise.all([journal.deleteEntries(), journal.saveBalance()]);
  }
}

