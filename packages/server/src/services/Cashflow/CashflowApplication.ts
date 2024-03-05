import { Inject, Service } from 'typedi';
import { DeleteCashflowTransaction } from './DeleteCashflowTransactionService';
import { UncategorizeCashflowTransaction } from './UncategorizeCashflowTransaction';
import { CategorizeCashflowTransaction } from './CategorizeCashflowTransaction';
import {
  CategorizeTransactionAsExpenseDTO,
  CreateUncategorizedTransactionDTO,
  ICategorizeCashflowTransactioDTO,
  IUncategorizedCashflowTransaction,
} from '@/interfaces';
import { CategorizeTransactionAsExpense } from './CategorizeTransactionAsExpense';
import { GetUncategorizedTransactions } from './GetUncategorizedTransactions';
import { CreateUncategorizedTransaction } from './CreateUncategorizedTransaction';
import { GetUncategorizedTransaction } from './GetUncategorizedTransaction';

@Service()
export class CashflowApplication {
  @Inject()
  private deleteTransactionService: DeleteCashflowTransaction;

  @Inject()
  private uncategorizeTransactionService: UncategorizeCashflowTransaction;

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
   * Creates a new uncategorized cash transaction.
   * @param {number} tenantId
   * @param {CreateUncategorizedTransactionDTO} createUncategorizedTransactionDTO
   * @returns {IUncategorizedCashflowTransaction}
   */
  public createUncategorizedTransaction(
    tenantId: number,
    createUncategorizedTransactionDTO: CreateUncategorizedTransactionDTO
  ) {
    return this.createUncategorizedTransactionService.create(
      tenantId,
      createUncategorizedTransactionDTO
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
   * Categorize the given cashflow transaction.
   * @param {number} tenantId
   * @param {number} cashflowTransactionId
   * @param {ICategorizeCashflowTransactioDTO} categorizeDTO
   * @returns
   */
  public categorizeTransaction(
    tenantId: number,
    cashflowTransactionId: number,
    categorizeDTO: ICategorizeCashflowTransactioDTO
  ) {
    return this.categorizeTransactionService.categorize(
      tenantId,
      cashflowTransactionId,
      categorizeDTO
    );
  }

  /**
   * Categorizes the given cashflow transaction as expense transaction.
   * @param {number} tenantId
   * @param {number} cashflowTransactionId
   * @param {CategorizeTransactionAsExpenseDTO} transactionDTO
   * @returns
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
   * @returns {}
   */
  public getUncategorizedTransactions(tenantId: number, accountId: number) {
    return this.getUncategorizedTransactionsService.getTransactions(
      tenantId,
      accountId
    );
  }

  /**
   * 
   * @param {number} tenantId 
   * @param {number} uncategorizedTransactionId 
   * @returns 
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
}
