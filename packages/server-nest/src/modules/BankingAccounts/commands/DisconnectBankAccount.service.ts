import { Knex } from 'knex';
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

@Injectable()
export class DisconnectBankAccountService {
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,

    @Inject(Account.name) private accountModel: typeof Account,
    @Inject(PlaidItem.name) private plaidItemModel: typeof PlaidItem,
    @Inject(PLAID_CLIENT) private plaidClient: PlaidApi,
  ) {}

  /**
   * Disconnects the given bank account.
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  public async disconnectBankAccount(bankAccountId: number) {
    // Retrieve the bank account or throw not found error.
    const account = await this.accountModel
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

      // Remove the Plaid item from the system.
      await this.plaidItemModel.query(trx).findById(account.plaidItemId).delete();

      // Remove the plaid item association to the bank account.
      await this.accountModel.query(trx).findById(bankAccountId).patch({
        plaidAccountId: null,
        plaidItemId: null,
        isFeedsActive: false,
      });
      // Remove the Plaid item.
      await this.plaidClient.itemRemove({
        access_token: oldPlaidItem.plaidAccessToken,
      });
      // Triggers `onBankAccountDisconnected` event.
      await this.eventPublisher.emitAsync(events.bankAccount.onDisconnected, {
        bankAccountId,
        trx,
      } as IBankAccountDisconnectedEventPayload);
    });
  }
}
