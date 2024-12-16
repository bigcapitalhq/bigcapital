import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
// import { IAccountEventDeletedPayload } from '@/interfaces';
import { CommandAccountValidators } from './CommandAccountValidators.service';
import { AccountModel } from './models/Account.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { IAccountEventDeletedPayload } from './Accounts.types';

@Injectable()
export class DeleteAccount {
  constructor(
    @Inject(AccountModel.name) private accountModel: typeof AccountModel,
    private eventEmitter: EventEmitter2,
    private uow: UnitOfWork,
    private validator: CommandAccountValidators,
  ) {}

  /**
   * Authorize account delete.
   * @param {number} accountId - Account id.
   */
  private authorize = async (accountId: number, oldAccount: AccountModel) => {
    // Throw error if the account was predefined.
    this.validator.throwErrorIfAccountPredefined(oldAccount);
  };

  /**
   * Unlink the given parent account with children accounts.
   * @param {number|number[]} parentAccountId -
   */
  private async unassociateChildrenAccountsFromParent(
    parentAccountId: number | number[],
    trx?: Knex.Transaction,
  ) {
    const accountsIds = Array.isArray(parentAccountId)
      ? parentAccountId
      : [parentAccountId];

    await this.accountModel
      .query(trx)
      .whereIn('parent_account_id', accountsIds)
      .patch({ parent_account_id: null });
  }

  /**
   * Deletes the account from the storage.
   * @param {number} accountId
   */
  public deleteAccount = async (accountId: number): Promise<void> => {
    // Retrieve account or not found service error.
    const oldAccount = await this.accountModel.query().findById(accountId);

    // Authorize before delete account.
    await this.authorize(accountId, oldAccount);

    // Deletes the account and associated transactions under UOW environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onAccountDelete` event.
      await this.eventEmitter.emitAsync(events.accounts.onDelete, {
        trx,
        oldAccount,
      } as IAccountEventDeletedPayload);

      // Unlink the parent account from children accounts.
      await this.unassociateChildrenAccountsFromParent(accountId, trx);

      // Deletes account by the given id.
      await this.accountModel.query(trx).deleteById(accountId);

      // Triggers `onAccountDeleted` event.
      await this.eventEmitter.emitAsync(events.accounts.onDeleted, {
        accountId,
        oldAccount,
        trx,
      } as IAccountEventDeletedPayload);
    });
  };
}
