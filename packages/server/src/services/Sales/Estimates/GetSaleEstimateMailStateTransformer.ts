import { ItemEntryTransformer } from '../Invoices/ItemEntryTransformer';
import { SaleEstimateTransfromer } from './SaleEstimateTransformer';

export class GetSaleEstimateMailStateTransformer extends SaleEstimateTransfromer {
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  public includeAttributes = (): string[] => {
    return [
      'estimateDate',
      'estimateDateFormatted',

      'expirationDate',
      'expirationDateFormatted',

      'total',
      'totalFormatted',

      'subtotal',
      'subtotalFormatted',

      'discountAmount',
      'discountAmountFormatted',
      'discountPercentage',
      'discountPercentageFormatted',
      'discountLabel',

      'adjustment',
      'adjustmentFormatted',
      'adjustmentLabel',

      'estimateNumber',
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
    return invoice.pdfTemplate?.companyLogoUri || null;
  };

  /**
   * Retrieves the primary color.
   * @returns {string}
   */
  protected primaryColor = (invoice) => {
    return invoice.pdfTemplate?.attributes?.primaryColor || null;
  };

  /**
   * Retrieves the estimate number.
   */
  protected estimateDateFormatted = (estimate) => {
    return this.formattedEstimateDate(estimate);
  };

  /**
   * Retrieves the expiration date of the estimate.
   * @param estimate
   * @returns {string}
   */
  protected expirationDateFormatted = (estimate) => {
    return this.formattedExpirationDate(estimate);
  };

  /**
   * Retrieves the total amount of the estimate.
   * @param estimate
   * @returns
   */
  protected total(estimate) {
    return estimate.amount;
  }

  /**
   * Retrieves the subtotal amount of the estimate.
   * @param estimate
   * @returns {number}
   */
  protected subtotal(estimate) {
    return estimate.amount;
  }

  /**
   * Retrieves the discount label of the estimate.
   * @param estimate
   * @returns {string}
   */
  protected discountLabel(estimate) {
    return estimate.discountType === 'percentage'
      ? `Discount [${estimate.discountPercentageFormatted}]`
      : 'Discount';
  }

  /**
   * Retrieves the formatted subtotal of the estimate.
   * @param estimate
   * @returns {string}
   */
  protected subtotalFormatted = (estimate) => {
    return this.formattedSubtotal(estimate);
  };

  /**
   * Retrieves the estimate entries.
   * @param invoice
   * @returns {Array}
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

  /**
   * Item name.
   * @param entry
   * @returns
   */
  public name = (entry) => {
    return entry.item.name;
  };

  public includeAttributes = (): string[] => {
    return [
      'name',
      'quantity',
      'unitPrice',
      'unitPriceFormatted',
      'total',
      'totalFormatted',
    ];
  };
}
