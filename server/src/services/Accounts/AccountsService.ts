import { Inject, Service } from 'typedi';
import { difference, chain, uniq } from 'lodash';
import { kebabCase } from 'lodash'
import TenancyService from 'services/Tenancy/TenancyService';
import { ServiceError } from 'exceptions';
import { IAccountDTO, IAccount, IAccountsFilter, IFilterMeta } from 'interfaces';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import events from 'subscribers/events';

@Service()
export default class AccountsService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject('logger')
  logger: any;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

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
    const { accountRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[accounts] validating the account existance.', { tenantId, accountId });
    const account = await accountRepository.findById(accountId);

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
    const { accountRepository } = this.tenancy.repositories(tenantId);

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

      // Inherit active status from parent account.
      accountDTO.active = parentAccount.active;
    }
    const account = await accountRepository.insert({
      ...accountDTO,
      slug: kebabCase(accountDTO.name),
    });
    this.logger.info('[account] account created successfully.', { account, accountDTO });

    // Triggers `onAccountCreated` event.
    this.eventDispatcher.dispatch(events.accounts.onCreated);

    return account;
  }

  /**
   * Edits details of the given account.
   * @param {number} tenantId 
   * @param {number} accountId 
   * @param {IAccountDTO} accountDTO 
   */
  public async editAccount(tenantId: number, accountId: number, accountDTO: IAccountDTO) {
    this.logger.info('[account] trying to edit account.', { tenantId, accountId });

    const { accountRepository } = this.tenancy.repositories(tenantId);
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
        tenantId, accountDTO.parentAccountId, oldAccount.id,
      );
      this.throwErrorIfParentHasDiffType(accountDTO, parentAccount);
    }
    // Update the account on the storage.
    const account = await accountRepository.edit(oldAccount.id, accountDTO);
    this.logger.info('[account] account edited successfully.', {
      account, accountDTO, tenantId
    });
    // Triggers `onAccountEdited` event.
    this.eventDispatcher.dispatch(events.accounts.onEdited);

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

  /**
   * Throws error if the account was prefined.
   * @param {IAccount} account 
   */
  private throwErrorIfAccountPredefined(account: IAccount) {
    if (account.predefined) {
      throw new ServiceError('account_predefined');
    }
  }

  /**
   * Unlink the given parent account with children accounts.
   * @param {number} tenantId -
   * @param {number|number[]} parentAccountId -  
   */
  private async unassociateChildrenAccountsFromParent(
    tenantId: number,
    parentAccountId: number | number[],
  ) {
    const { Account } = this.tenancy.models(tenantId);
    const accountsIds = Array.isArray(parentAccountId) ? parentAccountId : [parentAccountId];

    await Account.query()
      .whereIn('parent_account_id', accountsIds)
      .patch({ parent_account_id: null });
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
    const { accountRepository } = this.tenancy.repositories(tenantId);
    const account = await this.getAccountOrThrowError(tenantId, accountId);

    // Throw error if the account was predefined.
    this.throwErrorIfAccountPredefined(account);

    // Throw error if the account has transactions.
    await this.throwErrorIfAccountHasTransactions(tenantId, accountId);

    // Unlink the parent account from children accounts.
    await this.unassociateChildrenAccountsFromParent(tenantId, accountId);

    await accountRepository.deleteById(account.id);
    this.logger.info('[account] account has been deleted successfully.', {
      tenantId, accountId,
    });

    // Triggers `onAccountDeleted` event.
    this.eventDispatcher.dispatch(events.accounts.onDeleted);
  }

  /**
   * Retrieve the given accounts details or throw error if one account not exists.
   * @param {number} tenantId 
   * @param {number[]} accountsIds 
   * @return {IAccount[]}
   */
  public async getAccountsOrThrowError(
    tenantId: number,
    accountsIds: number[]
  ): Promise<IAccount[]> {
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

  /**
   * Validate whether one of the given accounts is predefined.
   * @param  {IAccount[]} accounts -
   * @return {IAccount[]} - Predefined accounts
   */
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

    // Validate the accounts are not predefined.
    this.validatePrefinedAccounts(accounts);

    // Valdiate the accounts have transactions.
    await this.validateAccountsHaveTransactions(tenantId, accountsIds);

    // Unlink the parent account from children accounts.
    await this.unassociateChildrenAccountsFromParent(tenantId, accountsIds);

    // Delete the accounts in one query.
    await Account.query().whereIn('id', accountsIds).delete();

    this.logger.info('[account] given accounts deleted in bulk successfully.', {
      tenantId, accountsIds
    });
    // Triggers `onBulkDeleted` event.
    this.eventDispatcher.dispatch(events.accounts.onBulkDeleted);
  }

  /**
   * Activate accounts in bulk.
   * @param {number} tenantId 
   * @param {number[]} accountsIds 
   * @param {boolean} activate 
   */
  public async activateAccounts(tenantId: number, accountsIds: number[], activate: boolean = true) {
    const { Account } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    // Retrieve the given account or throw not found.
    await this.getAccountsOrThrowError(tenantId, accountsIds);

    // Get all children accounts.
    const accountsGraph = await accountRepository.getDependencyGraph();
    const dependenciesAccounts = chain(accountsIds)
      .map(accountId => accountsGraph.dependenciesOf(accountId))
      .flatten()
      .value();

    // The children and parent accounts.
    const patchAccountsIds = uniq([...dependenciesAccounts, accountsIds]);

    this.logger.info('[account] trying activate/inactive the given accounts ids.', { accountsIds });
    await Account.query().whereIn('id', patchAccountsIds)
      .patch({
        active: activate ? 1 : 0,
      });
    this.logger.info('[account] accounts have been activated successfully.', { tenantId, accountsIds });

    // Triggers `onAccountBulkActivated` event.
    this.eventDispatcher.dispatch(events.accounts.onActivated);
  }

  /**
   * Activates/Inactivates the given account.
   * @param {number} tenantId 
   * @param {number} accountId 
   * @param {boolean} activate 
   */
  public async activateAccount(tenantId: number, accountId: number, activate?: boolean) {
    const { Account } = this.tenancy.models(tenantId);
    const { accountRepository } = this.tenancy.repositories(tenantId);

    // Retrieve the given account or throw not found error.
    const account = await this.getAccountOrThrowError(tenantId, accountId);

    // Get all children accounts.
    const accountsGraph = await accountRepository.getDependencyGraph();
    const dependenciesAccounts = accountsGraph.dependenciesOf(accountId);

    this.logger.info('[account] trying to activate/inactivate the given account id.');
    await Account.query()
      .whereIn('id', [...dependenciesAccounts, accountId])
      .patch({
        active: activate ? 1 : 0,
      })
    this.logger.info('[account] account have been activated successfully.', {
      tenantId,
      accountId
    });

    // Triggers `onAccountActivated` event.
    this.eventDispatcher.dispatch(events.accounts.onActivated);
  }

  /** 
   * Retrieve accounts datatable list.
   * @param {number} tenantId 
   * @param {IAccountsFilter} accountsFilter 
   */
  public async getAccountsList(
    tenantId: number,
    filter: IAccountsFilter,
  ): Promise<{ accounts: IAccount[], filterMeta: IFilterMeta }> {
    const { Account } = this.tenancy.models(tenantId);
    const dynamicList = await this.dynamicListService.dynamicList(tenantId, Account, filter);

    this.logger.info('[accounts] trying to get accounts datatable list.', { tenantId, filter });
    const accounts = await Account.query().onBuild((builder) => {
      builder.withGraphFetched('type');
      dynamicList.buildQuery()(builder);
    });

    return {
      accounts,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }

  /**
   * Closes the given account.
   * -----------
   * Precedures.
   * -----------
   * - Transfer the given account transactions to another account with the same root type.
   * - Delete the given account.
   * -------
   * @param {number} tenantId - 
   * @param {number} accountId -
   * @param {number} toAccountId -
   * @param {boolean} deleteAfterClosing -
   */
  public async closeAccount(
    tenantId: number,
    accountId: number,
    toAccountId: number,
    deleteAfterClosing: boolean,
  ) {
    this.logger.info('[account] trying to close account.', { tenantId, accountId, toAccountId, deleteAfterClosing });

    const { AccountTransaction } = this.tenancy.models(tenantId);
    const { accountTypeRepository, accountRepository } = this.tenancy.repositories(tenantId);

    const account = await this.getAccountOrThrowError(tenantId, accountId);
    const toAccount = await this.getAccountOrThrowError(tenantId, toAccountId);

    this.throwErrorIfAccountPredefined(account);

    const accountType = await accountTypeRepository.getTypeMeta(account.accountTypeId);
    const toAccountType = await accountTypeRepository.getTypeMeta(toAccount.accountTypeId);

    if (accountType.rootType !== toAccountType.rootType) {
      throw new ServiceError('close_account_and_to_account_not_same_type');
    }
    const updateAccountBalanceOper = await accountRepository.balanceChange(accountId, account.balance || 0);

    // Move transactiosn operation.
    const moveTransactionsOper = await AccountTransaction.query()
      .where('account_id', accountId)
      .patch({ accountId: toAccountId });

    await Promise.all([ moveTransactionsOper, updateAccountBalanceOper ]);

    if (deleteAfterClosing) {
      await accountRepository.deleteById(accountId);
    }
  }
}
