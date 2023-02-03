import { Service, Inject } from 'typedi';
import JournalPoster from '@/services/Accounting/JournalPoster';
import TenancyService from '@/services/Tenancy/TenancyService';
import JournalCommands from '@/services/Accounting/JournalCommands';
import Knex from 'knex';

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
  async revertJournalTransactions(
    tenantId: number,
    referenceId: number|number[],
    referenceType: string|string[],
    trx?: Knex.Transaction
  ): Promise<void> {
    const journal = new JournalPoster(tenantId, null, trx);
    const journalCommand = new JournalCommands(journal);

    await journalCommand.revertJournalEntries(referenceId, referenceType);

    await Promise.all([
      journal.deleteEntries(),
      journal.saveBalance(),
      journal.saveContactsBalance(),
    ]);
  }
}