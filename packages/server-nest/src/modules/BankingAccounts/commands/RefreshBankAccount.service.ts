import { PlaidApi } from 'plaid';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { PLAID_CLIENT } from '@/modules/Plaid/Plaid.module';
import { ERRORS } from '../types/BankAccounts.types';

@Injectable()
export class RefreshBankAccountService {
  constructor(
    @Inject(PLAID_CLIENT) private plaidClient: PlaidApi,
    @Inject(Account.name) private readonly accountModel: typeof Account,
  ) {}

  /**
   * Asks Plaid to trigger syncing the given bank account.
   * @param {number} bankAccountId - Bank account identifier.
   * @returns {Promise<void>}
   */
  public async refreshBankAccount(bankAccountId: number) {
    const bankAccount = await this.accountModel
      .query()
      .findById(bankAccountId)
      .withGraphFetched('plaidItem')
      .throwIfNotFound();

    // Can't continue if the given account is not linked with Plaid item.
    if (!bankAccount.plaidItem) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
    }
    await this.plaidClient.transactionsRefresh({
      access_token: bankAccount.plaidItem.plaidAccessToken,
    });
  }
}
