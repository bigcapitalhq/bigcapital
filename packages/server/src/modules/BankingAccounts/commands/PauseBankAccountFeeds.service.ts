import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { ERRORS } from '../types/BankAccounts.types';
import { ServiceError } from '@/modules/Items/ServiceError';
import { Account } from '@/modules/Accounts/models/Account.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { PlaidItem } from '@/modules/BankingPlaid/models/PlaidItem';
import { SimpleFinItem } from '@/modules/BankingSimpleFin/models/SimpleFinItem';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class PauseBankAccountFeeds {
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
   * Pauses the bank feed syncing of the given bank account.
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  public async pauseBankAccountFeeds(bankAccountId: number) {
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
    // Cannot continue if the bank account feeds is already paused.
    if (feedItem.isPaused) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_FEEDS_ALREADY_PAUSED);
    }
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const pausedAt = new Date();

      if (oldAccount.plaidItem) {
        await this.plaidItemModel()
          .query(trx)
          .findById(feedItem.id)
          .patch({ pausedAt });
      } else {
        await this.simplefinItemModel()
          .query(trx)
          .findById(feedItem.id)
          .patch({ pausedAt });
      }
    });
  }
}
