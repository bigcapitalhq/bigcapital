// @ts-nocheck
import { Inject, Injectable, Scope } from '@nestjs/common';
// import { IAccountDTO, IAccount, IAccountCreateDTO } from './Accounts.types';
// import AccountTypesUtils from '@/lib/AccountTypes';
import { ServiceError } from '../Items/ServiceError';
import { ERRORS, MAX_ACCOUNTS_CHART_DEPTH } from './constants';
import { Account } from './models/Account.model';
import { AccountRepository } from './repositories/Account.repository';
import { AccountTypesUtils } from './utils/AccountType.utils';
import { CreateAccountDTO } from './CreateAccount.dto';
import { EditAccountDTO } from './EditAccount.dto';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable({ scope: Scope.REQUEST })
export class CommandAccountValidators {
  constructor(
    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
    private readonly accountRepository: AccountRepository,
  ) { }

  /**
   * Throws error if the account was prefined.
   * @param {Account} account
   */
  public throwErrorIfAccountPredefined(account: Account) {
    if (account.predefined) {
      throw new ServiceError(ERRORS.ACCOUNT_PREDEFINED);
    }
  }

  /**
   * Diff account type between new and old account, throw service error
   * if they have different account type.
   * @param {Account|CreateAccountDTO|EditAccountDTO} oldAccount
   * @param {Account|CreateAccountDTO|EditAccountDTO} newAccount
   */
  public async isAccountTypeChangedOrThrowError(
    oldAccount: Account | CreateAccountDTO | EditAccountDTO,
    newAccount: Account | CreateAccountDTO | EditAccountDTO,
  ) {
    if (oldAccount.accountType !== newAccount.accountType) {
      throw new ServiceError(ERRORS.ACCOUNT_TYPE_NOT_ALLOWED_TO_CHANGE);
    }
  }

  /**
   * Retrieve account type or throws service error.
   * @param {string} accountTypeKey -
   * @return {IAccountType}
   */
  public getAccountTypeOrThrowError(accountTypeKey: string) {
    const accountType = AccountTypesUtils.getType(accountTypeKey);

    if (!accountType) {
      throw new ServiceError(ERRORS.ACCOUNT_TYPE_NOT_FOUND);
    }
    return accountType;
  }

  /**
   * Retrieve parent account or throw service error.
   * @param {number} accountId - Account id.
   * @param {number} notAccountId - Ignore the account id.
   */
  public async getParentAccountOrThrowError(
    accountId: number,
    notAccountId?: number,
  ) {
    const parentAccount = await this.accountModel()
      .query()
      .findById(accountId)
      .onBuild((query) => {
        if (notAccountId) {
          query.whereNot('id', notAccountId);
        }
      });
    if (!parentAccount) {
      throw new ServiceError(ERRORS.PARENT_ACCOUNT_NOT_FOUND);
    }
    return parentAccount;
  }

  /**
   * Throws error if the account type was not unique on the storage.
   * @param {string} accountCode - Account code.
   * @param {number} notAccountId - Ignore the account id.
   */
  public async isAccountCodeUniqueOrThrowError(
    accountCode: string,
    notAccountId?: number,
  ) {
    const account = await this.accountModel()
      .query()
      .where('code', accountCode)
      .onBuild((query) => {
        if (notAccountId) {
          query.whereNot('id', notAccountId);
        }
      });
    if (account.length > 0) {
      throw new ServiceError(
        ERRORS.ACCOUNT_CODE_NOT_UNIQUE,
        'Account code is not unique.',
      );
    }
  }

  /**
   * Validates the account name uniquiness.
   * @param {string} accountName - Account name.
   * @param {number} notAccountId - Ignore the account id.
   */
  public async validateAccountNameUniquiness(
    accountName: string,
    notAccountId?: number,
  ) {
    const foundAccount = await this.accountModel()
      .query()
      .findOne('name', accountName)
      .onBuild((query) => {
        if (notAccountId) {
          query.whereNot('id', notAccountId);
        }
      });
    if (foundAccount) {
      throw new ServiceError(
        ERRORS.ACCOUNT_NAME_NOT_UNIQUE,
        'Account name is not unique.',
      );
    }
  }

  /**
   * Validates the given account type supports multi-currency.
   * @param {CreateAccountDTO | EditAccountDTO} accountDTO -
   */
  public validateAccountTypeSupportCurrency = (
    accountDTO: CreateAccountDTO | EditAccountDTO,
    baseCurrency: string,
  ) => {
    // Can't continue to validate the type has multi-currency feature
    // if the given currency equals the base currency or not assigned.
    if (accountDTO.currencyCode === baseCurrency || !accountDTO.currencyCode) {
      return;
    }
    const meta = AccountTypesUtils.getType(accountDTO.accountType);

    // Throw error if the account type does not support multi-currency.
    if (!meta?.multiCurrency) {
      throw new ServiceError(ERRORS.ACCOUNT_TYPE_NOT_SUPPORTS_MULTI_CURRENCY);
    }
  };

  /**
   * Validates the account DTO currency code whether equals the currency code of
   * parent account.
   * @param {CreateAccountDTO | EditAccountDTO} accountDTO
   * @param {Account} parentAccount
   * @param {string} baseCurrency -
   * @throws {ServiceError(ERRORS.ACCOUNT_CURRENCY_NOT_SAME_PARENT_ACCOUNT)}
   */
  public validateCurrentSameParentAccount = (
    accountDTO: CreateAccountDTO | EditAccountDTO,
    parentAccount: Account,
    baseCurrency: string,
  ) => {
    // If the account DTO currency not assigned and the parent account has no base currency.
    if (
      !accountDTO.currencyCode &&
      parentAccount.currencyCode !== baseCurrency
    ) {
      throw new ServiceError(ERRORS.ACCOUNT_CURRENCY_NOT_SAME_PARENT_ACCOUNT);
    }
    // If the account DTO is assigned and not equals the currency code of parent account.
    if (
      accountDTO.currencyCode &&
      parentAccount.currencyCode !== accountDTO.currencyCode
    ) {
      throw new ServiceError(ERRORS.ACCOUNT_CURRENCY_NOT_SAME_PARENT_ACCOUNT);
    }
  };

  /**
   * Throws service error if parent account has different type.
   * @param {IAccountDTO} accountDTO
   * @param {IAccount} parentAccount
   */
  public throwErrorIfParentHasDiffType(
    accountDTO: CreateAccountDTO | EditAccountDTO,
    parentAccount: Account,
  ) {
    if (accountDTO.accountType !== parentAccount.accountType) {
      throw new ServiceError(ERRORS.PARENT_ACCOUNT_HAS_DIFFERENT_TYPE);
    }
  }

  /**
   * Retrieve account of throw service error in case account not found.
   * @param {number} accountId
   * @return {IAccount}
   */
  public async getAccountOrThrowError(accountId: number) {
    const account = await this.accountRepository.findOneById(accountId);

    if (!account) {
      throw new ServiceError(ERRORS.ACCOUNT_NOT_FOUND);
    }
    return account;
  }

  /**
   * Validates the max depth level of accounts chart.
   * @param {number} parentAccountId - Parent account id.
   */
  public async validateMaxParentAccountDepthLevels(parentAccountId: number) {
    const accountsGraph = await this.accountRepository.getDependencyGraph();
    const parentDependantsIds = accountsGraph.dependantsOf(parentAccountId);

    if (parentDependantsIds.length >= MAX_ACCOUNTS_CHART_DEPTH) {
      throw new ServiceError(ERRORS.PARENT_ACCOUNT_EXCEEDED_THE_DEPTH_LEVEL);
    }
  }
}
