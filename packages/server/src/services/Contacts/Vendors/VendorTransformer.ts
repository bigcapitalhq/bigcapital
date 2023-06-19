import { Service } from 'typedi';
import ContactTransformer from '../ContactTransformer';

export default class VendorTransformer extends ContactTransformer {
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
