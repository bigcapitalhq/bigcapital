import { Service, Inject } from 'typedi';
import {
  IAccount,
  IAccountCreateDTO,
  IAccountEditDTO,
  IAccountResponse,
  IAccountsFilter,
  IAccountsTransactionsFilter,
  IFilterMeta,
  IGetAccountTransactionPOJO,
} from '@/interfaces';
import { CreateAccount } from './CreateAccount';
import { DeleteAccount } from './DeleteAccount';
import { EditAccount } from './EditAccount';
import { ActivateAccount } from './ActivateAccount';
import { GetAccounts } from './GetAccounts';
import { GetAccount } from './GetAccount';
import { GetAccountTransactions } from './GetAccountTransactions';
import { Knex } from 'knex';

@Service()
export class AccountsApplication {
  @Inject()
  private createAccountService: CreateAccount;

  @Inject()
  private deleteAccountService: DeleteAccount;

  @Inject()
  private editAccountService: EditAccount;

  @Inject()
  private activateAccountService: ActivateAccount;

  @Inject()
  private getAccountsService: GetAccounts;

  @Inject()
  private getAccountService: GetAccount;

  @Inject()
  private getAccountTransactionsService: GetAccountTransactions;

  /**
   * Creates a new account.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} accountDTO
   * @returns {Promise<IAccount>}
   */
  public createAccount = (
    tenantId: number,
    accountDTO: IAccountCreateDTO,
    trx?: Knex.Transaction
  ): Promise<IAccount> => {
    return this.createAccountService.createAccount(tenantId, accountDTO, trx);
  };

  /**
   * Deletes the given account.
   * @param   {number} tenantId
   * @param   {number} accountId
   * @returns {Promise<void>}
   */
  public deleteAccount = (tenantId: number, accountId: number) => {
    return this.deleteAccountService.deleteAccount(tenantId, accountId);
  };

  /**
   * Edits the given account.
   * @param {number} tenantId
   * @param {number} accountId
   * @param {IAccountEditDTO} accountDTO
   * @returns
   */
  public editAccount = (
    tenantId: number,
    accountId: number,
    accountDTO: IAccountEditDTO
  ) => {
    return this.editAccountService.editAccount(tenantId, accountId, accountDTO);
  };

  /**
   * Activate the given account.
   * @param {number} tenantId -
   * @param {number} accountId -
   */
  public activateAccount = (tenantId: number, accountId: number) => {
    return this.activateAccountService.activateAccount(
      tenantId,
      accountId,
      true
    );
  };

  /**
   * Inactivate the given account.
   * @param {number} tenantId -
   * @param {number} accountId -
   */
  public inactivateAccount = (tenantId: number, accountId: number) => {
    return this.activateAccountService.activateAccount(
      tenantId,
      accountId,
      false
    );
  };

  /**
   * Retrieves the account details.
   * @param {number} tenantId
   * @param {number} accountId
   * @returns {Promise<IAccount>}
   */
  public getAccount = (tenantId: number, accountId: number) => {
    return this.getAccountService.getAccount(tenantId, accountId);
  };

  /**
   * Retrieves the accounts list.
   * @param {number} tenantId
   * @param {IAccountsFilter} filterDTO
   * @returns {Promise<{ accounts: IAccountResponse[]; filterMeta: IFilterMeta }>}
   */
  public getAccounts = (
    tenantId: number,
    filterDTO: IAccountsFilter
  ): Promise<{ accounts: IAccountResponse[]; filterMeta: IFilterMeta }> => {
    return this.getAccountsService.getAccountsList(tenantId, filterDTO);
  };

  /**
   * Retrieves the given account transactions.
   * @param {number} tenantId
   * @param {IAccountsTransactionsFilter} filter
   * @returns {Promise<IGetAccountTransactionPOJO[]>}
   */
  public getAccountsTransactions = (
    tenantId: number,
    filter: IAccountsTransactionsFilter
  ): Promise<IGetAccountTransactionPOJO[]> => {
    return this.getAccountTransactionsService.getAccountsTransactions(
      tenantId,
      filter
    );
  };
}
