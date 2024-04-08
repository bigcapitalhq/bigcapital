import {
  IAccount,
  IAccountCreateDTO,
  IAccountEventCreatedPayload,
  IAccountEventCreatingPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import TenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { TenantMetadata } from '@/system/models';
import { Knex } from 'knex';
import { kebabCase } from 'lodash';
import { Inject, Service } from 'typedi';
import { CommandAccountValidators } from './CommandAccountValidators';

@Service()
export class CreateAccount {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private validator: CommandAccountValidators;

  /**
   * Authorize the account creation.
   * @param  {number} tenantId
   * @param  {IAccountCreateDTO} accountDTO
   */
  private authorize = async (tenantId: number, accountDTO: IAccountCreateDTO, baseCurrency: string) => {
    // Validate account name uniquiness.
    await this.validator.validateAccountNameUniquiness(tenantId, accountDTO.name);
    // Validate the account code uniquiness.
    if (accountDTO.code) {
      await this.validator.isAccountCodeUniqueOrThrowError(tenantId, accountDTO.code);
    }
    // Retrieve the account type meta or throw service error if not found.
    this.validator.getAccountTypeOrThrowError(accountDTO.accountType);

    // Ingore the parent account validation if not presented.
    if (accountDTO.parentAccountId) {
      const parentAccount = await this.validator.getParentAccountOrThrowError(tenantId, accountDTO.parentAccountId);
      this.validator.throwErrorIfParentHasDiffType(accountDTO, parentAccount);

      // Inherit active status from parent account.
      accountDTO.active = parentAccount.active;

      // Validate should currency code be the same currency of parent account.
      this.validator.validateCurrentSameParentAccount(accountDTO, parentAccount, baseCurrency);
      // Validates the max depth level of accounts chart.
      await this.validator.validateMaxParentAccountDepthLevels(tenantId, accountDTO.parentAccountId);
    }
    // Validates the given account type supports the multi-currency.
    this.validator.validateAccountTypeSupportCurrency(accountDTO, baseCurrency);
  };

  /**
   * Transformes the create account DTO to input model.
   * @param   {IAccountCreateDTO} createAccountDTO
   */
  private transformDTOToModel = (createAccountDTO: IAccountCreateDTO, baseCurrency: string) => {
    return {
      ...createAccountDTO,
      slug: kebabCase(createAccountDTO.name),
      currencyCode: createAccountDTO.currencyCode || baseCurrency,
    };
  };

  /**
   * Creates a new account on the storage.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} accountDTO
   * @returns {Promise<IAccount>}
   */
  public createAccount = async (
    tenantId: number,
    accountDTO: IAccountCreateDTO,
    trx?: Knex.Transaction,
  ): Promise<IAccount> => {
    const { Account } = this.tenancy.models(tenantId);

    // Retrieves the given tenant metadata.
    const tenantMeta = await TenantMetadata.query().findOne({ tenantId });

    // Authorize the account creation.
    await this.authorize(tenantId, accountDTO, tenantMeta.baseCurrency);

    // Transformes the DTO to model.
    const accountInputModel = this.transformDTOToModel(accountDTO, tenantMeta.baseCurrency);
    // Creates a new account with associated transactions under unit-of-work envirement.
    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        // Triggers `onAccountCreating` event.
        await this.eventPublisher.emitAsync(events.accounts.onCreating, {
          tenantId,
          accountDTO,
          trx,
        } as IAccountEventCreatingPayload);

        // Inserts account to the storage.
        const account = await Account.query(trx).insertAndFetch({
          ...accountInputModel,
        });
        // Triggers `onAccountCreated` event.
        await this.eventPublisher.emitAsync(events.accounts.onCreated, {
          tenantId,
          account,
          accountId: account.id,
          trx,
        } as IAccountEventCreatedPayload);

        return account;
      },
      trx,
    );
  };
}
