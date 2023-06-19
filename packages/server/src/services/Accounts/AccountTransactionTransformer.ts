import { IAccountTransaction } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { transaction } from 'objection';

export default class AccountTransactionTransformer extends Transformer {
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
  public formattedDate(transaction: IAccountTransaction) {
    return this.formatDate(transaction.date);
  }

  /**
   * Retrieves the formatted transaction type.
   * @returns {string}
   */
  public transactionTypeFormatted(transaction: IAccountTransaction) {
    return transaction.referenceTypeFormatted;
  }

  /**
   * Retrieves the transaction type.
   * @returns {string}
   */
  public transactionType(transaction: IAccountTransaction) {
    return transaction.referenceType;
  }

  /**
   * Retrieves the transaction id.
   * @returns {number}
   */
  public transactionId(transaction: IAccountTransaction) {
    return transaction.referenceId;
  }

  /**
   * Retrieves the credit amount.
   * @returns {string}
   */
  protected formattedCredit(transaction: IAccountTransaction) {
    return this.formatMoney(transaction.credit, {
      excerptZero: true,
    });
  }

  /**
   * Retrieves the credit amount.
   * @returns {string}
   */
  protected formattedDebit(transaction: IAccountTransaction) {
    return this.formatMoney(transaction.debit, {
      excerptZero: true,
    });
  }

  /**
   * Retrieves the foreign credit amount.
   * @returns {number}
   */
  protected fcCredit(transaction: IAccountTransaction) {
    return transaction.credit * transaction.exchangeRate;
  }

  /**
   * Retrieves the foreign debit amount.
   * @returns {number}
   */
  protected fcDebit(transaction: IAccountTransaction) {
    return transaction.debit * transaction.exchangeRate;
  }

  /**
   * Retrieves the formatted foreign credit amount.
   * @returns {string}
   */
  protected formattedFcCredit(transaction: IAccountTransaction) {
    return this.formatMoney(this.fcCredit(transaction), {
      currencyCode: transaction.currencyCode,
      excerptZero: true,
    });
  }

  /**
   * Retrieves the formatted foreign debit amount.
   * @returns {string}
   */
  protected formattedFcDebit(transaction: IAccountTransaction) {
    return this.formatMoney(this.fcDebit(transaction), {
      currencyCode: transaction.currencyCode,
      excerptZero: true,
    });
  }
}
