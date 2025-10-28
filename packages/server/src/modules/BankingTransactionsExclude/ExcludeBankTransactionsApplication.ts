import { ExcludeBankTransactionService } from './commands/ExcludeBankTransaction.service';
import { UnexcludeBankTransactionService } from './commands/UnexcludeBankTransaction.service';
import { GetExcludedBankTransactionsService } from './queries/GetExcludedBankTransactions';
import { ExcludedBankTransactionsQuery } from './types/BankTransactionsExclude.types';
import { UnexcludeBankTransactionsService } from './commands/UnexcludeBankTransactions.service';
import { ExcludeBankTransactionsService } from './commands/ExcludeBankTransactions.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExcludeBankTransactionsApplication {
  constructor(
    private readonly excludeBankTransactionService: ExcludeBankTransactionService,
    private readonly unexcludeBankTransactionService: UnexcludeBankTransactionService,
    private readonly getExcludedBankTransactionsService: GetExcludedBankTransactionsService,
    private readonly excludeBankTransactionsService: ExcludeBankTransactionsService,
    private readonly unexcludeBankTransactionsService: UnexcludeBankTransactionsService,
  ) {}

  /**
   * Marks a bank transaction as excluded.
   * @param {number} bankTransactionId - The ID of the bank transaction to exclude.
   * @returns {Promise<void>}
   */
  public excludeBankTransaction(bankTransactionId: number) {
    return this.excludeBankTransactionService.excludeBankTransaction(
      bankTransactionId,
    );
  }

  /**
   * Marks a bank transaction as not excluded.
   * @param {number} bankTransactionId - The ID of the bank transaction to exclude.
   * @returns {Promise<void>}
   */
  public unexcludeBankTransaction(bankTransactionId: number) {
    return this.unexcludeBankTransactionService.unexcludeBankTransaction(
      bankTransactionId,
    );
  }

  /**
   * Retrieves the excluded bank transactions.
   * @param {ExcludedBankTransactionsQuery} filter
   * @returns {}
   */
  public getExcludedBankTransactions(filter: ExcludedBankTransactionsQuery) {
    return this.getExcludedBankTransactionsService.getExcludedBankTransactions(
      filter,
    );
  }

  /**
   * Exclude the given bank transactions in bulk.
   * @param {Array<number> | number} bankTransactionIds
   * @returns {Promise<void>}
   */
  public excludeBankTransactions(
    bankTransactionIds: Array<number> | number,
  ): Promise<void> {
    return this.excludeBankTransactionsService.excludeBankTransactions(
      bankTransactionIds,
    );
  }

  /**
   * Exclude the given bank transactions in bulk.
   * @param {Array<number> | number} bankTransactionIds
   * @returns {Promise<void>}
   */
  public unexcludeBankTransactions(
    bankTransactionIds: Array<number> | number,
  ): Promise<void> {
    return this.unexcludeBankTransactionsService.unexcludeBankTransactions(
      bankTransactionIds,
    );
  }
}
