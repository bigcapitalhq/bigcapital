import {
    IAccount,
  IAccountTransaction,
  INumberFormatQuery,
  ITransactionsByReferenceQuery,
  ITransactionsByReferenceTransaction,
} from '@/interfaces';
import FinancialSheet from '../FinancialSheet';

export default class TransactionsByReference extends FinancialSheet {
  readonly transactions: IAccountTransaction[];
  readonly query: ITransactionsByReferenceQuery;
  readonly baseCurrency: string;
  readonly numberFormat: INumberFormatQuery;

  /**
   * Constructor method.
   * @param {IAccountTransaction[]} transactions
   * @param {ITransactionsByReferenceQuery} query
   * @param {string} baseCurrency
   */
  constructor(
    transactions: (IAccountTransaction & { account: IAccount }) [],
    query: ITransactionsByReferenceQuery,
    baseCurrency: string
  ) {
    super();

    this.transactions = transactions;
    this.query = query;
    this.baseCurrency = baseCurrency;
    this.numberFormat = this.query.numberFormat;
  }

  /**
   * Maps the given account transaction to report transaction.
   * @param {IAccountTransaction} transaction
   * @returns {ITransactionsByReferenceTransaction}
   */
  private transactionMapper = (
    transaction: IAccountTransaction
  ): ITransactionsByReferenceTransaction => {
    return {
      date: this.getDateMeta(transaction.date),

      credit: this.getAmountMeta(transaction.credit, { money: false }),
      debit: this.getAmountMeta(transaction.debit, { money: false }),

      referenceTypeFormatted: transaction.referenceTypeFormatted,
      referenceType: transaction.referenceType,
      referenceId: transaction.referenceId,

      contactId: transaction.contactId,
      contactType: transaction.contactType,
      contactTypeFormatted: transaction.contactType,

      accountName: transaction.account.name,
      accountCode: transaction.account.code,
      accountId: transaction.accountId,
    };
  };

  /**
   * Maps the given accounts transactions to report transactions.
   * @param {IAccountTransaction} transaction
   * @returns {ITransactionsByReferenceTransaction}
   */
  private transactionsMapper = (
    transactions: IAccountTransaction[]
  ): ITransactionsByReferenceTransaction[] => {
    return transactions.map(this.transactionMapper);
  };

  /**
   * Retrieve the report data.
   * @returns {ITransactionsByReferenceTransaction}
   */
  public reportData(): ITransactionsByReferenceTransaction[] {
    return this.transactionsMapper(this.transactions);
  }
}
