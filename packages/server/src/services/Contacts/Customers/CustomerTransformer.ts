import ContactTransformer from '../ContactTransformer';

export default class CustomerTransformer extends ContactTransformer {
  /**
   * Include these attributes to expense object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedBalance',
      'formattedOpeningBalance',
      'formattedOpeningBalanceAt',
      'customerType',
      'formattedCustomerType',
    ];
  };

  /**
   * Retrieve customer type.
   * @returns {string}
   */
  protected customerType = (customer): string => {
    return customer.contactType;
  };

  /**
   * Retrieve the formatted customer type.
   * @param customer
   * @returns {string}
   */
  protected formattedCustomerType = (customer): string => {
    const keywords = {
      individual: 'customer.type.individual',
      business: 'customer.type.business',
    };
    return this.context.i18n.__(keywords[customer.contactType] || '');
  };
}
