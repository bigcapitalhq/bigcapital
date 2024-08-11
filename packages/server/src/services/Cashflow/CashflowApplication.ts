import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { DeleteCashflowTransaction } from './DeleteCashflowTransactionService';
import { UncategorizeCashflowTransaction } from './UncategorizeCashflowTransaction';
import { CategorizeCashflowTransaction } from './CategorizeCashflowTransaction';
import {
  CategorizeTransactionAsExpenseDTO,
  CreateUncategorizedTransactionDTO,
  ICashflowAccountsFilter,
  ICashflowNewCommandDTO,
  ICategorizeCashflowTransactioDTO,
  IGetRecognizedTransactionsQuery,
  IGetUncategorizedTransactionsQuery,
} from '@/interfaces';
import { CategorizeTransactionAsExpense } from './CategorizeTransactionAsExpense';
import { GetUncategorizedTransactions } from './GetUncategorizedTransactions';
import { CreateUncategorizedTransaction } from './CreateUncategorizedTransaction';
import { GetUncategorizedTransaction } from './GetUncategorizedTransaction';
import NewCashflowTransactionService from './NewCashflowTransactionService';
import GetCashflowAccountsService from './GetCashflowAccountsService';
import { GetCashflowTransactionService } from './GetCashflowTransactionsService';
import { GetRecognizedTransactionsService } from './GetRecongizedTransactions';
import { GetRecognizedTransactionService } from './GetRecognizedTransaction';
import { UncategorizeCashflowTransactionsBulk } from './UncategorizeCashflowTransactionsBulk';

@Service()
export class CashflowApplication {
  @Inject()
  private createTransactionService: NewCashflowTransactionService;

  @Inject()
  private deleteTransactionService: DeleteCashflowTransaction;

  @Inject()
  private getCashflowAccountsService: GetCashflowAccountsService;

  @Inject()
  private getCashflowTransactionService: GetCashflowTransactionService;

  @Inject()
  private uncategorizeTransactionService: UncategorizeCashflowTransaction;

  @Inject()
  private uncategorizeTransasctionsService: UncategorizeCashflowTransactionsBulk;

  @Inject()
  private categorizeTransactionService: CategorizeCashflowTransaction;

  @Inject()
  private categorizeAsExpenseService: CategorizeTransactionAsExpense;

  @Inject()
  private getUncategorizedTransactionsService: GetUncategorizedTransactions;

  @Inject()
  private getUncategorizedTransactionService: GetUncategorizedTransaction;

  @Inject()
  private createUncategorizedTransactionService: CreateUncategorizedTransaction;

  @Inject()
  private getRecognizedTranasctionsService: GetRecognizedTransactionsService;

  @Inject()
  private getRecognizedTransactionService: GetRecognizedTransactionService;

  /**
   * Creates a new cashflow transaction.
   * @param {number} tenantId
   * @param {ICashflowNewCommandDTO} transactionDTO
   * @param {number} userId
   * @returns
   */
  public createTransaction(
    tenantId: number,
    transactionDTO: ICashflowNewCommandDTO,
    userId?: number
  ) {
    return this.createTransactionService.newCashflowTransaction(
      tenantId,
      transactionDTO,
      userId
    );
  }

  /**
   * Deletes the given cashflow transaction.
   * @param {number} tenantId
   * @param {number} cashflowTransactionId
   * @returns
   */
  public deleteTransaction(tenantId: number, cashflowTransactionId: number) {
    return this.deleteTransactionService.deleteCashflowTransaction(
      tenantId,
      cashflowTransactionId
    );
  }

  /**
   * Retrieves specific cashflow transaction.
   * @param {number} tenantId
   * @param {number} cashflowTransactionId
   * @returns
   */
  public getTransaction(tenantId: number, cashflowTransactionId: number) {
    return this.getCashflowTransactionService.getCashflowTransaction(
      tenantId,
      cashflowTransactionId
    );
  }

