import { Inject, Service } from 'typedi';
import TenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError } from '@/exceptions';
import { IAccountDTO, IAccount, IAccountCreateDTO } from '@/interfaces';
import AccountTypesUtils from '@/lib/AccountTypes';
import { ERRORS, MAX_ACCOUNTS_CHART_DEPTH } from './constants';

@Service()
export class CommandAccountValidators {
  @Inject()
  private tenancy: TenancyService;

  /**
   * Throws error if the account was predefined.
   * @param {IAccount} account
   */
  public throwErrorIfAccountPredefined(account: IAccount) {
    if (account.predefined) {
      throw new ServiceError(ERRORS.ACCOUNT_PREDEFINED);
    }
  }

  /**
   * Diff account type between new and old account, throw service error
   * if they have different account type.
   *
   * @param {IAccount|IAccountDTO} oldAccount
   * @param {IAccount|IAccountDTO} newAccount
   */
  public async isAccountTypeChangedOrThrowError(
    oldAccount: IAccount | IAccountDTO,
    newAccount: IAccount | IAccountDTO
  ) {
    if (oldAccount.accountType !== newAccount.accountType) {
      throw new ServiceError(ERRORS.ACCOUNT_TYPE_NOT_ALLOWED_TO_CHANGE);
    }
  }

  /**
   * Retrieve account type or throws service error.
   * @param {number} tenantId -
   * @param {number} accountTypeId -
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
   * @param {number} tenantId
   * @param {number} accountId
   * @param {number} notAccountId
   */
  public async getParentAccountOrThrowError(
    tenantId: number,
    accountId: number,
    notAccountId?: number
  ) {
    const { Account } = this.tenancy.models(tenantId);

    const parentAccount = await Account.query()
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
   * @param {number} tenantId
   * @param {string} accountCode
   * @param {number} notAccountId
   */
  public async isAccountCodeUniqueOrThrowError(
    tenantId: number,
    accountCode: string,
    notAccountId?: number
  ) {
    const { Account } = this.tenancy.models(tenantId);

    const account = await Account.query()
      .where('code', accountCode)
      .onBuild((query) => {
        if (notAccountId) {
          query.whereNot('id', notAccountId);
        }
      });

    if (account.length > 0) {
      throw new ServiceError(ERRORS.ACCOUNT_CODE_NOT_UNIQUE);
    }
  }

  /**
   * Validates the account name uniquiness.
   * @param {number} tenantId
   * @param {string} accountName
   * @param {number} notAccountId - Ignore the account id.
   */
  public async validateAccountNameUniquiness(
    tenantId: number,
    accountName: string,
    notAccountId?: number
  ) {
    const { Account } = this.tenancy.models(tenantId);

    const foundAccount = await Account.query()
      .findOne('name', accountName)
      .onBuild((query) => {
        if (notAccountId) {
          query.whereNot('id', notAccountId);
        }
      });
    if (foundAccount) {
      throw new ServiceError(ERRORS.ACCOUNT_NAME_NOT_UNIQUE);
    }
  }

  /**
   * Validates the given account type supports multi-currency.
   * @param {IAccountDTO} accountDTO -
   */
  public validateAccountTypeSupportCurrency = (
    accountDTO: IAccountCreateDTO,
    baseCurrency: string
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
   * @param  {IAccountCreateDTO} accountDTO
   * @param  {IAccount} parentAccount
   * @param  {string} baseCurrency -
   * @throws {ServiceError(ERRORS.ACCOUNT_CURRENCY_NOT_SAME_PARENT_ACCOUNT)}
   */
  public validateCurrentSameParentAccount = (
    accountDTO: IAccountCreateDTO,
    parentAccount: IAccount,
    baseCurrency: string
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
    accountDTO: IAccountDTO,
    parentAccount: IAccount
  ) {
    if (accountDTO.accountType !== parentAccount.accountType) {
      throw new ServiceError(ERRORS.PARENT_ACCOUNT_HAS_DIFFERENT_TYPE);
    }
  }

  /**
   * Retrieve account of throw service error in case account not found.
   * @param {number} tenantId
   * @param {number} accountId
   * @return {IAccount}
   */
  public async getAccountOrThrowError(tenantId: number, accountId: number) {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const account = await accountRepository.findOneById(accountId);

    if (!account) {
      throw new ServiceError(ERRORS.ACCOUNT_NOT_FOUND);
    }
    return account;
  }

  /**
   * Validates the max depth level of accounts chart.
   * @param {number} tenantId - Tenant id.
   * @param {number} parentAccountId - Parent account id.
   */
  public async validateMaxParentAccountDepthLevels(
    tenantId: number,
    parentAccountId: number
  ) {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const accountsGraph = await accountRepository.getDependencyGraph();

    const parentDependantsIds = accountsGraph.dependantsOf(parentAccountId);

    if (parentDependantsIds.length >= MAX_ACCOUNTS_CHART_DEPTH) {
      throw new ServiceError(ERRORS.PARENT_ACCOUNT_EXCEEDED_THE_DEPTH_LEVEL);
    }
  }
}
