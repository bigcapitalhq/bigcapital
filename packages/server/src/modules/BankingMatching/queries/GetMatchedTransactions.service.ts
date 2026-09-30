import * as R from 'ramda';
import * as moment from 'moment';
import { first, isNil, sumBy } from 'lodash';
import { PromisePool } from '@supercharge/promise-pool';
import { Inject, Injectable } from '@nestjs/common';
import {
  GetMatchedTransactionsFilter,
  MatchedTransactionsPOJO,
} from '../types';
import { GetMatchedTransactionsByExpenses } from './GetMatchedTransactionsByExpenses';
import { GetMatchedTransactionsByBills } from './GetMatchedTransactionsByBills.service';
import { GetMatchedTransactionsByManualJournals } from './GetMatchedTransactionsByManualJournals.service';
import { GetMatchedTransactionsByCashflow } from './GetMatchedTransactionsByCashflow';
import { GetMatchedTransactionsByInvoices } from './GetMatchedTransactionsByInvoices.service';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { sortClosestMatchTransactions } from '../_utils';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

/**
 * Days either side of the uncategorized transaction date that candidate
 * transactions are searched in, when the request doesn't say otherwise.
 * Without a window every unmatched invoice, bill, expense, journal and cash
 * flow transaction in the ledger is loaded, sorted and serialized per request.
 */
const DEFAULT_MATCH_DATE_WINDOW_DAYS = 90;

@Injectable()
export class GetMatchedTransactions {
  constructor(
    private readonly getMatchedInvoicesService: GetMatchedTransactionsByInvoices,
    private readonly getMatchedBillsService: GetMatchedTransactionsByBills,
    private readonly getMatchedManualJournalService: GetMatchedTransactionsByManualJournals,
    private readonly getMatchedExpensesService: GetMatchedTransactionsByExpenses,
    private readonly getMatchedCashflowService: GetMatchedTransactionsByCashflow,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
  ) {}

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
   * @param {Array<number>} uncategorizedTransactionIds - Uncategorized transactions ids.
   * @param {GetMatchedTransactionsFilter} filter -
   * @returns {Promise<MatchedTransactionsPOJO>}
   */
  public async getMatchedTransactions(
    uncategorizedTransactionIds: Array<number>,
    filter: GetMatchedTransactionsFilter,
  ): Promise<MatchedTransactionsPOJO> {
    const uncategorizedTransactions =
      await this.uncategorizedBankTransactionModel()
        .query()
        .whereIn('id', uncategorizedTransactionIds)
        .throwIfNotFound();

    const totalPending = sumBy(uncategorizedTransactions, 'amount');

    const boundedFilter = this.withDefaultDateWindow(
      filter,
      uncategorizedTransactions,
    );
    const filtered = filter.transactionType
      ? this.registered.filter((item) => item.type === filter.transactionType)
      : this.registered;

    const matchedTransactions = await PromisePool.withConcurrency(2)
      .for(filtered)
      .process(async ({ type: _type, service }) => {
        return service.getMatchedTransactions(boundedFilter);
      });
    const { perfectMatches, possibleMatches } = this.groupMatchedResults(
      uncategorizedTransactions,
      matchedTransactions,
    );
    return {
      perfectMatches,
      possibleMatches,
      totalPending,
    };
  }

  /**
   * Bounds the candidate search to a date window around the given uncategorized
   * transactions. An explicit `fromDate` or `toDate` always wins, and a
   * `dateWindowDays` of zero searches the whole ledger.
   *
   * A perfect match requires the same amount on the same day, so narrowing the
   * window can only ever drop possible matches, never perfect ones.
   * @param {GetMatchedTransactionsFilter} filter
   * @param {Array<any>} uncategorizedTransactions
   * @returns {GetMatchedTransactionsFilter}
   */
  private withDefaultDateWindow(
    filter: GetMatchedTransactionsFilter,
    uncategorizedTransactions: Array<any>,
  ): GetMatchedTransactionsFilter {
    if (filter.fromDate || filter.toDate) {
      return filter;
    }
    const windowDays = isNil(filter.dateWindowDays)
      ? DEFAULT_MATCH_DATE_WINDOW_DAYS
      : Number(filter.dateWindowDays);

    if (!windowDays || windowDays <= 0) {
      return filter;
    }
    const dates = uncategorizedTransactions
      .map((transaction) => moment(transaction.date))
      .filter((date) => date.isValid());

    if (dates.length === 0) {
      return filter;
    }
    return {
      ...filter,
      fromDate: moment
        .min(dates)
        .clone()
        .subtract(windowDays, 'days')
        .format('YYYY-MM-DD'),
      toDate: moment
        .max(dates)
        .clone()
        .add(windowDays, 'days')
        .format('YYYY-MM-DD'),
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
    uncategorizedTransactions: Array<any>,
    matchedTransactions,
  ): MatchedTransactionsPOJO {
    const results = R.compose(R.flatten)(matchedTransactions?.results);

    const firstUncategorized = first(uncategorizedTransactions);
    const amount = sumBy(uncategorizedTransactions, 'amount');
    const date = firstUncategorized.date;

    // Sort the results based on amount, date, and transaction type
    const closestResullts = sortClosestMatchTransactions(amount, date, results);
    const perfectMatches = R.filter(
      (match) =>
        match.amount === amount && moment(match.date).isSame(date, 'day'),
      closestResullts,
    );
    const possibleMatches = R.difference(closestResullts, perfectMatches);
    const totalPending = sumBy(uncategorizedTransactions, 'amount');

    return { perfectMatches, possibleMatches, totalPending };
  }
}
