import { Inject, Service } from 'typedi';
import { Knex } from 'knex';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  IAccountEventEditedPayload,
  IAccountEditDTO,
  IAccount,
} from '@/interfaces';
import events from '@/subscribers/events';
import UnitOfWork from '@/services/UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { CommandAccountValidators } from './CommandAccountValidators';

@Service()
export class EditAccount {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validator: CommandAccountValidators;

  /**
   * Authorize the account editing.
   * @param {number} tenantId
   * @param {number} accountId
   * @param {IAccountEditDTO} accountDTO
   * @param {IAccount} oldAccount -
   */
  private authorize = async (
    tenantId: number,
    accountId: number,
    accountDTO: IAccountEditDTO,
    oldAccount: IAccount
  ) => {
    // Validate account name uniquiness.
    await this.validator.validateAccountNameUniquiness(
      tenantId,
      accountDTO.name,
      accountId
    );
    // Validate the account type should be not mutated.
    await this.validator.isAccountTypeChangedOrThrowError(
      oldAccount,
      accountDTO
    );
    // Validate the account code not exists on the storage.
    if (accountDTO.code && accountDTO.code !== oldAccount.code) {
      await this.validator.isAccountCodeUniqueOrThrowError(
        tenantId,
        accountDTO.code,
        oldAccount.id
      );
    }
    // Retrieve the parent account of throw not found service error.
    if (accountDTO.parentAccountId) {
      const parentAccount = await this.validator.getParentAccountOrThrowError(
        tenantId,
        accountDTO.parentAccountId,
        oldAccount.id
      );
      this.validator.throwErrorIfParentHasDiffType(accountDTO, parentAccount);
    }
  };

  /**
   * Edits details of the given account.
   * @param {number} tenantId
   * @param {number} accountId
   * @param {IAccountDTO} accountDTO
   */
  public async editAccount(
    tenantId: number,
    accountId: number,
    accountDTO: IAccountEditDTO
  ): Promise<IAccount> {
    const { Account } = this.tenancy.models(tenantId);

    // Retrieve the old account or throw not found service error.
    const oldAccount = await Account.query()
      .findById(accountId)
      .throwIfNotFound();

    // Authorize the account editing.
    await this.authorize(tenantId, accountId, accountDTO, oldAccount);

    // Edits account and associated transactions under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onAccountEditing` event.
      await this.eventPublisher.emitAsync(events.accounts.onEditing, {
        tenantId,
        oldAccount,
        accountDTO,
      });
      // Update the account on the storage.
      const account = await Account.query(trx)
        .findById(accountId)
        .update({ ...accountDTO });

      // Triggers `onAccountEdited` event.
      await this.eventPublisher.emitAsync(events.accounts.onEdited, {
        tenantId,
        account,
        oldAccount,
        trx,
      } as IAccountEventEditedPayload);

      return account;
    });
  }
}
