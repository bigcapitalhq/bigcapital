import { IVendorCredit } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { AttachmentTransformer } from '@/services/Attachments/AttachmentTransformer';
import { ItemEntryTransformer } from '@/services/Sales/Invoices/ItemEntryTransformer';
import { formatNumber } from 'utils';

export class VendorCreditTransformer extends Transformer {
  /**
   * Include these attributes to vendor credit object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'formattedSubtotal',
      'formattedVendorCreditDate',
      'formattedCreatedAt',
      'formattedCreditsRemaining',
      'formattedInvoicedAmount',

      'discountAmountFormatted',
      'discountPercentageFormatted',
      'discountAmountLocalFormatted',

      'adjustmentFormatted',
      'adjustmentLocalFormatted',

      'totalFormatted',
      'entries',
      'attachments',
    ];
  };

  /**
   * Retrieve formatted vendor credit date.
   * @param {IVendorCredit} credit
   * @returns {String}
   */
  protected formattedVendorCreditDate = (vendorCredit): string => {
    return this.formatDate(vendorCredit.vendorCreditDate);
  };

  /**
   * Retireve formatted created at date.
   * @param vendorCredit
   * @returns {string}
   */
  protected formattedCreatedAt = (vendorCredit): string => {
    return this.formatDate(vendorCredit.createdAt);
  };

  /**
   * Retrieve formatted vendor credit amount.
   * @param {IVendorCredit} credit
   * @returns {string}
   */
  protected formattedAmount = (vendorCredit): string => {
    return formatNumber(vendorCredit.amount, {
      currencyCode: vendorCredit.currencyCode,
    });
  };

  /**
   * Retrieves the vendor credit formatted subtotal.
   * @param {IVendorCredit} vendorCredit
   * @returns {string}
   */
  protected formattedSubtotal = (vendorCredit): string => {
    return formatNumber(vendorCredit.amount, { money: false });
  };

  /**
   * Retrieve formatted credits remaining.
   * @param {IVendorCredit} credit
   * @returns {string}
   */
  protected formattedCreditsRemaining = (credit) => {
    return formatNumber(credit.creditsRemaining, {
      currencyCode: credit.currencyCode,
    });
  };

  /**
   * Retrieves the formatted discount amount.
   * @param {IVendorCredit} credit
   * @returns {string}
   */
  protected discountAmountFormatted = (credit): string => {
    return formatNumber(credit.discountAmount, {
      currencyCode: credit.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted discount amount in local currency.
   * @param {IVendorCredit} credit
   * @returns {string}
   */
  protected discountAmountLocalFormatted = (credit): string => {
    return formatNumber(credit.discountAmountLocal, {
      currencyCode: this.context.organization.baseCurrency,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted discount percentage.
   * @param {IVendorCredit} credit
   * @returns {string}
   */
  protected discountPercentageFormatted = (credit): string => {
    return credit.discountPercentage ? `${credit.discountPercentage}%` : '';
  };

  /**
   * Retrieves the formatted adjustment amount.
   * @param {IVendorCredit} credit
   * @returns {string}
   */
  protected adjustmentFormatted = (credit): string => {
    return formatNumber(credit.adjustment, {
      currencyCode: credit.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted adjustment amount in local currency.
   * @param {IVendorCredit} credit
   * @returns {string}
   */
  protected adjustmentLocalFormatted = (credit): string => {
    return formatNumber(credit.adjustmentLocal, {
      currencyCode: this.context.organization.baseCurrency,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted invoiced amount.
   * @param credit
   * @returns {string}
   */
  protected formattedInvoicedAmount = (credit) => {
    return formatNumber(credit.invoicedAmount, {
      currencyCode: credit.currencyCode,
    });
  };

  /**
   * Retrieves the formatted total.
   * @param {IVendorCredit} credit
   * @returns {string}
   */
  protected totalFormatted = (credit) => {
    return formatNumber(credit.total, { currencyCode: credit.currencyCode });
  };

  /**
   * Retrieves the entries of the bill.
   * @param {IVendorCredit} vendorCredit
   * @returns {}
   */
  protected entries = (vendorCredit) => {
    return this.item(vendorCredit.entries, new ItemEntryTransformer(), {
      currencyCode: vendorCredit.currencyCode,
    });
  };

  /**
   * Retrieves the vendor credit attachments.
   * @param {IVendorCredit} invoice
   * @returns
   */
  protected attachments = (vendorCredit) => {
    return this.item(vendorCredit.attachments, new AttachmentTransformer());
  };
}
