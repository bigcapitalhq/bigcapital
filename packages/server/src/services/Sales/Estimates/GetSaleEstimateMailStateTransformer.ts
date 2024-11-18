import { ItemEntryTransformer } from '../Invoices/ItemEntryTransformer';
import { SaleEstimateTransfromer } from './SaleEstimateTransformer';

export class GetSaleEstimateMailStateTransformer extends SaleEstimateTransfromer {
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  public includeAttributes = (): string[] => {
    return [
      'estimateDate',
      'formattedEstimateDate',

      'total',
      'totalFormatted',

      'subtotal',
      'subtotalFormatted',

      'estimateNo',

      'entries',

      'companyName',
      'companyLogoUri',

      'primaryColor',
      'customerName',
    ];
  };

  /**
   * Retrieves the customer name of the invoice.
   * @returns {string}
   */
  protected customerName = (invoice) => {
    return invoice.customer.displayName;
  };

  /**
   * Retrieves the company name.
   * @returns {string}
   */
  protected companyName = () => {
    return this.context.organization.name;
  };

  /**
   * Retrieves the company logo uri.
   * @returns {string | null}
   */
  protected companyLogoUri = (invoice) => {
    return invoice.pdfTemplate?.companyLogoUri;
  };

  /**
   * Retrieves the primary color.
   * @returns {string}
   */
  protected primaryColor = (invoice) => {
    return invoice.pdfTemplate?.attributes?.primaryColor;
  };

  /**
   *
   * @param invoice
   * @returns
   */
  protected entries = (invoice) => {
    return this.item(
      invoice.entries,
      new GetSaleEstimateMailStateEntryTransformer(),
      {
        currencyCode: invoice.currencyCode,
      }
    );
  };

  /**
   * Merges the mail options with the invoice object.
   */
  public transform = (object: any) => {
    return {
      ...this.options.mailOptions,
      ...object,
    };
  };
}

class GetSaleEstimateMailStateEntryTransformer extends ItemEntryTransformer {
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  public includeAttributes = (): string[] => {
    return [
      'description',
      'quantity',
      'unitPrice',
      'unitPriceFormatted',
      'total',
      'totalFormatted',
    ];
  };
}
