import { Service } from 'typedi';
import ContactTransfromer from '../ContactTransformer';

export default class VendorTransfromer extends ContactTransfromer {
  /**
   * Include these attributes to expense object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedBalance',
      'formattedOpeningBalance',
      'formattedOpeningBalanceAt'
    ];
  };
}
