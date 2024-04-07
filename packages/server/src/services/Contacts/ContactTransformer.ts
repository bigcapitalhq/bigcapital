import { IContact } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { isNull } from 'lodash';
import { formatNumber } from '../../utils';

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
    return !isNull(contact.openingBalanceAt) ? this.formatDate(contact.openingBalanceAt) : '';
  };
}
