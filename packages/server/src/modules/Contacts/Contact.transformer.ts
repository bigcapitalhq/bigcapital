import { isNull } from 'lodash';
import { Transformer } from '../Transformer/Transformer';
import { Contact } from './models/Contact';

export class ContactTransfromer extends Transformer {
  /**
   * Retrieve formatted expense amount.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedBalance = (contact: Contact): string => {
    return this.formatNumber(contact.balance, {
      currencyCode: contact.currencyCode,
    });
  };

  /**
   * Retrieve formatted expense landed cost amount.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedOpeningBalance = (contact: Contact): string => {
    return !isNull(contact.openingBalance)
      ? this.formatNumber(contact.openingBalance, {
          currencyCode: contact.currencyCode,
        })
      : '';
  };

  /**
   * Retriecve fromatted date.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedOpeningBalanceAt = (contact: Contact): string => {
    return !isNull(contact.openingBalanceAt)
      ? this.formatDate(contact.openingBalanceAt)
      : '';
  };
}
