import { DiscountType } from '@/common/types/Discount';
import { ItemEntryTransformer } from '@/modules/TransactionItemEntry/ItemEntry.transformer';
import { Transformer } from '@/modules/Transformer/Transformer';

export class GetSaleReceiptMailStateTransformer extends Transformer {
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
      'subtotal',
      'subtotalFormatted',
      'receiptDate',
      'receiptDateFormatted',
      'closedAtDate',
      'closedAtDateFormatted',
      'receiptNumber',

      'discountAmount',
      'discountAmountFormatted',
      'discountPercentage',
      'discountPercentageFormatted',
      'discountLabel',

      'adjustment',
      'adjustmentFormatted',

      'taxes',
      'showTaxes',

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
   * Retrieves the receipt total (including taxes).
   * @param receipt
   * @returns
   */
  protected total = (receipt) => {
    return receipt.total;
  };

  /**
   * Retrieves the formatted receipt total (including taxes).
   * @param receipt
   * @returns
   */
  protected totalFormatted = (receipt) => {
    return this.formatMoney(receipt.total, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   * Retrieves the receipt subtotal.
   * @param receipt
   * @returns
   */
  protected subtotal = (receipt) => {
    return receipt.subtotal;
  };

  /**
   * Retrieves the formatted receipt subtotal.
   * @param receipt
   * @returns
   */
  protected subtotalFormatted = (receipt) => {
    return this.formatMoney(receipt.subtotal, {
      currencyCode: receipt.currencyCode,
    });
  };

  /**
   *
   * @param receipt
   * @returns
   */
  protected receiptDate = (receipt): string => {
    return receipt.receiptDate;
  };

  /**
   *
   * @param {ISaleReceipt} invoice
   * @returns {string}
   */
  protected receiptDateFormatted = (receipt): string => {
    return this.formatDate(receipt.receiptDate);
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
      },
    );
  };

  /**
   * Retrieves the taxes with label and amount format for mail preview.
   * @param receipt
   * @returns {Array<{ label: string; amount: string }>}
   */
  protected taxes = (receipt) => {
    const { getInclusiveTaxAmount, getExlusiveTaxAmount } = require('../../TaxRates/utils');

    return receipt.taxes?.map((tax) => {
      const taxRate = tax.rate || tax.taxRate?.rate || 0;
      const taxAmount = receipt.isInclusiveTax
        ? getInclusiveTaxAmount(receipt.subtotal, taxRate)
        : getExlusiveTaxAmount(receipt.subtotal, taxRate);

      return {
        label: `${tax.taxRate?.name || ''} [${taxRate}%]`,
        amount: this.formatNumber(taxAmount, {
          currencyCode: receipt.currencyCode,
        }),
      };
    }) || [];
  };

  /**
   * Retrieves whether taxes should be shown.
   * @param receipt
   * @returns {boolean}
   */
  protected showTaxes = (receipt) => {
    return receipt.taxes?.length > 0;
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
