import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import { PlaidClientWrapper } from '@/lib/Plaid';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ERRORS } from './types';

@Service()
export class RefreshBankAccountService {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Asks Plaid to trigger syncing the given bank account.
   * @param {number} tenantId
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  public async refreshBankAccount(tenantId: number, bankAccountId: number) {
    const { Account } = this.tenancy.models(tenantId);

    const bankAccount = await Account.query()
      .findById(bankAccountId)
      .withGraphFetched('plaidItem')
      .throwIfNotFound();

    // Can't continue if the given account is not linked with Plaid item.
    if (!bankAccount.plaidItem) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
    }
    const plaidInstance = PlaidClientWrapper.getClient();

    await plaidInstance.transactionsRefresh({
      access_token: bankAccount.plaidItem.plaidAccessToken,
    });
  }
}
