import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { CommandAccountValidators } from './CommandAccountValidators.service';
import { Account } from './models/Account.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { EditAccountDTO } from './EditAccount.dto';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { AccountsSettingsService } from './AccountsSettings.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Injectable()
export class EditAccount {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validator: CommandAccountValidators,

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
    private readonly accountsSettings: AccountsSettingsService,
    private readonly tenancyContext: TenancyContext,
  ) {}

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
    location: string,
  ) => {
    const { accountCodeRequired, accountCodeUnique } =
      await this.accountsSettings.getAccountsSettings();

    // Validate account code required when setting is enabled.
    if (accountCodeRequired) {
      this.validator.validateAccountCodeRequiredOrThrow(accountDTO.code);
    }
    // Validate the account code uniquiness when setting is enabled.
    if (
      accountCodeUnique &&
      accountDTO.code?.trim() &&
      accountDTO.code !== oldAccount.code
    ) {
      await this.validator.isAccountCodeUniqueOrThrowError(
        accountDTO.code,
        oldAccount.id,
      );
    }
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
    // Retrieve the parent account of throw not found service error.
    if (accountDTO.parentAccountId) {
      const parentAccount = await this.validator.getParentAccountOrThrowError(
        accountDTO.parentAccountId,
        oldAccount.id,
      );
      this.validator.throwErrorIfParentHasDiffType(accountDTO, parentAccount);
    }
    // Validates the local bank identification fields, which are required for
    // bank accounts in organizations located in Brazil or Argentina.
    this.validator.validateBankIdentificationOrThrow(accountDTO, location);
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

    // Retrieves the given tenant metadata.
    const tenant = await this.tenancyContext.getTenant(true);

    // Authorize the account editing.
    await this.authorize(
      accountId,
      accountDTO,
      oldAccount,
      tenant.metadata.location,
    );

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
