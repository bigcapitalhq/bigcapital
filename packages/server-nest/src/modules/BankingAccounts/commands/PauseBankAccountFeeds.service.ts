import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { ERRORS } from '../types/BankAccounts.types';
import { ServiceError } from '@/modules/Items/ServiceError';
import { Account } from '@/modules/Accounts/models/Account.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { PlaidItem } from '@/modules/BankingPlaid/models/PlaidItem';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class PauseBankAccountFeeds {
  constructor(
    @Inject(Account.name)
    private accountModel: TenantModelProxy<typeof Account>,
    @Inject(PlaidItem.name)
    private plaidItemModel: TenantModelProxy<typeof PlaidItem>,

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
      .withGraphFetched('plaidItem')
      .throwIfNotFound();

    // Can't continue if the bank account is not connected.
    if (!oldAccount.plaidItem) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
    }
    // Cannot continue if the bank account feeds is already paused.
    if (oldAccount.plaidItem.isPaused) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_FEEDS_ALREADY_PAUSED);
    }
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.plaidItemModel()
        .query(trx)
        .findById(oldAccount.plaidItem.id)
        .patch({
          pausedAt: new Date(),
        });
    });
  }
}
