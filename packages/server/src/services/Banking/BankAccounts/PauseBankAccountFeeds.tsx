import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';

@Service()
export class PauseBankAccountFeeds {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Pauses the bankfeed syncing of the given bank account.
   * @param {number} tenantId
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  public async pauseBankAccountFeeds(tenantId: number, bankAccountId: number) {
    const { Account, PlaidItem } = this.tenancy.models(tenantId);

    const oldAccount = await Account.query()
      .findById(bankAccountId)
      .withGraphFetched('plaidItem');

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      await PlaidItem.query().findById(oldAccount.plaidItem.id).patch({
        pausedAt: null,
      });
    });
  }
}
