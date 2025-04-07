import { AttachmentTransformer } from "@/modules/Attachments/Attachment.transformer";
import { ItemEntryTransformer } from "@/modules/TransactionItemEntry/ItemEntry.transformer";
import { Transformer } from "@/modules/Transformer/Transformer";
import { VendorCredit } from "../models/VendorCredit";

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
   * @param {VendorCredit} credit
   * @returns {String}
   */
  protected formattedVendorCreditDate = (vendorCredit: VendorCredit): string => {
    return this.formatDate(vendorCredit.vendorCreditDate);
  };

  /**
   * Retireve formatted created at date.
   * @param {VendorCredit} vendorCredit
   * @returns {string}
   */
  protected formattedCreatedAt = (vendorCredit: VendorCredit): string => {
    return this.formatDate(vendorCredit.createdAt);
  };

  /**
   * Retrieve formatted vendor credit amount.
   * @param {VendorCredit} credit
   * @returns {string}
   */
  protected formattedAmount = (vendorCredit: VendorCredit): string => {
    return this.formatNumber(vendorCredit.amount, {
      currencyCode: vendorCredit.currencyCode,
    });
  };

  /**
   * Retrieves the vendor credit formatted subtotal.
   * @param {VendorCredit} vendorCredit
   * @returns {string}
   */
  protected formattedSubtotal = (vendorCredit: VendorCredit): string => {
    return this.formatNumber(vendorCredit.amount, { money: false });
  };

  /**
   * Retrieve formatted credits remaining.
   * @param {VendorCredit} credit
   * @returns {string}
   */
  protected formattedCreditsRemaining = (credit: VendorCredit): string => {
    return this.formatNumber(credit.creditsRemaining, {
      currencyCode: credit.currencyCode,
    });
  };

  /**
   * Retrieves the formatted discount amount.
   * @param {IVendorCredit} credit
   * @returns {string}
   */
  protected discountAmountFormatted = (credit): string => {
    return this.formatNumber(credit.discountAmount, {
      currencyCode: credit.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted discount amount in local currency.
   * @param {VendorCredit} credit
   * @returns {string}
   */
  protected discountAmountLocalFormatted = (credit): string => {
    return this.formatNumber(credit.discountAmountLocal, {
      currencyCode: this.context.organization.baseCurrency,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted discount percentage.
   * @param {VendorCredit} credit
   * @returns {string}
   */
  protected discountPercentageFormatted = (credit): string => {
    return credit.discountPercentage ? `${credit.discountPercentage}%` : '';
  };

  /**
   * Retrieves the formatted adjustment amount.
   * @param {VendorCredit} credit
   * @returns {string}
   */
  protected adjustmentFormatted = (credit): string => {
    return this.formatNumber(credit.adjustment, {
      currencyCode: credit.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted adjustment amount in local currency.
   * @param {VendorCredit} credit
   * @returns {string}
   */
  protected adjustmentLocalFormatted = (credit: VendorCredit): string => {
    return this.formatNumber(credit.adjustmentLocal, {
      currencyCode: this.context.organization.baseCurrency,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted invoiced amount.
   * @param credit
   * @returns {string}
   */
  protected formattedInvoicedAmount = (credit: VendorCredit): string => {
    return this.formatNumber(credit.invoicedAmount, {
      currencyCode: credit.currencyCode,
    });
  };

  /**
   * Retrieves the formatted total.
   * @param {VendorCredit} credit
   * @returns {string}
   */
  protected totalFormatted = (credit: VendorCredit): string => {
    return this.formatNumber(credit.total, {
      currencyCode: credit.currencyCode,
    });
  };

  /**
   * Retrieves the entries of the bill.
   * @param {VendorCredit} vendorCredit
   * @returns {}
   */
  protected entries = (vendorCredit: VendorCredit) => {
    return this.item(vendorCredit.entries, new ItemEntryTransformer(), {
      currencyCode: vendorCredit.currencyCode,
    });
  };

  /**
   * Retrieves the vendor credit attachments.
   * @param {VendorCredit} invoice
   * @returns
   */
  protected attachments = (vendorCredit: VendorCredit) => {
    return this.item(vendorCredit.attachments, new AttachmentTransformer());
  };
}
