import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { PromisePool } from '@supercharge/promise-pool';
import { GetMatchedTransactionsFilter } from './types';
import { GetMatchedTransactionsByExpenses } from './GetMatchedTransactionsByExpenses';
import { GetMatchedTransactionsByBills } from './GetMatchedTransactionsByBills';
import { GetMatchedTransactionsByManualJournals } from './GetMatchedTransactionsByManualJournals';

@Service()
export class GetMatchedTransactions {
  @Inject()
  private getMatchedInvoicesService: GetMatchedTransactionsByExpenses;

  @Inject()
  private getMatchedBillsService: GetMatchedTransactionsByBills;

  @Inject()
  private getMatchedManualJournalService: GetMatchedTransactionsByManualJournals;

  @Inject()
  private getMatchedExpensesService: GetMatchedTransactionsByExpenses;

  get registered() {
    return [
      { type: 'SaleInvoice', service: this.getMatchedInvoicesService },
      { type: 'Bill', service: this.getMatchedBillsService },
      { type: 'Expense', service: this.getMatchedExpensesService },
      { type: 'ManualJournal', service: this.getMatchedManualJournalService },
    ];
  }

  /**
   * Retrieves the matched transactions.
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   */
  public async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const filtered = filter.transactionType
      ? this.registered.filter((item) => item.type === filter.transactionType)
      : this.registered;

    const matchedTransactions = await PromisePool.withConcurrency(2)
      .for(filtered)
      .process(async ({ type, service }) => {
        return service.getMatchedTransactions(tenantId, filter);
      });
    return R.compose(R.flatten)(matchedTransactions?.results);
  }
}

interface MatchedTransaction {
  amount: number;
  amountFormatted: string;
  date: string;
  dateFormatted: string;
  referenceNo: string;
  transactionNo: string;
  transactionId: number;
}
