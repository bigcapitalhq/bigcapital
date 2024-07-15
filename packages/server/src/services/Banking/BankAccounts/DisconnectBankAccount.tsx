import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { PlaidClientWrapper } from '@/lib/Plaid';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';

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

    const account = await Account.query()
      .findById(bankAccountId)
      .where('type', ['bank'])
      .throwIfNotFound();

    const plaidItem = await PlaidItem.query().findById(account.plaidAccountId);

    if (!plaidItem) {
      throw new ServiceError(ERRORS.BANK_ACCOUNT_NOT_CONNECTED);
    }
    const request = {
      accessToken: plaidItem.plaidAccessToken,
    };
    const plaidInstance = new PlaidClientWrapper();

    // 
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      await this.eventPublisher.emitAsync(events.bankAccount.onDisconnecting, {
        tenantId,
        bankAccountId,
      });
      // Remove the Plaid item.
      const data = await plaidInstance.itemRemove(request);

      // Remove the Plaid item from the system.
      await PlaidItem.query().findById(account.plaidAccountId).delete();

      // Remove the plaid item association to the bank account.
      await Account.query().findById(bankAccountId).patch({
        plaidAccountId: null,
        isFeedsActive: false,
      });
      await this.eventPublisher.emitAsync(events.bankAccount.onDisconnected, {
        tenantId,
        bankAccountId,
      });
    });
  }
}

const ERRORS = {
  BANK_ACCOUNT_NOT_CONNECTED: 'BANK_ACCOUNT_NOT_CONNECTED',
};
