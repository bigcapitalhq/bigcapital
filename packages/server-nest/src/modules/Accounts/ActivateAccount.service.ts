import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { IAccountEventActivatedPayload } from './Accounts.types';
import { Account } from './models/Account.model';
import { AccountRepository } from './repositories/Account.repository';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class ActivateAccount {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(Account.name)
    private readonly accountModel: typeof Account,
    private readonly accountRepository: AccountRepository,
  ) {}

  /**
   * Activates/Inactivates the given account.
   * @param {number} accountId
   * @param {boolean} activate
   */
  public activateAccount = async (accountId: number, activate?: boolean) => {
    // Retrieve the given account or throw not found error.
    const oldAccount = await this.accountModel
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
