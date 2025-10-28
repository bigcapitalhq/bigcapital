import { Injectable } from '@nestjs/common';
import { GetMatchedTransactions } from './queries/GetMatchedTransactions.service';
import { MatchBankTransactions } from './commands/MatchTransactions';
import { UnmatchMatchedBankTransaction } from './commands/UnmatchMatchedTransaction.service';
import { GetMatchedTransactionsFilter } from './types';
import { MatchTransactionEntryDto } from './dtos/MatchBankTransaction.dto';

@Injectable()
export class BankingMatchingApplication {
  constructor(
    private readonly getMatchedTransactionsService: GetMatchedTransactions,
    private readonly matchTransactionService: MatchBankTransactions,
    private readonly unmatchMatchedTransactionService: UnmatchMatchedBankTransaction,
  ) {}

  /**
   * Retrieves the matched transactions.
   * @param {Array<number>} uncategorizedTransactionsIds - Uncategorized transactions ids.
   * @param {GetMatchedTransactionsFilter} filter -
   * @returns {Promise<MatchedTransactionsPOJO>}
   */
  public getMatchedTransactions(
    uncategorizedTransactionsIds: Array<number>,
    filter: GetMatchedTransactionsFilter,
  ) {
    return this.getMatchedTransactionsService.getMatchedTransactions(
      uncategorizedTransactionsIds,
      filter,
    );
  }

  /**
   * Matches the given uncategorized transaction with the given system transaction.
   * @param {IMatchBankTransactionDto} matchedTransactionsDTO
   * @returns {Promise<void>}
   */
  public matchTransaction(
    uncategorizedTransactionId: number | Array<number>,
    matchedTransactionsDto:
      | MatchTransactionEntryDto
      | Array<MatchTransactionEntryDto>,
  ): Promise<void> {
    return this.matchTransactionService.matchTransaction(
      uncategorizedTransactionId,
      matchedTransactionsDto,
    );
  }

  /**
   * Unmatch the given matched transaction.
   * @param {number} uncategorizedTransactionId - Uncategorized transaction id.
   * @returns {Promise<void>}
   */
  public unmatchMatchedTransaction(uncategorizedTransactionId: number) {
    return this.unmatchMatchedTransactionService.unmatchMatchedTransaction(
      uncategorizedTransactionId,
    );
  }
}
