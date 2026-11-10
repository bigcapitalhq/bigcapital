import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { ERRORS } from '../types/BankAccounts.types';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { PlaidItem } from '@/modules/BankingPlaid/models/PlaidItem';
import { SimpleFinItem } from '@/modules/BankingSimpleFin/models/SimpleFinItem';
import { Account } from '@/modules/Accounts/models/Account.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class ResumeBankAccountFeedsService {
  constructor(
    @Inject(Account.name)
    private accountModel: TenantModelProxy<typeof Account>,

    @Inject(PlaidItem.name)
    private plaidItemModel: TenantModelProxy<typeof PlaidItem>,

    @Inject(SimpleFinItem.name)
    private simplefinItemModel: TenantModelProxy<typeof SimpleFinItem>,

    private uow: UnitOfWork,
  ) {}

  /**
   * Resumes the bank feeds syncing of the bank account.
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  public async resumeBankAccountFeeds(bankAccountId: number) {
    const oldAccount = await this.accountModel()
      .query()
      .findById(bankAccountId)
      .withGraphFetched('[plaidItem, simplefinItem]')
      .throwIfNotFound();

    const feedItem = oldAccount.plaidItem || oldAccount.simplefinItem;

    // Can't continue if the bank account is not connected.
    if (!feedItem) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
    }
    // Cannot continue if the bank account feeds is already resumed.
    if (!feedItem.isPaused) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_FEEDS_ALREADY_RESUMED);
    }
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      if (oldAccount.plaidItem) {
        await this.plaidItemModel()
          .query(trx)
          .findById(feedItem.id)
          .patch({ pausedAt: null });
      } else {
        await this.simplefinItemModel()
          .query(trx)
          .findById(feedItem.id)
          .patch({ pausedAt: null });
      }
    });
  }
}
