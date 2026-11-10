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
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { DisconnectSimpleFinItemService } from '@/modules/BankingSimpleFin/commands/DisconnectSimpleFinItem.service';

@Injectable()
export class DisconnectBankAccountService {
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,
    private disconnectSimpleFinItem: DisconnectSimpleFinItemService,

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
      .whereIn('account_type', [
        ACCOUNT_TYPE.CASH,
        ACCOUNT_TYPE.BANK,
        ACCOUNT_TYPE.CREDIT_CARD,
      ])
      .withGraphFetched('[plaidItem, simplefinItem]')
      .throwIfNotFound();

    const oldPlaidItem = account.plaidItem;
    const oldSimpleFinItem = account.simplefinItem;

    if (!oldPlaidItem && !oldSimpleFinItem) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
    }
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBankAccountDisconnecting` event.
      await this.eventPublisher.emitAsync(events.bankAccount.onDisconnecting, {
        bankAccountId,
      } as IBankAccountDisconnectingEventPayload);

      if (oldPlaidItem) {
        await this.disconnectPlaid(account, trx);
      } else if (oldSimpleFinItem) {
        await this.disconnectSimpleFinItem.unlinkAccount(
          bankAccountId,
          oldSimpleFinItem.simplefinItemId,
          trx,
        );
      }
      // Triggers `onBankAccountDisconnected` event.
      await this.eventPublisher.emitAsync(events.bankAccount.onDisconnected, {
        bankAccountId,
        trx,
      } as IBankAccountDisconnectedEventPayload);
    });
  }

  /**
   * Disconnects the Plaid item of the given bank account.
   * @param {Account} account
   * @param {Knex.Transaction} trx
   */
  private async disconnectPlaid(account: Account, trx: Knex.Transaction) {
    const oldPlaidItem = account.plaidItem;

    // Remove the Plaid item from the system.
    await this.plaidItemModel()
      .query(trx)
      .findOne('plaidItemId', account.plaidItemId)
      .delete();

    // Remove the plaid item association to the bank account.
    await this.accountModel().query(trx).findById(account.id).patch({
      plaidAccountId: null,
      plaidItemId: null,
      isFeedsActive: false,
    });
    // Remove the Plaid item.
    await this.plaidClient.itemRemove({
      access_token: oldPlaidItem.plaidAccessToken,
    });
  }
}
