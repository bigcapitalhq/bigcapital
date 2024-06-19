import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { PromisePool } from '@supercharge/promise-pool';
import { GetMatchedTransactionsFilter } from './types';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetMatchedTransactionInvoicesTransformer } from './GetMatchedTransactionInvoicesTransformer';
import { GetMatchedTransactionBillsTransformer } from './GetMatchedTransactionBillsTransformer';
import { GetMatchedTransactionExpensesTransformer } from './GetMatchedTransactionExpensesTransformer';
import { GetMatchedTransactionManualJournalsTransformer } from './GetMatchedTransactionManualJournalsTransformer';

@Service()
export class GetMatchedTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the matched transactions.
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   */
  public async getMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const registered = [
      {
        type: 'SaleInvoice',
        callback: this.getSaleInvoicesMatchedTransactions.bind(this),
      },
      {
        type: 'Bill',
        callback: this.getBillsMatchedTransactions.bind(this),
      },
      {
        type: 'Expense',
        callback: this.getExpensesMatchedTransactions.bind(this),
      },
      {
        type: 'ManualJournal',
        callback: this.getManualJournalsMatchedTransactions.bind(this),
      },
    ];
    const filtered = filter.transactionType
      ? registered.filter((item) => item.type === filter.transactionType)
      : registered;

    const matchedTransactions = await PromisePool.withConcurrency(2)
      .for(filtered)
      .process(async ({ type, callback }) => {
        return callback(tenantId, filter);
      });
    return R.compose(R.flatten)(matchedTransactions?.results);
  }

  /**
   *
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   */
  async getSaleInvoicesMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const invoices = await SaleInvoice.query();

    return this.transformer.transform(
      tenantId,
      invoices,
      new GetMatchedTransactionInvoicesTransformer()
    );
  }

  /**
   *
   * @param {number} tenantId -
   * @param {GetMatchedTransactionsFilter} filter -
   */
  async getBillsMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const { Bill } = this.tenancy.models(tenantId);

    const bills = await Bill.query();

    return this.transformer.transform(
      tenantId,
      bills,
      new GetMatchedTransactionBillsTransformer()
    );
  }

  /**
   *
   * @param {number} tenantId
   * @param {GetMatchedTransactionsFilter} filter
   * @returns
   */
  async getExpensesMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const { Expense } = this.tenancy.models(tenantId);

    const expenses = await Expense.query();

    return this.transformer.transform(
      tenantId,
      expenses,
      new GetMatchedTransactionManualJournalsTransformer()
    );
  }

  async getManualJournalsMatchedTransactions(
    tenantId: number,
    filter: GetMatchedTransactionsFilter
  ) {
    const { ManualJournal } = this.tenancy.models(tenantId);

    const manualJournals = await ManualJournal.query();

    return this.transformer.transform(
      tenantId,
      manualJournals,
      new GetMatchedTransactionManualJournalsTransformer()
    );
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
