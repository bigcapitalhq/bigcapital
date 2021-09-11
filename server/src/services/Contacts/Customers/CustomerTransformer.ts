import { Service } from 'typedi';
import ContactTransfromer from '../ContactTransformer';

export default class CustomerTransfromer extends ContactTransfromer {
  /**
   * Include these attributes to expense object.
   * @returns {Array}
   */
  protected includeAttributes = (): string[] => {
    return [
      'formattedBalance',
      'formattedOpeningBalance',
      'formattedOpeningBalanceAt',
      'customerType'
    ];
  };

  /**
   * Retrieve customer type.
   * @returns {string}
   */
  protected customerType = (customer): string => {
    return customer.contactType;
  };
}
