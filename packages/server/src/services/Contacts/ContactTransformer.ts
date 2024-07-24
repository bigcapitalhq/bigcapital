import { isNull } from 'lodash';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';
import { IContact } from '@/interfaces';

export default class ContactTransfromer extends Transformer {
  /**
   * Retrieve formatted expense amount.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedBalance = (contact: IContact): string => {
    return formatNumber(contact.balance, {
      currencyCode: contact.currencyCode,
    });
  };

  /**
   * Retrieve formatted expense landed cost amount.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedOpeningBalance = (contact: IContact): string => {
    return !isNull(contact.openingBalance)
      ? formatNumber(contact.openingBalance, {
          currencyCode: contact.currencyCode,
        })
      : '';
  };

  /**
   * Retriecve fromatted date.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedOpeningBalanceAt = (contact: IContact): string => {
    return !isNull(contact.openingBalanceAt)
      ? this.formatDate(contact.openingBalanceAt)
      : '';
  };

  /**
   * Retrieves the unused credit balance.
   * @param {IContact} contact
   * @returns {number}
   */
  protected unusedCredit = (contact: IContact): number => {
    return contact.balance > 0 ? 0 : Math.abs(contact.balance);
  };

  /**
   * Retrieves the formatted unused credit balance.
   * @param {IContact} contact
   * @returns {string}
   */
  protected formattedUnusedCredit = (contact: IContact): string => {
    const unusedCredit = this.unusedCredit(contact);

    return formatNumber(unusedCredit, { currencyCode: contact.currencyCode });
  };
}
