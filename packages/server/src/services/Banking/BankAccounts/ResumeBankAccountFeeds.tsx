import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { Inject, Service } from 'typedi';

@Service()
export class ResumeBankAccountFeeds {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Resumes the bank feeds syncing of the bank account.
   * @param {number} tenantId
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  public async resumeBankAccountFeeds(tenantId: number, bankAccountId: number) {
    const { Account, PlaidItem } = this.tenancy.models(tenantId);

    const oldAccount = await Account.query()
      .findById(bankAccountId)
      .withGraphFetched('plaidItem');

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      await PlaidItem.query().findById(oldAccount.plaidItem.id).patch({
        pausedAt: new Date(),
      });
    });
  }
}
