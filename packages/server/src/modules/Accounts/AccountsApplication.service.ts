import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { CreateAccountService } from './CreateAccount.service';
import { DeleteAccount } from './DeleteAccount.service';
import { EditAccount } from './EditAccount.service';
import { CreateAccountDTO } from './CreateAccount.dto';
import { Account } from './models/Account.model';
import { EditAccountDTO } from './EditAccount.dto';
import { GetAccount } from './GetAccount.service';
import { ActivateAccount } from './ActivateAccount.service';
import { GetAccountTypesService } from './GetAccountTypes.service';
import { GetAccountTransactionsService } from './GetAccountTransactions.service';
import { IAccountsTransactionsFilter } from './Accounts.types';
import { GetAccountsService } from './GetAccounts.service';
import { IFilterMeta } from '@/interfaces/Model';
import { GetAccountTransactionResponseDto } from './dtos/GetAccountTransactionResponse.dto';
import { GetAccountsQueryDto } from './dtos/GetAccountsQuery.dto';

@Injectable()
export class AccountsApplication {
  /**
   * @param {CreateAccountService} createAccountService - The create account service.
   * @param {EditAccount} editAccountService - The edit account service.
   * @param {DeleteAccount} deleteAccountService - The delete account service.
   * @param {ActivateAccount} activateAccountService - The activate account service.
   * @param {GetAccountTypesService} getAccountTypesService - The get account types service.
   * @param {GetAccount} getAccountService - The get account service.
   * @param {GetAccountTransactionsService} getAccountTransactionsService - The get account transactions service.
   * @param {GetAccountsService} getAccountsService - The get accounts service.
   */
  constructor(
    private readonly createAccountService: CreateAccountService,
    private readonly editAccountService: EditAccount,
    private readonly deleteAccountService: DeleteAccount,
    private readonly activateAccountService: ActivateAccount,
    private readonly getAccountTypesService: GetAccountTypesService,
    private readonly getAccountService: GetAccount,
    private readonly getAccountTransactionsService: GetAccountTransactionsService,
    private readonly getAccountsService: GetAccountsService,
  ) { }

  /**
   * Creates a new account.
   * @param {number} tenantId
   * @param {IAccountCreateDTO} accountDTO
   * @returns {Promise<IAccount>}
   */
  public createAccount = (
    accountDTO: CreateAccountDTO,
    trx?: Knex.Transaction,
  ): Promise<Account> => {
    return this.createAccountService.createAccount(accountDTO, trx);
  };

  /**
   * Deletes the given account.
   * @param {number} tenantId
   * @param {number} accountId
   * @returns {Promise<void>}
   */
  public deleteAccount = (accountId: number) => {
    return this.deleteAccountService.deleteAccount(accountId);
  };

  /**
   * Edits the given account.
   * @param {number} tenantId
   * @param {number} accountId
   * @param {IAccountEditDTO} accountDTO
   * @returns
   */
  public editAccount = (accountId: number, accountDTO: EditAccountDTO) => {
    return this.editAccountService.editAccount(accountId, accountDTO);
  };

  /**
   * Activate the given account.
   * @param {number} accountId - Account id.
   */
  public activateAccount = (accountId: number) => {
    return this.activateAccountService.activateAccount(accountId, true);
  };

  /**
   * Inactivate the given account.
   * @param {number} accountId - Account id.
   */
  public inactivateAccount = (accountId: number) => {
    return this.activateAccountService.activateAccount(accountId, false);
  };

  /**
   * Retrieves the account details.
   * @param {number} tenantId - Tenant id.
   * @param {number} accountId - Account id.
   * @returns {Promise<IAccount>}
   */
  public getAccount = (accountId: number) => {
    return this.getAccountService.getAccount(accountId);
  };

  /**
   * Retrieves all account types.
   * @returns {Promise<IAccountType[]>}
   */
  public getAccountTypes = () => {
    return this.getAccountTypesService.getAccountsTypes();
  };

  /**
   * Retrieves the accounts list.
   * @param {GetAccountsQueryDto} filterDTO - Filter DTO.
   * @returns {Promise<{ accounts: IAccountResponse[]; filterMeta: IFilterMeta }>}
   */
  public getAccounts = (
    filterDTO: GetAccountsQueryDto,
  ): Promise<{ accounts: Account[]; filterMeta: IFilterMeta }> => {
    return this.getAccountsService.getAccountsList(filterDTO);
  };

  /**
   * Retrieves the given account transactions.
   * @param {IAccountsTransactionsFilter} filter
   * @returns {Promise<IGetAccountTransactionPOJO[]>}
   */
  public getAccountsTransactions = (
    filter: IAccountsTransactionsFilter,
  ): Promise<Array<GetAccountTransactionResponseDto>> => {
    return this.getAccountTransactionsService.getAccountsTransactions(filter);
  };
}
