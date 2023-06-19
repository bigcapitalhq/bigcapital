import R from 'ramda';
import moment from 'moment';
import {
  ICashflowAccountTransaction,
  ICashflowAccountTransactionsQuery,
  INumberFormatQuery,
} from '@/interfaces';
import FinancialSheet from '../FinancialSheet';
import { runningAmount } from 'utils';

export default class CashflowAccountTransactionReport extends FinancialSheet {
  private transactions: any;
  private openingBalance: number;
  private runningBalance: any;
  private numberFormat: INumberFormatQuery;
  private baseCurrency: string;
  private query: ICashflowAccountTransactionsQuery;

  /**
   * Constructor method.
   * @param {IAccountTransaction[]} transactions -
   * @param {number} openingBalance -
   * @param {ICashflowAccountTransactionsQuery} query -
   */
  constructor(
    transactions,
    openingBalance: number,
    query: ICashflowAccountTransactionsQuery
  ) {
    super();

    this.transactions = transactions;
    this.openingBalance = openingBalance;

    this.runningBalance = runningAmount(this.openingBalance);
    this.query = query;
    this.numberFormat = query.numberFormat;
    this.baseCurrency = 'USD';
  }

  /**
   *Transforms the account transaction to to cashflow transaction node.
   * @param {IAccountTransaction} transaction
   * @returns {ICashflowAccountTransaction}
   */
  private transactionNode = (transaction: any): ICashflowAccountTransaction => {
    return {
      date: transaction.date,
      formattedDate: moment(transaction.date).format('YYYY-MM-DD'),

      withdrawal: transaction.credit,
      deposit: transaction.debit,

      formattedDeposit: this.formatNumber(transaction.debit),
      formattedWithdrawal: this.formatNumber(transaction.credit),

      referenceId: transaction.referenceId,
      referenceType: transaction.referenceType,

      formattedTransactionType: transaction.referenceTypeFormatted,

      transactionNumber: transaction.transactionNumber,
      referenceNumber: transaction.referenceNumber,

      runningBalance: this.runningBalance.amount(),
      formattedRunningBalance: this.formatNumber(this.runningBalance.amount()),

      balance: 0,
      formattedBalance: '',
    };
  };

  /**
   * Associate cashflow transaction node with running balance attribute.
   * @param {IAccountTransaction} transaction
   * @returns {ICashflowAccountTransaction}
   */
  private transactionRunningBalance = (
    transaction: ICashflowAccountTransaction
  ): ICashflowAccountTransaction => {
    const amount = transaction.deposit - transaction.withdrawal;

    const biggerThanZero = R.lt(0, amount);
    const lowerThanZero = R.gt(0, amount);

    const absAmount = Math.abs(amount);

    R.when(R.always(biggerThanZero), this.runningBalance.decrement)(absAmount);
    R.when(R.always(lowerThanZero), this.runningBalance.increment)(absAmount);

    const runningBalance = this.runningBalance.amount();

    return {
      ...transaction,
      runningBalance,
      formattedRunningBalance: this.formatNumber(runningBalance),
    };
  };

  /**
   * Associate to balance attribute to cashflow transaction node.
   * @param {ICashflowAccountTransaction} transaction
   * @returns {ICashflowAccountTransaction}
   */
  private transactionBalance = (
    transaction: ICashflowAccountTransaction
  ): ICashflowAccountTransaction => {
    const balance =
      transaction.runningBalance +
      transaction.withdrawal * -1 +
      transaction.deposit;

    return {
      ...transaction,
      balance,
      formattedBalance: this.formatNumber(balance),
    };
  };

  /**
   * Transforms the given account transaction to cashflow report transaction.
   * @param {ICashflowAccountTransaction} transaction
   * @returns {ICashflowAccountTransaction}
   */
  private transactionTransformer = (
    transaction
  ): ICashflowAccountTransaction => {
    return R.compose(
      this.transactionBalance,
      this.transactionRunningBalance,
      this.transactionNode
    )(transaction);
  };

  /**
   * Retrieve the report transactions node.
   * @param {} transactions
   * @returns {ICashflowAccountTransaction[]}
   */
  private transactionsNode = (transactions): ICashflowAccountTransaction[] => {
    return R.map(this.transactionTransformer)(transactions);
  };

  /**
   * Retrieve the report data node.
   * @returns {ICashflowAccountTransaction[]}
   */
  public reportData(): ICashflowAccountTransaction[] {
    return this.transactionsNode(this.transactions);
  }
}
