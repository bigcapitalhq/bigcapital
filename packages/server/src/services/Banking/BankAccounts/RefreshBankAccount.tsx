import { ServiceError } from '@/exceptions';
import { PlaidClientWrapper } from '@/lib/Plaid';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import { Inject } from 'typedi';
export class RefreshBankAccountService {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  /**
   *
   * @param {number} tenantId
   * @param {number} bankAccountId
   */
  public async refreshBankAccount(tenantId: number, bankAccountId: number) {
    const { Account } = this.tenancy.models(tenantId);

    const bankAccount = await Account.query()
      .findById(bankAccountId)
      .withGraphFetched('plaidItem')
      .throwIfNotFound();

    if (!bankAccount.plaidItem) {
      throw new ServiceError('');
    }
    const plaidInstance = new PlaidClientWrapper();

    const data = await plaidInstance.transactionsRefresh({
      access_token: bankAccount.plaidItem.plaidAccessToken,
    });
    await Account.query().findById(bankAccountId).patch({
      isFeedsActive: true,
      lastFeedsUpdatedAt: new Date(),
    });
  }
}
