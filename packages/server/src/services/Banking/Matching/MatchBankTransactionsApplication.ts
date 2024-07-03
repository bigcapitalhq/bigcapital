import { Inject, Service } from 'typedi';
import { GetMatchedTransactions } from './GetMatchedTransactions';
import { MatchBankTransactions } from './MatchTransactions';
import { UnmatchMatchedBankTransaction } from './UnmatchMatchedTransaction';
import { GetMatchedTransactionsFilter, IMatchTransactionsDTO } from './types';

@Service()
export class MatchBankTransactionsApplication {
  @Inject()
  private getMatchedTransactionsService: GetMatchedTransactions;

  @Inject()
  private matchTransactionService: MatchBankTransactions;

  @Inject()
  private unmatchMatchedTransactionService: UnmatchMatchedBankTransaction;

  /**
   * Retrieves the matched transactions.
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   * @returns
   */
  public getMatchedTransactions(
    tenantId: number,
    uncategorizedTransactionId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    return this.getMatchedTransactionsService.getMatchedTransactions(
      tenantId,
      uncategorizedTransactionId,
      filter
    );
  }

  /**
   * Matches the given uncategorized transaction with the given system transaction.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   * @param {IMatchTransactionDTO} matchTransactionsDTO
   * @returns {Promise<void>}
   */
  public matchTransaction(
    tenantId: number,
    uncategorizedTransactionId: number,
    matchTransactionsDTO: IMatchTransactionsDTO
  ): Promise<void> {
    return this.matchTransactionService.matchTransaction(
      tenantId,
      uncategorizedTransactionId,
      matchTransactionsDTO
    );
  }

  /**
   * Unmatch the given matched transaction.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   * @returns {Promise<void>}
   */
  public unmatchMatchedTransaction(
    tenantId: number,
    uncategorizedTransactionId: number
  ) {
    return this.unmatchMatchedTransactionService.unmatchMatchedTransaction(
      tenantId,
      uncategorizedTransactionId
    );
  }
}
