import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { GetRecognizedTransactionsService } from './GetRecongizedTransactions';
import { GetRecognizedTransactionService } from './queries/GetRecognizedTransaction.service';
import { RevertRecognizedTransactionsService } from './commands/RevertRecognizedTransactions.service';
import { GetAutofillCategorizeTransactionService } from './queries/GetAutofillCategorizeTransaction.service';
import { IGetRecognizedTransactionsQuery } from '../BankingTransactions/types/BankingTransactions.types';
import { RevertRecognizedTransactionsCriteria } from './_types';

@Injectable()
export class RecognizedTransactionsApplication {
  constructor(
    private readonly getRecognizedTransactionsService: GetRecognizedTransactionsService,
    private readonly getRecognizedTransactionService: GetRecognizedTransactionService,
    private readonly revertRecognizedTransactionsService: RevertRecognizedTransactionsService,
    private readonly getAutofillCategorizeTransactionService: GetAutofillCategorizeTransactionService,
  ) {}

  /**
   * Retrieves the recognized transactions based on the provided filter.
   * @param {IGetRecognizedTransactionsQuery} filter - Filter criteria.
   * @returns {Promise<{ data: any[], pagination: any }>}
   */
  public getRecognizedTransactions(filter: IGetRecognizedTransactionsQuery) {
    return this.getRecognizedTransactionsService.getRecognizedTranactions(
      filter,
    );
  }

  /**
   * Retrieves a specific recognized transaction by ID.
   * @param {number} recognizedTransactionId - The ID of the recognized transaction.
   * @returns {Promise<any>}
   */
  public getRecognizedTransaction(recognizedTransactionId: number) {
    return this.getRecognizedTransactionService.getRecognizedTransaction(
      recognizedTransactionId,
    );
  }

  /**
   * Reverts a recognized transaction.
   * @param {number} ruleId - The ID of the recognized transaction to revert.
   * @param {RevertRecognizedTransactionsCriteria} transactionsCriteria - The criteria for the recognized transaction to revert.
   * @param {Knex.Transaction} trx - The transaction to use for the revert operation.
   * @returns {Promise<any>}
   */
  public revertRecognizedTransactions(
    ruleId?: number | Array<number>,
    transactionsCriteria?: RevertRecognizedTransactionsCriteria,
    trx?: Knex.Transaction,
  ) {
    return this.revertRecognizedTransactionsService.revertRecognizedTransactions(
      ruleId,
      transactionsCriteria,
      trx,
    );
  }

  /**
   * Gets autofill categorize suggestions for a transaction.
   * @param {number} uncategorizedTransactionId - The ID of the uncategorized transaction.
   * @returns {Promise<any>}
   */
  public getAutofillCategorizeTransaction(uncategorizedTransactionId: number) {
    return this.getAutofillCategorizeTransactionService.getAutofillCategorizeTransaction(
      uncategorizedTransactionId,
    );
  }
}
