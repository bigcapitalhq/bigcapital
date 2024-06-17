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
