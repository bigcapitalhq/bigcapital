import { ContactTransfromer } from '../../Contacts/Contact.transformer';

export class VendorTransfromer extends ContactTransfromer {
  /**
   * Include these attributes to expense object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedBalance',
      'formattedOpeningBalance',
      'formattedOpeningBalanceAt',
      'customFields',
    ];
  };

  /**
   * Retrieve the custom fields values.
   */
  public customFields = (): Record<string, unknown> => {
    return this.options?.customFields ?? {};
  };
}
