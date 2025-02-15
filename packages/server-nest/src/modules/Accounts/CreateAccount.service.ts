import { Inject, Injectable } from '@nestjs/common';
import { kebabCase } from 'lodash';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IAccountEventCreatingPayload,
  CreateAccountParams,
  IAccountEventCreatedPayload,
} from './Accounts.types';
import { CommandAccountValidators } from './CommandAccountValidators.service';
import { Account } from './models/Account.model';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { events } from '@/common/events/events';
import { CreateAccountDTO } from './CreateAccount.dto';
import { PartialModelObject } from 'objection';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class CreateAccountService {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validator: CommandAccountValidators,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Authorize the account creation.
   * @param {CreateAccountDTO} accountDTO
   */
  private authorize = async (
    accountDTO: CreateAccountDTO,
    baseCurrency: string,
    params?: CreateAccountParams,
  ) => {
    // Validate account name uniquiness.
    if (!params.ignoreUniqueName) {
      await this.validator.validateAccountNameUniquiness(accountDTO.name);
    }
    // Validate the account code uniquiness.
    if (accountDTO.code) {
      await this.validator.isAccountCodeUniqueOrThrowError(accountDTO.code);
    }
    // Retrieve the account type meta or throw service error if not found.
    this.validator.getAccountTypeOrThrowError(accountDTO.accountType);

    // Ingore the parent account validation if not presented.
    if (accountDTO.parentAccountId) {
      const parentAccount = await this.validator.getParentAccountOrThrowError(
        accountDTO.parentAccountId,
      );
      this.validator.throwErrorIfParentHasDiffType(accountDTO, parentAccount);

      // Inherit active status from parent account.
      accountDTO.active = parentAccount.active;

      // Validate should currency code be the same currency of parent account.
      this.validator.validateCurrentSameParentAccount(
        accountDTO,
        parentAccount,
        baseCurrency,
      );
      // Validates the max depth level of accounts chart.
      await this.validator.validateMaxParentAccountDepthLevels(
        accountDTO.parentAccountId,
      );
    }
    // Validates the given account type supports the multi-currency.
    this.validator.validateAccountTypeSupportCurrency(accountDTO, baseCurrency);
  };

  /**
   * Transformes the create account DTO to input model.
   * @param {IAccountCreateDTO} createAccountDTO
   */
  private transformDTOToModel = (
    createAccountDTO: CreateAccountDTO,
    baseCurrency: string,
  ): PartialModelObject<Account> => {
    return {
      ...createAccountDTO,
      slug: kebabCase(createAccountDTO.name),
      currencyCode: createAccountDTO.currencyCode || baseCurrency,

      // Mark the account is Plaid owner since Plaid item/account is defined on creating.
      isSyncingOwner: Boolean(
        createAccountDTO.plaidAccountId || createAccountDTO.plaidItemId,
      ),
    };
  };

  /**
   * Creates a new account on the storage.
   * @param {IAccountCreateDTO} accountDTO
   * @returns {Promise<IAccount>}
   */
  public createAccount = async (
    accountDTO: CreateAccountDTO,
    trx?: Knex.Transaction,
    params: CreateAccountParams = { ignoreUniqueName: false },
  ): Promise<Account> => {
    // Retrieves the given tenant metadata.
    const tenant = await this.tenancyContext.getTenant(true);

    // Authorize the account creation.
    await this.authorize(accountDTO, tenant.metadata.baseCurrency, params);

    // Transformes the DTO to model.
    const accountInputModel = this.transformDTOToModel(
      accountDTO,
      tenant.metadata.baseCurrency,
    );
    // Creates a new account with associated transactions under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onAccountCreating` event.
      await this.eventEmitter.emitAsync(events.accounts.onCreating, {
        accountDTO,
        trx,
      } as IAccountEventCreatingPayload);

      // Inserts account to the storage.
      const account = await this.accountModel()
        .query()
        .insert({
          ...accountInputModel,
        });
      // Triggers `onAccountCreated` event.
      await this.eventEmitter.emitAsync(events.accounts.onCreated, {
        account,
        accountId: account.id,
        trx,
      } as IAccountEventCreatedPayload);

      return account;
    }, trx);
  };
}
