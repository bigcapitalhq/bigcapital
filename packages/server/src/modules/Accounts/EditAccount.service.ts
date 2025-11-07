import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { CommandAccountValidators } from './CommandAccountValidators.service';
import { Account } from './models/Account.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { EditAccountDTO } from './EditAccount.dto';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class EditAccount {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validator: CommandAccountValidators,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) { }

  /**
   * Authorize the account editing.
   * @param {number} accountId
   * @param {IAccountEditDTO} accountDTO
   * @param {IAccount} oldAccount -
   */
  private authorize = async (
    accountId: number,
    accountDTO: EditAccountDTO,
    oldAccount: Account,
  ) => {
    // Validate account name uniquiness.
    await this.validator.validateAccountNameUniquiness(
      accountDTO.name,
      accountId,
    );
    // Validate the account type should be not mutated.
    await this.validator.isAccountTypeChangedOrThrowError(
      oldAccount,
      accountDTO,
    );
    // Validate the account code not exists on the storage.
    if (accountDTO.code && accountDTO.code !== oldAccount.code) {
      await this.validator.isAccountCodeUniqueOrThrowError(
        accountDTO.code,
        oldAccount.id,
      );
    }
    // Retrieve the parent account of throw not found service error.
    if (accountDTO.parentAccountId) {
      const parentAccount = await this.validator.getParentAccountOrThrowError(
        accountDTO.parentAccountId,
        oldAccount.id,
      );
      this.validator.throwErrorIfParentHasDiffType(accountDTO, parentAccount);
    }
  };

  /**
   * Edits details of the given account.
   * @param {number} accountId
   * @param {IAccountDTO} accountDTO
   */
  public async editAccount(
    accountId: number,
    accountDTO: EditAccountDTO,
  ): Promise<Account> {
    // Retrieve the old account or throw not found service error.
    const oldAccount = await this.accountModel()
      .query()
      .findById(accountId)
      .throwIfNotFound();

    // Authorize the account editing.
    await this.authorize(accountId, accountDTO, oldAccount);

    // Edits account and associated transactions under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onAccountEditing` event.
      await this.eventEmitter.emitAsync(events.accounts.onEditing, {
        oldAccount,
        accountDTO,
      });
      // Update the account on the storage.
      const account = await this.accountModel()
        .query(trx)
        .updateAndFetchById(accountId, { ...accountDTO });

      // Triggers `onAccountEdited` event.
      // await this.eventEmitter.emitAsync(events.accounts.onEdited, {
      //   account,
      //   oldAccount,
      //   trx,
      // } as IAccountEventEditedPayload);

      return account;
    });
  }
}
