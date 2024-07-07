import * as R from 'ramda';
import { ICashflowAccountTransactionsQuery } from '@/interfaces';
import {
  groupMatchedBankTransactions,
  groupUncategorizedTransactions,
} from './utils';

export class CashflowAccountTransactionsRepo {
  private models: any;
  public query: ICashflowAccountTransactionsQuery;
  public transactions: any;
  public uncategorizedTransactions: any;
  public uncategorizedTransactionsMapByRef: Map<string, any>;
  public matchedBankTransactions: any;
  public matchedBankTransactionsMapByRef: Map<string, any>;
  public pagination: any;
  public openingBalance: any;

  /**
   * Constructor method.
   * @param {any} models
   * @param {ICashflowAccountTransactionsQuery} query
   */
  constructor(models: any, query: ICashflowAccountTransactionsQuery) {
    this.models = models;
    this.query = query;
  }

  /**
   * Async initalize the resources.
   */
  async asyncInit() {
    await this.initCashflowAccountTransactions();
    await this.initCashflowAccountOpeningBalance();
    await this.initCategorizedTransactions();
    await this.initMatchedTransactions();
  }

  /**
   * Retrieve the cashflow account transactions.
   * @param {number} tenantId -
   * @param {ICashflowAccountTransactionsQuery} query -
   */
  async initCashflowAccountTransactions() {
    const { AccountTransaction } = this.models;

    const { results, pagination } = await AccountTransaction.query()
      .where('account_id', this.query.accountId)
      .orderBy([
        { column: 'date', order: 'desc' },
        { column: 'created_at', order: 'desc' },
      ])
      .pagination(this.query.page - 1, this.query.pageSize);

    this.transactions = results;
    this.pagination = pagination;
  }

  /**
   * Retrieve the cashflow account opening balance.
   * @param {number} tenantId
   * @param {number} accountId
   * @param {IPaginationMeta} pagination
   * @return {Promise<number>}
   */
  async initCashflowAccountOpeningBalance(): Promise<void> {
    const { AccountTransaction } = this.models;

    // Retrieve the opening balance of credit and debit balances.
    const openingBalancesSubquery = AccountTransaction.query()
      .where('account_id', this.query.accountId)
      .orderBy([
        { column: 'date', order: 'desc' },
        { column: 'created_at', order: 'desc' },
      ])
      .limit(this.pagination.total)
      .offset(this.pagination.pageSize * (this.pagination.page - 1));

    // Sumation of credit and debit balance.
    const openingBalances = await AccountTransaction.query()
      .sum('credit as credit')
      .sum('debit as debit')
      .from(openingBalancesSubquery.as('T'))
      .first();

    const openingBalance = openingBalances.debit - openingBalances.credit;

    this.openingBalance = openingBalance;
  }

  /**
   * Initialize the uncategorized transactions of the bank account.
   */
  async initCategorizedTransactions() {
    const { UncategorizedCashflowTransaction } = this.models;
    const refs = this.transactions.map((t) => [t.referenceType, t.referenceId]);

    const uncategorizedTransactions =
      await UncategorizedCashflowTransaction.query().whereIn(
        ['categorizeRefType', 'categorizeRefId'],
        refs
      );

    this.uncategorizedTransactions = uncategorizedTransactions;
    this.uncategorizedTransactionsMapByRef = groupUncategorizedTransactions(
      uncategorizedTransactions
    );
  }

  /**
   * Initialize the matched bank transactions of the bank account.
   */
  async initMatchedTransactions(): Promise<void> {
    const { MatchedBankTransaction } = this.models;
    const refs = this.transactions.map((t) => [t.referenceType, t.referenceId]);

    const matchedBankTransactions =
      await MatchedBankTransaction.query().whereIn(
        ['referenceType', 'referenceId'],
        refs
      );
    this.matchedBankTransactions = matchedBankTransactions;
    this.matchedBankTransactionsMapByRef = groupMatchedBankTransactions(
      matchedBankTransactions
    );
  }
}
