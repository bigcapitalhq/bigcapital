import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import moment from 'moment';
import { PromisePool } from '@supercharge/promise-pool';
import { GetMatchedTransactionsFilter, MatchedTransactionsPOJO } from './types';
import { GetMatchedTransactionsByExpenses } from './GetMatchedTransactionsByExpenses';
import { GetMatchedTransactionsByBills } from './GetMatchedTransactionsByBills';
import { GetMatchedTransactionsByManualJournals } from './GetMatchedTransactionsByManualJournals';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { sortClosestMatchTransactions } from './_utils';
import { GetMatchedTransactionsByCashflow } from './GetMatchedTransactionsByCashflow';
import { GetMatchedTransactionsByInvoices } from './GetMatchedTransactionsByInvoices';

@Service()
export class GetMatchedTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getMatchedInvoicesService: GetMatchedTransactionsByInvoices;

  @Inject()
  private getMatchedBillsService: GetMatchedTransactionsByBills;

  @Inject()
  private getMatchedManualJournalService: GetMatchedTransactionsByManualJournals;

  @Inject()
  private getMatchedExpensesService: GetMatchedTransactionsByExpenses;

  @Inject()
  private getMatchedCashflowService: GetMatchedTransactionsByCashflow;

  /**
   * Registered matched transactions types.
   */
  get registered() {
    return [
      { type: 'SaleInvoice', service: this.getMatchedInvoicesService },
      { type: 'Bill', service: this.getMatchedBillsService },
      { type: 'Expense', service: this.getMatchedExpensesService },
      { type: 'ManualJournal', service: this.getMatchedManualJournalService },
      { type: 'Cashflow', service: this.getMatchedCashflowService },
    ];
  }

  /**
   * Retrieves the matched transactions.
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   * @returns {Promise<MatchedTransactionsPOJO>}
   */
  public async getMatchedTransactions(
    tenantId: number,
    uncategorizedTransactionId: number,
    filter: GetMatchedTransactionsFilter
  ): Promise<MatchedTransactionsPOJO> {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    const uncategorizedTransaction =
      await UncategorizedCashflowTransaction.query()
        .findById(uncategorizedTransactionId)
        .throwIfNotFound();

    const filtered = filter.transactionType
      ? this.registered.filter((item) => item.type === filter.transactionType)
      : this.registered;

    const matchedTransactions = await PromisePool.withConcurrency(2)
      .for(filtered)
      .process(async ({ type, service }) => {
        return service.getMatchedTransactions(tenantId, filter);
      });

    const { perfectMatches, possibleMatches } = this.groupMatchedResults(
      uncategorizedTransaction,
      matchedTransactions
    );
    return {
      perfectMatches,
      possibleMatches,
    };
  }

  /**
   * Groups the given results for getting perfect and possible matches
   * based on the given uncategorized transaction.
   * @param uncategorizedTransaction
   * @param matchedTransactions
   * @returns {MatchedTransactionsPOJO}
   */
  private groupMatchedResults(
    uncategorizedTransaction,
    matchedTransactions
  ): MatchedTransactionsPOJO {
    const results = R.compose(R.flatten)(matchedTransactions?.results);

    // Sort the results based on amount, date, and transaction type
    const closestResullts = sortClosestMatchTransactions(
      uncategorizedTransaction,
      results
    );
    const perfectMatches = R.filter(
      (match) =>
        match.amount === uncategorizedTransaction.amount &&
        moment(match.date).isSame(uncategorizedTransaction.date, 'day'),
      closestResullts
    );
    const possibleMatches = R.difference(closestResullts, perfectMatches);

    return { perfectMatches, possibleMatches };
  }
}
