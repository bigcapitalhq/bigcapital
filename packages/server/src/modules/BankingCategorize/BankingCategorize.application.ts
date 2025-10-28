import { Knex } from 'knex';
import { CategorizeBankTransaction } from './commands/CategorizeBankTransaction';
import { UncategorizeBankTransactionService } from './commands/UncategorizeBankTransaction.service';
import { UncategorizeBankTransactionsBulk } from './commands/UncategorizeBankTransactionsBulk.service';
import { UncategorizedBankTransactionDto } from './dtos/CreateUncategorizedBankTransaction.dto';
import { CategorizeBankTransactionDto } from './dtos/CategorizeBankTransaction.dto';
import { CategorizeTransactionAsExpense } from './commands/CategorizeTransactionAsExpense';
import { CreateUncategorizedTransactionService } from './commands/CreateUncategorizedTransaction.service';
import { ICategorizeCashflowTransactioDTO } from './types/BankingCategorize.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BankingCategorizeApplication {
  constructor(
    private readonly categorizeBankTransaction: CategorizeBankTransaction,
    private readonly uncategorizeBankTransaction: UncategorizeBankTransactionService,
    private readonly uncategorizeBankTransactionsBulk: UncategorizeBankTransactionsBulk,
    private readonly categorizeTransactionAsExpense: CategorizeTransactionAsExpense,
    private readonly createUncategorizedTransaction: CreateUncategorizedTransactionService,
  ) {}

  /**
   * Categorize a bank transaction with the given ID and categorization data.
   * @param {number | Array<number>} uncategorizedTransactionId - The ID(s) of the uncategorized transaction(s) to categorize.
   * @param {CategorizeBankTransactionDto} categorizeDTO - Data for categorization.
   * @returns {Promise<any>} The result of the categorization operation.
   */
  public categorizeTransaction(
    uncategorizedTransactionId: number | Array<number>,
    categorizeDTO: CategorizeBankTransactionDto,
  ) {
    return this.categorizeBankTransaction.categorize(
      uncategorizedTransactionId,
      categorizeDTO,
    );
  }

  /**
   * Uncategorize a bank transaction with the given ID.
   * @param {number} uncategorizedTransactionId - The ID of the transaction to uncategorize.
   * @returns {Promise<Array<number>>} Array of affected transaction IDs.
   */
  public uncategorizeTransaction(
    uncategorizedTransactionId: number,
  ): Promise<Array<number>> {
    return this.uncategorizeBankTransaction.uncategorize(
      uncategorizedTransactionId,
    );
  }

  /**
   * Uncategorize multiple bank transactions in bulk.
   * @param {number | Array<number>} uncategorizedTransactionIds - The ID(s) of the transaction(s) to uncategorize.
   * @returns {Promise<void>}
   */
  public uncategorizeTransactionsBulk(
    uncategorizedTransactionIds: number | Array<number>,
  ) {
    return this.uncategorizeBankTransactionsBulk.uncategorizeBulk(
      uncategorizedTransactionIds,
    );
  }

  /**
   * Categorize a transaction as an expense.
   * @param {number} cashflowTransactionId - The ID of the cashflow transaction to categorize.
   * @param {ICategorizeCashflowTransactioDTO} transactionDTO - Data for categorization.
   * @returns {Promise<any>} The result of the categorization operation.
   */
  public categorizeTransactionAsExpenseType(
    cashflowTransactionId: number,
    transactionDTO: ICategorizeCashflowTransactioDTO,
  ) {
    return this.categorizeTransactionAsExpense.categorize(
      cashflowTransactionId,
      transactionDTO,
    );
  }

  /**
   * Create a new uncategorized bank transaction.
   * @param {UncategorizedBankTransactionDto} createDTO - Data for creating the uncategorized transaction.
   * @param {Knex.Transaction} [trx] - Optional Knex transaction.
   * @returns {Promise<any>} The created uncategorized transaction.
   */
  public createUncategorizedBankTransaction(
    createDTO: UncategorizedBankTransactionDto,
    trx?: Knex.Transaction,
  ) {
    return this.createUncategorizedTransaction.create(createDTO, trx);
  }
}
