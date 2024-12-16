import { Transformer } from '../Transformer/Transformer';
import { AccountTransaction } from './models/AccountTransaction.model';

export class AccountTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'date',
      'formattedDate',
      'transactionType',
      'transactionId',
      'transactionTypeFormatted',
      'credit',
      'debit',
      'formattedCredit',
      'formattedDebit',
      'fcCredit',
      'fcDebit',
      'formattedFcCredit',
      'formattedFcDebit',
    ];
  };

  /**
   * Exclude all attributes of the model.
   * @returns {Array<string>}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Retrieves the formatted date.
   * @returns {string}
   */
  public formattedDate(transaction: AccountTransaction) {
    return this.formatDate(transaction.date);
  }

  /**
   * Retrieves the formatted transaction type.
   * @returns {string}
   */
  public transactionTypeFormatted(transaction: AccountTransaction) {
    return this.context.i18n.t(transaction.referenceTypeFormatted);
  }

  /**
   * Retrieves the tranasction type.
   * @returns {string}
   */
  public transactionType(transaction: AccountTransaction) {
    return transaction.referenceType;
  }

  /**
   * Retrieves the transaction id.
   * @returns {number}
   */
  public transactionId(transaction: AccountTransaction) {
    return transaction.referenceId;
  }

  /**
   * Retrieves the credit amount.
   * @returns {string}
   */
  protected formattedCredit(transaction: AccountTransaction) {
    return this.formatMoney(transaction.credit, {
      excerptZero: true,
    });
  }

  /**
   * Retrieves the credit amount.
   * @returns {string}
   */
  protected formattedDebit(transaction: AccountTransaction) {
    return this.formatMoney(transaction.debit, {
      excerptZero: true,
    });
  }

  /**
   * Retrieves the foreign credit amount.
   * @returns {number}
   */
  protected fcCredit(transaction: AccountTransaction) {
    return transaction.credit * transaction.exchangeRate;
  }

  /**
   * Retrieves the foreign debit amount.
   * @returns {number}
   */
  protected fcDebit(transaction: AccountTransaction) {
    return transaction.debit * transaction.exchangeRate;
  }

  /**
   * Retrieves the formatted foreign credit amount.
   * @returns {string}
   */
  protected formattedFcCredit(transaction: AccountTransaction) {
    return this.formatMoney(this.fcCredit(transaction), {
      currencyCode: transaction.currencyCode,
      excerptZero: true,
    });
  }

  /**
   * Retrieves the formatted foreign debit amount.
   * @returns {string}
   */
  protected formattedFcDebit(transaction: AccountTransaction) {
    return this.formatMoney(this.fcDebit(transaction), {
      currencyCode: transaction.currencyCode,
      excerptZero: true,
    });
  }
}
