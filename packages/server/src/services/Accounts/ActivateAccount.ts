import { IAccountEventActivatedPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import TenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export class ActivateAccount {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Activates/Inactivates the given account.
   * @param {number} tenantId
   * @param {number} accountId
   * @param {boolean} activate
   */
  public activateAccount = async (tenantId: number, accountId: number, activate?: boolean) => {
    const { Account } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    // Retrieve the given account or throw not found error.
    const oldAccount = await Account.query().findById(accountId).throwIfNotFound();

    // Get all children accounts.
    const accountsGraph = await accountRepository.getDependencyGraph();
    const dependenciesAccounts = accountsGraph.dependenciesOf(accountId);

    const patchAccountsIds = [...dependenciesAccounts, accountId];

    // Activate account and associated transactions under unit-of-work envirement.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Activate and inactivate the given accounts ids.
      activate
        ? await accountRepository.activateByIds(patchAccountsIds, trx)
        : await accountRepository.inactivateByIds(patchAccountsIds, trx);

      // Triggers `onAccountActivated` event.
      this.eventPublisher.emitAsync(events.accounts.onActivated, {
        tenantId,
        accountId,
        trx,
      } as IAccountEventActivatedPayload);
    });
  };
}
