import { Service, Inject } from 'typedi';
import JournalPoster from 'services/Accounting/JournalPoster';
import TenancyService from 'services/Tenancy/TenancyService';

@Service()
export default class JournalPosterService {
  @Inject()
  tenancy: TenancyService;

  /**
   * Deletes the journal transactions that associated to the given reference id.
   * @param {number} tenantId - The given tenant id.
   * @param {number} referenceId - The transaction reference id.
   * @param {string} referenceType - The transaction reference type.
   * @return {Promise}
   */
  async deleteJournalTransactions(
    tenantId: number,
    referenceId: number,
    referenceType: string
  ) {
    const { Account, AccountTransaction } = this.tenancy.models(tenantId);

    const transactions = await AccountTransaction.tenant()
      .query()
      .whereIn('reference_type', [referenceType])
      .where('reference_id', referenceId)
      .withGraphFetched('account.type');

    const accountsDepGraph = await Account.tenant().depGraph().query();
    const journal = new JournalPoster(accountsDepGraph);

    journal.loadEntries(transactions);
    journal.removeEntries();

    await Promise.all([journal.deleteEntries(), journal.saveBalance()]);
  }
}