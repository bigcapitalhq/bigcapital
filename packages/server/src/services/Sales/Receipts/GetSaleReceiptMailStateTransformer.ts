import { Transformer } from '@/lib/Transformer/Transformer';
import { ItemEntryTransformer } from '../Invoices/ItemEntryTransformer';
import { DiscountType } from '@/interfaces';
import { SaleReceiptTransformer } from './SaleReceiptTransformer';

export class GetSaleReceiptMailStateTransformer extends SaleReceiptTransformer {
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
      'companyName',
      'companyLogoUri',
      'primaryColor',
      'customerName',

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

      'receiptDate',
      'receiptDateFormatted',

      'closedAtDate',
      'closedAtDateFormatted',

      'receiptNumber',
      'entries',
    ];
  };

  /**
   * Retrieves the customer name of the invoice.
   * @returns {string}
   */
  protected customerName = (receipt) => {
    return receipt.customer.displayName;
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
  protected companyLogoUri = (receipt) => {
    return receipt.pdfTemplate?.companyLogoUri;
  };

  /**
   * Retrieves the primary color.
   * @returns {string}
   */
  protected primaryColor = (receipt) => {
    return receipt.pdfTemplate?.attributes?.primaryColor;
  };

  /**
   * Retrieves the total amount.
   * @param receipt
   * @returns
   */
  protected total = (receipt) => {
    return receipt.total;
  };

  /**
   * Retrieves the formatted total amount.
   * @param receipt
   * @returns {string}
   */
  protected totalFormatted = (receipt) => {
    return this.formatMoney(receipt.total, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieves the discount label of the estimate.
   * @param estimate
   * @returns {string}
   */
  protected discountLabel(receipt) {
    return receipt.discountType === DiscountType.Percentage
      ? `Discount [${receipt.discountPercentageFormatted}]`
      : 'Discount';
  }

  /**
   * Retrieves the subtotal of the receipt.
   * @param receipt
   * @returns
   */
  protected subtotal = (receipt) => {
    return receipt.subtotal;
  };

  /**
   * Retrieves the formatted subtotal of the receipt.
   * @param receipt
   * @returns
   */
  protected subtotalFormatted = (receipt) => {
    return this.formatMoney(receipt.subtotal, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieves the receipt date.
   * @param receipt
   * @returns
   */
  protected receiptDate = (receipt): string => {
    return receipt.receiptDate;
  };

  /**
   * Retrieves the formatted receipt date.
   * @param {ISaleReceipt} invoice
   * @returns {string}
   */
  protected receiptDateFormatted = (receipt): string => {
    return this.formatDate(receipt.receiptDate);
  };

  /**
   *
   * @param receipt
   * @returns
   */
  protected closedAtDate = (receipt): string => {
    return receipt.closedAt;
  };

  /**
   * Retrieve formatted estimate closed at date.
   * @param {ISaleReceipt} invoice
   * @returns {String}
   */
  protected closedAtDateFormatted = (receipt): string => {
    return this.formatDate(receipt.closedAt);
  };

  /**
   *
   * @param invoice
   * @returns
   */
  protected entries = (receipt) => {
    return this.item(
      receipt.entries,
      new GetSaleReceiptEntryMailStateTransformer(),
      {
        currencyCode: receipt.currencyCode,
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

class GetSaleReceiptEntryMailStateTransformer extends ItemEntryTransformer {
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
