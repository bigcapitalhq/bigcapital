import { PlaidApi } from 'plaid';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { PLAID_CLIENT } from '@/modules/Plaid/Plaid.module';
import {
  UpdateBankingPlaidTransitionsJob,
  UpdateBankingPlaidTransitionsQueueJob,
} from '@/modules/BankingPlaid/types/BankingPlaid.types';
import { ERRORS } from '../types/BankAccounts.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class RefreshBankAccountService {
  private readonly logger = new Logger(RefreshBankAccountService.name);

  constructor(
    @Inject(PLAID_CLIENT) private plaidClient: PlaidApi,
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,

    @InjectQueue(UpdateBankingPlaidTransitionsQueueJob)
    private readonly updateTransitionsQueue: Queue,
  ) {}

  /**
   * Syncs the given bank account's Plaid item and asks Plaid to check the
   * bank for new transactions.
   * @param {number} bankAccountId - Bank account identifier.
   * @returns {Promise<void>}
   */
  public async refreshBankAccount(bankAccountId: number) {
    const bankAccount = await this.accountModel()
      .query()
      .findById(bankAccountId)
      .withGraphFetched('plaidItem')
      .throwIfNotFound();

    // Can't continue if the given account is not linked with Plaid item.
    if (!bankAccount.plaidItem) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
    }
    const { plaidItemId, plaidAccessToken } = bankAccount.plaidItem;

    // Sync what Plaid already has, which also catches up an item whose first
    // sync or webhooks failed. A sync of the item already pending is kept.
    await this.updateTransitionsQueue.add(
      UpdateBankingPlaidTransitionsJob,
      { plaidItemId },
      { jobId: plaidItemId, removeOnComplete: true, removeOnFail: true },
    );
    // Plaid sends a webhook, and so another sync, if the bank has anything
    // new. The sync above does not depend on it.
    try {
      await this.plaidClient.transactionsRefresh({
        access_token: plaidAccessToken,
      });
    } catch (error) {
      this.logger.warn(
        `Plaid transactions refresh failed for item ${plaidItemId}: ${
          error?.response?.data?.error_code ?? error?.message
        }`,
      );
    }
  }
}
