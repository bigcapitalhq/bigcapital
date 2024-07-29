import { Inject, Service } from 'typedi';
import { ExcludeBankTransaction } from './ExcludeBankTransaction';
import { UnexcludeBankTransaction } from './UnexcludeBankTransaction';
import { GetExcludedBankTransactionsService } from './GetExcludedBankTransactions';
import { ExcludedBankTransactionsQuery } from './_types';
import { UnexcludeBankTransactions } from './UnexcludeBankTransactions';
import { ExcludeBankTransactions } from './ExcludeBankTransactions';

@Service()
export class ExcludeBankTransactionsApplication {
  @Inject()
  private excludeBankTransactionService: ExcludeBankTransaction;

  @Inject()
  private unexcludeBankTransactionService: UnexcludeBankTransaction;

  @Inject()
  private getExcludedBankTransactionsService: GetExcludedBankTransactionsService;

  @Inject()
  private excludeBankTransactionsService: ExcludeBankTransactions;

  @Inject()
  private unexcludeBankTransactionsService: UnexcludeBankTransactions;

  /**
   * Marks a bank transaction as excluded.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} bankTransactionId - The ID of the bank transaction to exclude.
   * @returns {Promise<void>}
   */
  public excludeBankTransaction(tenantId: number, bankTransactionId: number) {
    return this.excludeBankTransactionService.excludeBankTransaction(
      tenantId,
      bankTransactionId
    );
  }

  /**
   * Marks a bank transaction as not excluded.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} bankTransactionId - The ID of the bank transaction to exclude.
   * @returns {Promise<void>}
   */
  public unexcludeBankTransaction(tenantId: number, bankTransactionId: number) {
    return this.unexcludeBankTransactionService.unexcludeBankTransaction(
      tenantId,
      bankTransactionId
    );
  }

  /**
   * Retrieves the excluded bank transactions.
   * @param {number} tenantId
   * @param {ExcludedBankTransactionsQuery} filter
   * @returns {}
   */
  public getExcludedBankTransactions(
    tenantId: number,
    filter: ExcludedBankTransactionsQuery
  ) {
    return this.getExcludedBankTransactionsService.getExcludedBankTransactions(
      tenantId,
      filter
    );
  }

  /**
   * Exclude the given bank transactions in bulk.
   * @param {number} tenantId
   * @param {Array<number> | number} bankTransactionIds
   * @returns {Promise<void>}
   */
  public excludeBankTransactions(
    tenantId: number,
    bankTransactionIds: Array<number> | number
  ): Promise<void> {
    return this.excludeBankTransactionsService.excludeBankTransactions(
      tenantId,
      bankTransactionIds
    );
  }

  /**
   * Exclude the given bank transactions in bulk.
   * @param {number} tenantId
   * @param {Array<number> | number} bankTransactionIds
   * @returns {Promise<void>}
   */
  public unexcludeBankTransactions(
    tenantId: number,
    bankTransactionIds: Array<number> | number
  ): Promise<void> {
    return this.unexcludeBankTransactionsService.unexcludeBankTransactions(
      tenantId,
      bankTransactionIds
    );
  }
}
