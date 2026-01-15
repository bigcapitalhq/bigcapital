import {
  ITransactionsByReferenceQuery,
  ITransactionsByReferenceTransaction,
} from './TransactionsByReference.types';
import { FinancialSheet } from '../../common/FinancialSheet';
import { ModelObject } from 'objection';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { INumberFormatQuery } from '../../types/Report.types';

export class TransactionsByReference extends FinancialSheet {
  readonly transactions: ModelObject<AccountTransaction>[];
  readonly query: ITransactionsByReferenceQuery;
  readonly baseCurrency: string;
  readonly numberFormat: INumberFormatQuery;

  /**
   * Constructor method.
   * @param {ModelObject<AccountTransaction>[]} transactions
   * @param {ITransactionsByReferenceQuery} query
   * @param {string} baseCurrency
   */
  constructor(
    transactions: ModelObject<AccountTransaction>[],
    query: ITransactionsByReferenceQuery,
    baseCurrency: string
  ) {
    super();

    this.transactions = transactions;
    this.query = query;
    this.baseCurrency = baseCurrency;
    // this.numberFormat = this.query.numberFormat;
  }

  /**
   * Mappes the given account transaction to report transaction.
   * @param {IAccountTransaction} transaction
   * @returns {ITransactionsByReferenceTransaction}
   */
  private transactionMapper = (
    transaction: ModelObject<AccountTransaction>
  ): ITransactionsByReferenceTransaction => {
    return {
      date: this.getDateMeta(transaction.date),

      credit: this.getAmountMeta(transaction.credit, { money: false }),
      debit: this.getAmountMeta(transaction.debit, { money: false }),

      // @ts-ignore
      // formattedReferenceType: transaction.referenceTypeFormatted,
      formattedReferenceType: '',

      referenceType: transaction.referenceType,
      referenceId: transaction.referenceId,

      contactId: transaction.contactId,
      contactType: transaction.contactType,
      formattedContactType: transaction.contactType || '',

      accountName: transaction.account?.name || '',
      accountCode: transaction.account?.code || '',
      accountId: transaction.accountId,
    };
  };

  /**
   * Mappes the given accounts transactions to report transactions.
   * @param {IAccountTransaction} transaction
   * @returns {ITransactionsByReferenceTransaction}
   */
  private transactionsMapper = (
    transactions: ModelObject<AccountTransaction>[]
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
