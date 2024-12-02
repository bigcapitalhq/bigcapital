import { SaleInvoiceTransformer } from './SaleInvoiceTransformer';
import { ItemEntryTransformer } from './ItemEntryTransformer';

export class GetSaleInvoiceMailStateTransformer extends SaleInvoiceTransformer {
  /**
   * Exclude these attributes from user object.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Included attributes.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'invoiceDate',
      'invoiceDateFormatted',

      'dueDate',
      'dueDateFormatted',

      'dueAmount',
      'dueAmountFormatted',

      'total',
      'totalFormatted',

      'discountAmount',
      'discountAmountFormatted',
      'discountPercentage',
      'discountPercentageFormatted',
      'discountLabel',

      'adjustment',
      'adjustmentFormatted',

      'subtotal',
      'subtotalFormatted',

      'invoiceNo',

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
   * Retrieves the discount label of the estimate.
   * @param estimate
   * @returns {string}
   */
  protected discountLabel(invoice) {
    return invoice.discountType === 'percentage'
      ? `Discount [${invoice.discountPercentageFormatted}]`
      : 'Discount';
  }

  /**
   *
   * @param invoice
   * @returns
   */
  protected entries = (invoice) => {
    return this.item(
      invoice.entries,
      new GetSaleInvoiceMailStateEntryTransformer(),
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

class GetSaleInvoiceMailStateEntryTransformer extends ItemEntryTransformer {
  /**
   * Exclude these attributes from user object.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  public name = (entry) => {
    return entry.item.name;
  };

  public includeAttributes = (): string[] => {
    return [
      'name',
      'quantity',
      'quantityFormatted',
      'rate',
      'rateFormatted',
      'total',
      'totalFormatted',
    ];
  };
}
