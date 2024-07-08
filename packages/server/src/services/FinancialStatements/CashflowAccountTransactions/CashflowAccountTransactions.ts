import R from 'ramda';
import moment from 'moment';
import { first, isEmpty } from 'lodash';
import {
  ICashflowAccountTransaction,
  ICashflowAccountTransactionsQuery,
} from '@/interfaces';
import FinancialSheet from '../FinancialSheet';
import { runningAmount } from 'utils';
import { CashflowAccountTransactionsRepo } from './CashflowAccountTransactionsRepo';
import { BankTransactionStatus } from './constants';
import { formatBankTransactionsStatus } from './utils';

export class CashflowAccountTransactionReport extends FinancialSheet {
  private runningBalance: any;
  private query: ICashflowAccountTransactionsQuery;
  private repo: CashflowAccountTransactionsRepo;

  /**
   * Constructor method.
   * @param {IAccountTransaction[]} transactions -
   * @param {number} openingBalance -
   * @param {ICashflowAccountTransactionsQuery} query -
   */
  constructor(
    repo: CashflowAccountTransactionsRepo,
    query: ICashflowAccountTransactionsQuery
  ) {
    super();

    this.repo = repo;
    this.query = query;
    this.runningBalance = runningAmount(this.repo.openingBalance);
  }

  /**
   * Retrieves the transaction status.
   * @param {} transaction
   * @returns {BankTransactionStatus}
   */
  private getTransactionStatus(transaction: any): BankTransactionStatus {
    const categorizedTrans = this.repo.uncategorizedTransactionsMapByRef.get(
      `${transaction.referenceType}-${transaction.referenceId}`
    );
    const matchedTrans = this.repo.matchedBankTransactionsMapByRef.get(
      `${transaction.referenceType}-${transaction.referenceId}`
    );
    if (!isEmpty(categorizedTrans)) {
      return BankTransactionStatus.Categorized;
    } else if (!isEmpty(matchedTrans)) {
      return BankTransactionStatus.Matched;
    } else {
      return BankTransactionStatus.Manual;
    }
  }

  /**
   * Retrieves the uncategoized transaction id from the given transaction.
   * @param transaction
   * @returns {number|null}
   */
  private getUncategorizedTransId(transaction: any): number {
    // The given transaction would be categorized, matched or not, so we'd take a look at
    // the categorized transaction first to get the id if not exist, then should look at the matched
    // transaction if not exist too, so the given transaction has no uncategorized transaction id.
    const categorizedTrans = this.repo.uncategorizedTransactionsMapByRef.get(
      `${transaction.referenceType}-${transaction.referenceId}`
    );
    const matchedTrans = this.repo.matchedBankTransactionsMapByRef.get(
      `${transaction.referenceType}-${transaction.referenceId}`
    );
    // Relation between the transaction and matching always been one-to-one.
    const firstCategorizedTrans = first(categorizedTrans);
    const firstMatchedTrans = first(matchedTrans);

    return (
      firstCategorizedTrans?.id ||
      firstMatchedTrans?.uncategorizedTransactionId ||
      null
    );
  }

  /**
   *Transformes the account transaction to to cashflow transaction node.
   * @param {IAccountTransaction} transaction
   * @returns {ICashflowAccountTransaction}
   */
  private transactionNode = (transaction: any): ICashflowAccountTransaction => {
    const status = this.getTransactionStatus(transaction);
    const uncategorizedTransactionId =
      this.getUncategorizedTransId(transaction);

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
      status,
      formattedStatus: formatBankTransactionsStatus(status),
      uncategorizedTransactionId,
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
   * Transformes the given account transaction to cashflow report transaction.
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
   * Retrieve the reprot data node.
   * @returns {ICashflowAccountTransaction[]}
   */
  public reportData(): ICashflowAccountTransaction[] {
    return this.transactionsNode(this.repo.transactions);
  }
}
