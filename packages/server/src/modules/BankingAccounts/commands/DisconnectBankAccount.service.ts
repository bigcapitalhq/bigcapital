import { Knex } from 'knex';
import { uniq } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { PlaidApi } from 'plaid';
import {
  ERRORS,
  IBankAccountDisconnectedEventPayload,
  IBankAccountDisconnectingEventPayload,
} from '../types/BankAccounts.types';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Account } from '@/modules/Accounts/models/Account.model';
import { PlaidItem } from '@/modules/BankingPlaid/models/PlaidItem';
import { ServiceError } from '@/modules/Items/ServiceError';
import { events } from '@/common/events/events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PLAID_CLIENT } from '@/modules/Plaid/Plaid.module';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DisconnectBankAccountService {
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,

    @Inject(PLAID_CLIENT) private plaidClient: PlaidApi,
    @Inject(Account.name)
    private accountModel: TenantModelProxy<typeof Account>,

    @Inject(PlaidItem.name)
    private plaidItemModel: TenantModelProxy<typeof PlaidItem>,
  ) {}

  /**
   * Disconnects the given bank account.
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  public async disconnectBankAccount(bankAccountId: number) {
    // Retrieve the bank account or throw not found error.
    const account = await this.accountModel()
      .query()
      .findById(bankAccountId)
      .whereIn('account_type', [ACCOUNT_TYPE.CASH, ACCOUNT_TYPE.BANK])
      .withGraphFetched('plaidItem')
      .throwIfNotFound();

    const oldPlaidItem = account.plaidItem;

    if (!oldPlaidItem) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
    }
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBankAccountDisconnecting` event.
      await this.eventPublisher.emitAsync(events.bankAccount.onDisconnecting, {
        bankAccountId,
      } as IBankAccountDisconnectingEventPayload);

      // Other accounts fed by the same Plaid item keep it connected.
      const otherItemAccounts = await this.accountModel()
        .query(trx)
        .where('plaidItemId', account.plaidItemId)
        .whereNot('id', bankAccountId)
        .whereNotNull('plaidAccountId');
      const isItemShared = otherItemAccounts.length > 0;

      if (isItemShared) {
        // Stop syncing this account only, so the item sync neither feeds it
        // nor creates it again.
        await this.plaidItemModel()
          .query(trx)
          .findOne('plaidItemId', account.plaidItemId)
          .patch({
            disconnectedPlaidAccountIds: uniq([
              ...(oldPlaidItem.disconnectedPlaidAccountIds ?? []),
              ...(account.plaidAccountId ? [account.plaidAccountId] : []),
            ]),
          });
      } else {
        // Remove the Plaid item from the system.
        await this.plaidItemModel()
          .query(trx)
          .findOne('plaidItemId', account.plaidItemId)
          .delete();
      }
      // Remove the plaid item association to the bank account.
      await this.accountModel().query(trx).findById(bankAccountId).patch({
        plaidAccountId: null,
        plaidItemId: null,
        isFeedsActive: false,
      });
      // Remove the Plaid item once no account is fed by it.
      if (!isItemShared) {
        await this.plaidClient.itemRemove({
          access_token: oldPlaidItem.plaidAccessToken,
        });
      }
      // Triggers `onBankAccountDisconnected` event.
      await this.eventPublisher.emitAsync(events.bankAccount.onDisconnected, {
        bankAccountId,
        trx,
      } as IBankAccountDisconnectedEventPayload);
    });
  }
}
