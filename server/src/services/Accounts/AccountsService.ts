import { Inject, Service } from 'typedi';
import { kebabCase } from 'lodash'
import TenancyService from 'services/Tenancy/TenancyService';
import { ServiceError } from 'exceptions';
import { IAccountDTO, IAccount, IAccountsFilter } from 'interfaces';
import { difference } from 'lodash';
import DynamicListingService from 'services/DynamicListing/DynamicListService';

@Service()
export default class AccountsService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject('logger')
  logger: any;

  /**
   * Retrieve account type or throws service error.
   * @param {number} tenantId - 
   * @param {number} accountTypeId - 
   * @return {IAccountType} 
   */
  private async getAccountTypeOrThrowError(tenantId: number, accountTypeId: number) {
    const { AccountType } = this.tenancy.models(tenantId);

    this.logger.info('[accounts] validating account type existance.', { tenantId, accountTypeId });
    const accountType = await AccountType.query().findById(accountTypeId);

    if (!accountType) {
      this.logger.info('[accounts] account type not found.');
      throw new ServiceError('account_type_not_found');
    }
    return accountType;
  }

  /**
   * Retrieve parent account or throw service error.
   * @param {number} tenantId 
   * @param {number} accountId 
   * @param {number} notAccountId 
   */
  private async getParentAccountOrThrowError(tenantId: number, accountId: number, notAccountId?: number) {
    const { Account } = this.tenancy.models(tenantId);

    this.logger.info('[accounts] validating parent account existance.', {
      tenantId, accountId, notAccountId,
    });
    const parentAccount = await Account.query().findById(accountId)
      .onBuild((query) => {
        if (notAccountId) {
          query.whereNot('id', notAccountId);
        }
      });
    if (!parentAccount) {
      this.logger.info('[accounts] parent account not found.', { tenantId, accountId });
      throw new ServiceError('parent_account_not_found');
    }
    return parentAccount;
  }

  /**
   * Throws error if the account type was not unique on the storage.
   * @param {number} tenantId 
   * @param {string} accountCode 
   * @param {number} notAccountId 
   */
  private async isAccountCodeUniqueOrThrowError(tenantId: number, accountCode: string, notAccountId?: number) {
    const { Account } = this.tenancy.models(tenantId);

    this.logger.info('[accounts] validating the account code unique on the storage.', {
      tenantId, accountCode, notAccountId,
    });
    const account = await Account.query().where('code', accountCode)
      .onBuild((query) => {
        if (notAccountId) {
          query.whereNot('id', notAccountId);
        }
      });

    if (account.length > 0) {
      this.logger.info('[accounts] account code is not unique.', { tenantId, accountCode });
      throw new ServiceError('account_code_not_unique');
    }
  }

  /**
   * Throws service error if parent account has different type.
   * @param {IAccountDTO} accountDTO 
   * @param {IAccount} parentAccount 
   */
  private throwErrorIfParentHasDiffType(accountDTO: IAccountDTO, parentAccount: IAccount) {
    if (accountDTO.accountTypeId !== parentAccount.accountTypeId) {
      throw new ServiceError('parent_has_different_type');
    }
  }

  /**
   * Retrieve account of throw service error in case account not found.
   * @param {number} tenantId 
   * @param {number} accountId 
   * @return {IAccount}
   */
  private async getAccountOrThrowError(tenantId: number, accountId: number) {
    const { Account } = this.tenancy.models(tenantId);

    this.logger.info('[accounts] validating the account existance.', { tenantId, accountId });
    const account = await Account.query().findById(accountId);

    if (!account) {
      this.logger.info('[accounts] the given account not found.', { accountId });
      throw new ServiceError('account_not_found');
    }
    return account;
  }

  /**
   * Diff account type between new and old account, throw service error
   * if they have different account type.
   * 
   * @param {IAccount|IAccountDTO} oldAccount
   * @param {IAccount|IAccountDTO} newAccount
   */
  private async isAccountTypeChangedOrThrowError(
    oldAccount: IAccount|IAccountDTO,
    newAccount: IAccount|IAccountDTO,
  ) {
    if (oldAccount.accountTypeId !== newAccount.accountTypeId) {
      throw new ServiceError('account_type_not_allowed_to_changed');
    }
  }

  /**
   * Validates the account name uniquiness.
   * @param {number} tenantId 
   * @param {string} accountName 
   * @param {number} notAccountId - Ignore the account id.
   */
  private async validateAccountNameUniquiness(tenantId: number, accountName: string, notAccountId?: number) {
    const { Account } = this.tenancy.models(tenantId);

    this.logger.info('[accounts] validating account name uniquiness.', { tenantId, accountName, notAccountId });
    const foundAccount = await Account.query().findOne('name', accountName).onBuild((query) => {
      if (notAccountId) {
        query.whereNot('id', notAccountId);
      }
    });
    if (foundAccount) {
      throw new ServiceError('account_name_not_unqiue');
    }
  }

  /**
   * Creates a new account on the storage.
   * @param {number} tenantId 
   * @param {IAccount} accountDTO 
   * @returns {IAccount} 
   */
  public async newAccount(tenantId: number, accountDTO: IAccountDTO) {
    const { Account } = this.tenancy.models(tenantId);
  
    // Validate account name uniquiness.
    await this.validateAccountNameUniquiness(tenantId, accountDTO.name);

    // Validate the account code uniquiness.
    if (accountDTO.code) {
      await this.isAccountCodeUniqueOrThrowError(tenantId, accountDTO.code);
    }
    await this.getAccountTypeOrThrowError(tenantId, accountDTO.accountTypeId);

    if (accountDTO.parentAccountId) {
      const parentAccount = await this.getParentAccountOrThrowError(
        tenantId, accountDTO.parentAccountId
      );
      this.throwErrorIfParentHasDiffType(accountDTO, parentAccount);
    }
    const account = await Account.query().insertAndFetch({
      ...accountDTO,
      slug: kebabCase(accountDTO.name),
    });
    this.logger.info('[account] account created successfully.', { account, accountDTO });
    return account;
  }

  /**
   * Edits details of the given account.
   * @param {number} tenantId 
   * @param {number} accountId 
   * @param {IAccountDTO} accountDTO 
   */
  public async editAccount(tenantId: number, accountId: number, accountDTO: IAccountDTO) {
    const { Account } = this.tenancy.models(tenantId);
    const oldAccount = await this.getAccountOrThrowError(tenantId, accountId);

    // Validate account name uniquiness.
    await this.validateAccountNameUniquiness(tenantId, accountDTO.name, accountId);

    await this.isAccountTypeChangedOrThrowError(oldAccount, accountDTO);
     
    // Validate the account code not exists on the storage.
    if (accountDTO.code && accountDTO.code !== oldAccount.code) {
      await this.isAccountCodeUniqueOrThrowError(
        tenantId,
        accountDTO.code,
        oldAccount.id
      );
    }
    if (accountDTO.parentAccountId) {
      const parentAccount = await this.getParentAccountOrThrowError(
        accountDTO.parentAccountId, oldAccount.id,
      );
      this.throwErrorIfParentHasDiffType(accountDTO, parentAccount);
    }
    // Update the account on the storage.
    const account = await Account.query().patchAndFetchById(
      oldAccount.id, { ...accountDTO }
    );
    this.logger.info('[account] account edited successfully.', {
      account, accountDTO, tenantId
    });
    return account;
  }

  /**
   * Retrieve the given account details.
   * @param {number} tenantId 
   * @param {number} accountId 
   */
  public async getAccount(tenantId: number, accountId: number) {
    return this.getAccountOrThrowError(tenantId, accountId);
  }

  /**
   * Detarmine if the given account id exists on the storage.
   * @param {number} tenantId 
   * @param {number} accountId 
   */
  public async isAccountExists(tenantId: number, accountId: number) {
    const { Account } = this.tenancy.models(tenantId);

    this.logger.info('[account] validating the account existance.', { tenantId, accountId });
    const foundAccounts = await Account.query()
      .where('id', accountId);

    return foundAccounts.length > 0;
  }

  public async getAccountByType(tenantId: number, accountTypeKey: string) {
    const { AccountType, Account } = this.tenancy.models(tenantId);
    const accountType = await AccountType.query()
      .findOne('key', accountTypeKey);

    const account = await Account.query()
      .findOne('account_type_id', accountType.id);

    return account;
  }

  /**
   * Throws error if the account was prefined.
   * @param {IAccount} account 
   */
  private throwErrorIfAccountPredefined(account: IAccount) {
    if (account.prefined) {
      throw new ServiceError('account_predefined');
    }
  }

  /**
   * Throws error if account has children accounts.
   * @param {number} tenantId 
   * @param {number} accountId 
   */
  private async throwErrorIfAccountHasChildren(tenantId: number, accountId: number) {
    const { Account } = this.tenancy.models(tenantId);

    this.logger.info('[account] validating if the account has children.', {
      tenantId, accountId,
    });
    const childAccounts = await Account.query().where(
      'parent_account_id',
      accountId,
    );
    if (childAccounts.length > 0) {
      throw new ServiceError('account_has_children');
    }
  }

  /**
   * Throws service error if the account has associated transactions.
   * @param {number} tenantId 
   * @param {number} accountId 
   */
  private async throwErrorIfAccountHasTransactions(tenantId: number, accountId: number) {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const accountTransactions = await AccountTransaction.query().where(
      'account_id', accountId,
    );
    if (accountTransactions.length > 0) {
      throw new ServiceError('account_has_associated_transactions');
    }
  }

  /**
   * Deletes the account from the storage.
   * @param {number} tenantId 
   * @param {number} accountId 
   */
  public async deleteAccount(tenantId: number, accountId: number) {
    const { Account } = this.tenancy.models(tenantId);
    const account = await this.getAccountOrThrowError(tenantId, accountId);

    this.throwErrorIfAccountPredefined(account);

    await this.throwErrorIfAccountHasChildren(tenantId, accountId);
    await this.throwErrorIfAccountHasTransactions(tenantId, accountId);

    await Account.query().deleteById(account.id);
    this.logger.info('[account] account has been deleted successfully.', {
      tenantId, accountId,
    })
  }

  /**
   * Retrieve the given accounts details or throw error if one account not exists.
   * @param {number} tenantId 
   * @param {number[]} accountsIds 
   * @return {IAccount[]}
   */
  private async getAccountsOrThrowError(tenantId: number, accountsIds: number[]): IAccount[] {
    const { Account } = this.tenancy.models(tenantId);

    this.logger.info('[account] trying to validate accounts not exist.', { tenantId, accountsIds });
    const storedAccounts = await Account.query().whereIn('id', accountsIds);
    const storedAccountsIds = storedAccounts.map((account) => account.id);
    const notFoundAccounts = difference(accountsIds, storedAccountsIds);

    if (notFoundAccounts.length > 0) {
      this.logger.error('[account] accounts not exists on the storage.', { tenantId, notFoundAccounts });
      throw new ServiceError('accounts_not_found');
    }
    return storedAccounts;
  }

  private validatePrefinedAccounts(accounts: IAccount[]) {
    const predefined = accounts.filter((account: IAccount) => account.predefined);

    if (predefined.length > 0) {
      this.logger.error('[accounts] some accounts predefined.', { predefined });
      throw new ServiceError('predefined_accounts');
    }
    return predefined;
  }

  /**
   * Validating the accounts have associated transactions.
   * @param {number} tenantId 
   * @param {number[]} accountsIds 
   */
  private async validateAccountsHaveTransactions(tenantId: number, accountsIds: number[]) {
    const { AccountTransaction } = this.tenancy.models(tenantId);
    const accountsTransactions = await AccountTransaction.query()
      .whereIn('account_id', accountsIds)
      .count('id as transactions_count')
      .groupBy('account_id')
      .select('account_id');

    const accountsHasTransactions: number[] = [];

    accountsTransactions.forEach((transaction) => {
      if (transaction.transactionsCount > 0) {
        accountsHasTransactions.push(transaction.accountId);
      }
    });
    if (accountsHasTransactions.length > 0) {
      throw new ServiceError('accounts_have_transactions');
    }
  }

  /**
   * Deletes the given accounts in bulk.
   * @param {number} tenantId 
   * @param {number[]} accountsIds 
   */
  public async deleteAccounts(tenantId: number, accountsIds: number[]) {
    const { Account } = this.tenancy.models(tenantId);
    const accounts = await this.getAccountsOrThrowError(tenantId, accountsIds);

    this.validatePrefinedAccounts(accounts);
    await this.validateAccountsHaveTransactions(tenantId, accountsIds);
    await Account.query().whereIn('id', accountsIds).delete();

    this.logger.info('[account] given accounts deleted in bulk successfully.', {
      tenantId, accountsIds
    });
  }

  /**
   * Activate accounts in bulk.
   * @param {number} tenantId 
   * @param {number[]} accountsIds 
   * @param {boolean} activate 
   */
  public async activateAccounts(tenantId: number, accountsIds: number[], activate: boolean = true) {
    const { Account } = this.tenancy.models(tenantId);
    const accounts = await this.getAccountsOrThrowError(tenantId, accountsIds);

    this.logger.info('[account] trying activate/inactive the given accounts ids.', { accountsIds });
    await Account.query().whereIn('id', accountsIds)
      .patch({
        active: activate ? 1 : 0,
      });
    this.logger.info('[account] accounts have been activated successfully.', { tenantId, accountsIds });
  }

  /**
   * Activates/Inactivates the given account.
   * @param {number} tenantId 
   * @param {number} accountId 
   * @param {boolean} activate 
   */
  public async activateAccount(tenantId: number, accountId: number, activate?: boolean) {
    const { Account } = this.tenancy.models(tenantId);
    const account = await this.getAccountOrThrowError(tenantId, accountId);

    this.logger.info('[account] trying to activate/inactivate the given account id.');
    await Account.query().where('id', accountId)
      .patch({
        active: activate ? 1 : 0,
      })
    this.logger.info('[account] account have been activated successfully.', { tenantId, accountId });
  }

  /** 
   * Retrieve accounts datatable list.
   * @param {number} tenantId 
   * @param {IAccountsFilter} accountsFilter 
   */
  async getAccountsList(tenantId: number, filter: IAccountsFilter) {
    const { Account } = this.tenancy.models(tenantId);

    const dynamicList = await this.dynamicListService.dynamicList(tenantId, Account, filter);

    this.logger.info('[accounts] trying to get accounts datatable list.', { tenantId, filter });
    const accounts = await Account.query().onBuild((builder) => {
      builder.withGraphFetched('type');
      dynamicList.buildQuery()(builder);
    });
    return accounts;
  }
}
