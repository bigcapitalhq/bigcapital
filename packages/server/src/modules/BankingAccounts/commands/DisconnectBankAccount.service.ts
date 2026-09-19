import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import {
  ERRORS,
  IBankAccountDisconnectedEventPayload,
  IBankAccountDisconnectingEventPayload,
} from '../types/BankAccounts.types';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { Account } from '@/modules/Accounts/models/Account.model';
import { UnlinkPlaidAccountService } from '@/modules/BankingPlaid/command/UnlinkPlaidAccount.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { events } from '@/common/events/events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DisconnectBankAccountService {
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,
    private unlinkPlaidAccount: UnlinkPlaidAccountService,

    @Inject(Account.name)
    private accountModel: TenantModelProxy<typeof Account>,
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

    // An account whose Plaid item is already gone can still be unlinked.
    if (!account.plaidItemId && !account.plaidAccountId) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
    }
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBankAccountDisconnecting` event.
      await this.eventPublisher.emitAsync(events.bankAccount.onDisconnecting, {
        bankAccountId,
      } as IBankAccountDisconnectingEventPayload);

      // Stop the account's feed, keeping the Plaid item for its other accounts.
      await this.unlinkPlaidAccount.unlinkAccount(account, trx);

      // Triggers `onBankAccountDisconnected` event.
      await this.eventPublisher.emitAsync(events.bankAccount.onDisconnected, {
        bankAccountId,
        trx,
      } as IBankAccountDisconnectedEventPayload);
    });
  }
}
