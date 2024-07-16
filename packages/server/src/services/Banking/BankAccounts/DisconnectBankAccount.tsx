import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { PlaidClientWrapper } from '@/lib/Plaid';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { ERRORS } from './types';

@Service()
export class DisconnectBankAccount {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Disconnects the given bank account.
   * @param {number} tenantId
   * @param {number} bankAccountId
   * @returns {Promise<void>}
   */
  async disconnectBankAccount(tenantId: number, bankAccountId: number) {
    const { Account, PlaidItem } = this.tenancy.models(tenantId);

    // Retrieve the bank account or throw not found error.
    const account = await Account.query()
      .findById(bankAccountId)
      .whereIn('account_type', ['bank', 'cash'])
      .throwIfNotFound();

    const oldPlaidItem = await PlaidItem.query().findById(account.plaidItemId);

    if (!oldPlaidItem) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
    }
    const plaidInstance = new PlaidClientWrapper();

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBankAccountDisconnecting` event.
      await this.eventPublisher.emitAsync(events.bankAccount.onDisconnecting, {
        tenantId,
        bankAccountId,
      });
      // Remove the Plaid item from the system.
      await PlaidItem.query(trx).findById(account.plaidItemId).delete();

      // Remove the plaid item association to the bank account.
      await Account.query(trx).findById(bankAccountId).patch({
        plaidAccountId: null,
        plaidItemId: null,
        isFeedsActive: false,
      });
      // Remove the Plaid item.
      const data = await plaidInstance.itemRemove({
        access_token: oldPlaidItem.plaidAccessToken,
      });
      // Triggers `onBankAccountDisconnected` event.
      await this.eventPublisher.emitAsync(events.bankAccount.onDisconnected, {
        tenantId,
        bankAccountId,
      });
    });
  }
}