import { PlaidApi } from 'plaid';
import { Inject, Injectable } from '@nestjs/common';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { PLAID_CLIENT } from '@/modules/Plaid/Plaid.module';
import { ERRORS } from '../types/BankAccounts.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SimpleFinSyncQueueService } from '@/modules/BankingSimpleFin/commands/SimpleFinSyncQueue.service';

@Injectable()
export class RefreshBankAccountService {
  constructor(
    @Inject(PLAID_CLIENT) private plaidClient: PlaidApi,
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
    private readonly simplefinSyncQueue: SimpleFinSyncQueueService,
  ) {}

  /**
   * Asks the bank feed provider to trigger syncing the given bank account.
   * @param {number} bankAccountId - Bank account identifier.
   * @returns {Promise<void>}
   */
  public async refreshBankAccount(bankAccountId: number) {
    const bankAccount = await this.accountModel()
      .query()
      .findById(bankAccountId)
      .withGraphFetched('[plaidItem, simplefinItem]')
      .throwIfNotFound();

    if (bankAccount.plaidItem) {
      await this.plaidClient.transactionsRefresh({
        access_token: bankAccount.plaidItem.plaidAccessToken,
      });
      return;
    }
    if (bankAccount.simplefinItem) {
      // SimpleFIN has no webhooks, so pull the latest transactions right away.
      await this.simplefinSyncQueue.enqueue(
        bankAccount.simplefinItem.simplefinItemId,
        true,
      );
      return;
    }
    // Can't continue if the given account is not linked with any provider.
    throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
  }
}
