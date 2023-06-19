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
   * Retriecve formatted date.
   * @param {IExpense} expense
   * @returns {string}
   */
  protected formattedOpeningBalanceAt = (contact: IContact): string => {
    return !isNull(contact.openingBalanceAt)
      ? this.formatDate(contact.openingBalanceAt)
      : '';
  };
}