  /**
   * Retrieves the cashflow accounts.
   * @param {number} tenantId
   * @param {ICashflowAccountsFilter} filterDTO
   * @returns
   */
  public getCashflowAccounts(
    tenantId: number,
    filterDTO: ICashflowAccountsFilter
  ) {
    return this.getCashflowAccountsService.getCashflowAccounts(
      tenantId,
      filterDTO
    );
  }

  /**
   * Creates a new uncategorized cash transaction.
   * @param {number} tenantId
   * @param {CreateUncategorizedTransactionDTO} createUncategorizedTransactionDTO
   * @returns {IUncategorizedCashflowTransaction}
   */
  public createUncategorizedTransaction(
    tenantId: number,
    createUncategorizedTransactionDTO: CreateUncategorizedTransactionDTO,
    trx?: Knex.Transaction
  ) {
    return this.createUncategorizedTransactionService.create(
      tenantId,
      createUncategorizedTransactionDTO,
      trx
    );
  }

  /**
   * Uncategorize the given cashflow transaction.
   * @param {number} tenantId
   * @param {number} cashflowTransactionId
   * @returns
   */
  public uncategorizeTransaction(
    tenantId: number,
    cashflowTransactionId: number
  ) {
    return this.uncategorizeTransactionService.uncategorize(
      tenantId,
      cashflowTransactionId
    );
  }

  /**
   * Uncategorize the given transactions in bulk.
   * @param {number} tenantId 
   * @param {number | Array<number>} transactionId 
   * @returns 
   */
  public uncategorizeTransactions(
    tenantId: number,
    transactionId: number | Array<number>
  ) {
    return this.uncategorizeTransasctionsService.uncategorizeBulk(
      tenantId,
      transactionId
    );
  }

  /**
   * Categorize the given cashflow transaction.
   * @param {number} tenantId
   * @param {number} cashflowTransactionId
   * @param {ICategorizeCashflowTransactioDTO} categorizeDTO
   * @returns
   */
  public categorizeTransaction(
    tenantId: number,
    uncategorizeTransactionIds: Array<number>,
    categorizeDTO: ICategorizeCashflowTransactioDTO
  ) {
    return this.categorizeTransactionService.categorize(
      tenantId,
      uncategorizeTransactionIds,
      categorizeDTO
    );
  }

  /**
   * Categorizes the given cashflow transaction as expense transaction.
   * @param {number} tenantId
   * @param {number} cashflowTransactionId
   * @param {CategorizeTransactionAsExpenseDTO} transactionDTO
   */
  public categorizeAsExpense(
    tenantId: number,
    cashflowTransactionId: number,
    transactionDTO: CategorizeTransactionAsExpenseDTO
  ) {
    return this.categorizeAsExpenseService.categorize(
      tenantId,
      cashflowTransactionId,
      transactionDTO
    );
  }

  /**
   * Retrieves the uncategorized cashflow transactions.
   * @param {number} tenantId
   */
  public getUncategorizedTransactions(
    tenantId: number,
    accountId: number,
    query: IGetUncategorizedTransactionsQuery
  ) {
    return this.getUncategorizedTransactionsService.getTransactions(
      tenantId,
      accountId,
      query
    );
  }

  /**
   * Retrieves specific uncategorized transaction.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   */
  public getUncategorizedTransaction(
    tenantId: number,
    uncategorizedTransactionId: number
  ) {
    return this.getUncategorizedTransactionService.getTransaction(
      tenantId,
      uncategorizedTransactionId
    );
  }

  /**
   * Retrieves the recognized bank transactions.
   * @param {number} tenantId
   * @param {number} accountId
   * @returns
   */
  public getRecognizedTransactions(
    tenantId: number,
    filter?: IGetRecognizedTransactionsQuery
  ) {
    return this.getRecognizedTranasctionsService.getRecognizedTranactions(
      tenantId,
      filter
    );
  }

  /**
   * Retrieves the recognized transaction of the given uncategorized transaction.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   * @returns
   */
  public getRecognizedTransaction(
    tenantId: number,
    uncategorizedTransactionId: number
  ) {
    return this.getRecognizedTransactionService.getRecognizedTransaction(
      tenantId,
      uncategorizedTransactionId
    );
  }
}
