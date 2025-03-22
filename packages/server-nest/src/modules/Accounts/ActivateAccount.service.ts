import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { IAccountEventActivatedPayload } from './Accounts.types';
import { Account } from './models/Account.model';
import { AccountRepository } from './repositories/Account.repository';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class ActivateAccount {
  /**
   * @param {EventEmitter2} eventEmitter - The event emitter.
   * @param {UnitOfWork} uow - The unit of work.
   * @param {AccountRepository} accountRepository - The account repository.
   * @param {TenantModelProxy<typeof Account>} accountModel - The account model.
   */
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly accountRepository: AccountRepository,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) {}

  /**
   * Activates/Inactivates the given account.
   * @param {number} accountId - The account id.
   * @param {boolean} activate - Activate or inactivate the account.
   */
  public activateAccount = async (accountId: number, activate?: boolean) => {
    // Retrieve the given account or throw not found error.
    const oldAccount = await this.accountModel()
      .query()
      .findById(accountId)
      .throwIfNotFound();

    // Get all children accounts.
    const accountsGraph = await this.accountRepository.getDependencyGraph();
    const dependenciesAccounts = accountsGraph.dependenciesOf(accountId);

    const patchAccountsIds = [...dependenciesAccounts, accountId];

    // Activate account and associated transactions under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Activate and inactivate the given accounts ids.
      activate
        ? await this.accountRepository.activateByIds(patchAccountsIds, trx)
        : await this.accountRepository.inactivateByIds(patchAccountsIds, trx);

      // Triggers `onAccountActivated` event.
      this.eventEmitter.emitAsync(events.accounts.onActivated, {
        accountId,
        trx,
      } as IAccountEventActivatedPayload);
    });
  };
}
