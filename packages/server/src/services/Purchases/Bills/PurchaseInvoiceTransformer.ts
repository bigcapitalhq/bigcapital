import { IBill } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { AttachmentTransformer } from '@/services/Attachments/AttachmentTransformer';
import { ItemEntryTransformer } from '@/services/Sales/Invoices/ItemEntryTransformer';
import { SaleInvoiceTaxEntryTransformer } from '@/services/Sales/Invoices/SaleInvoiceTaxEntryTransformer';
import { formatNumber } from 'utils';

export class PurchaseInvoiceTransformer extends Transformer {
  /**
   * Include these attributes to sale bill object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedBillDate',
      'formattedDueDate',
      'formattedCreatedAt',
      'formattedAmount',
      'formattedPaymentAmount',
      'formattedBalance',
      'formattedDueAmount',
      'formattedExchangeRate',

      'subtotalFormatted',
      'subtotalLocalFormatted',

      'subtotalExcludingTaxFormatted',
      'taxAmountWithheldLocalFormatted',

      'discountAmountFormatted',
      'discountAmountLocalFormatted',

      'discountPercentageFormatted',

      'adjustmentFormatted',
      'adjustmentLocalFormatted',

      'totalFormatted',
      'totalLocalFormatted',
      'taxes',
      'entries',
      'attachments',
    ];
  };

  /**
   * Excluded attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['amount', 'amountLocal', 'localAmount'];
  };

  /**
   * Retrieve formatted bill date.
   * @param {IBill} bill
   * @returns {String}
   */
  protected formattedBillDate = (bill: IBill): string => {
    return this.formatDate(bill.billDate);
  };

  /**
   * Retrieve formatted bill date.
   * @param {IBill} bill
   * @returns {String}
   */
  protected formattedDueDate = (bill: IBill): string => {
    return this.formatDate(bill.dueDate);
  };

  /**
   * Retrieve the formatted created at date.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedCreatedAt = (bill: IBill): string => {
    return this.formatDate(bill.createdAt);
  };

  /**
   * Retrieve formatted bill amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedAmount = (bill): string => {
    return formatNumber(bill.amount, { currencyCode: bill.currencyCode });
  };

  /**
   * Retrieve formatted bill amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedPaymentAmount = (bill): string => {
    return formatNumber(bill.paymentAmount, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieve formatted bill amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedDueAmount = (bill): string => {
    return formatNumber(bill.dueAmount, { currencyCode: bill.currencyCode });
  };

  /**
   * Retrieve formatted bill balance.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedBalance = (bill): string => {
    return formatNumber(bill.balance, { currencyCode: bill.currencyCode });
  };

  /**
   * Retrieve the formatted exchange rate.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedExchangeRate = (bill): string => {
    return formatNumber(bill.exchangeRate, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieves the formatted subtotal.
   * @param {IBill} bill
   * @returns {string}
   */
  protected subtotalFormatted = (bill): string => {
    return formatNumber(bill.subtotal, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieves the local subtotal formatted.
   * @param {IBill} bill
   * @returns {string}
   */
  protected subtotalLocalFormatted = (bill): string => {
    return formatNumber(bill.subtotalLocal, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieves the formatted subtotal tax excluded.
   * @param {IBill} bill
   * @returns {string}
   */
  protected subtotalExcludingTaxFormatted = (bill): string => {
    return formatNumber(bill.subtotalExludingTax, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieves the local formatted tax amount withheld
   * @param {IBill} bill
   * @returns {string}
   */
  protected taxAmountWithheldLocalFormatted = (bill): string => {
    return formatNumber(bill.taxAmountWithheldLocal, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieves the formatted discount amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected discountAmountFormatted = (bill): string => {
    return formatNumber(bill.discountAmount, {
      currencyCode: bill.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted discount amount in local currency.
   * @param {IBill} bill
   * @returns {string}
   */
  protected discountAmountLocalFormatted = (bill): string => {
    return formatNumber(bill.discountAmountLocal, {
      currencyCode: this.context.organization.baseCurrency,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted discount percentage.
   * @param {IBill} bill
   * @returns {string}
   */
  protected discountPercentageFormatted = (bill): string => {
    return bill.discountPercentage ? `${bill.discountPercentage}%` : '';
  };

  /**
   * Retrieves the formatted adjustment amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected adjustmentFormatted = (bill): string => {
    return formatNumber(bill.adjustment, {
      currencyCode: bill.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted adjustment amount in local currency.
   * @param {IBill} bill
   * @returns {string}
   */
  protected adjustmentLocalFormatted = (bill): string => {
    return formatNumber(bill.adjustmentLocal, {
      currencyCode: this.context.organization.baseCurrency,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the total formatted.
   * @param {IBill} bill
   * @returns {string}
   */
  protected totalFormatted = (bill): string => {
    return formatNumber(bill.total, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieves the local total formatted.
   * @param {IBill} bill
   * @returns {string}
   */
  protected totalLocalFormatted = (bill): string => {
    return formatNumber(bill.totalLocal, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieve the taxes lines of bill.
   * @param {Bill} bill
   */
  protected taxes = (bill) => {
    return this.item(bill.taxes, new SaleInvoiceTaxEntryTransformer(), {
      subtotal: bill.subtotal,
      isInclusiveTax: bill.isInclusiveTax,
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieves the entries of the bill.
   * @param {Bill} credit
   * @returns {}
   */
  protected entries = (bill) => {
    return this.item(bill.entries, new ItemEntryTransformer(), {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieves the bill attachments.
   * @param {ISaleInvoice} invoice
   * @returns
   */
  protected attachments = (bill) => {
    return this.item(bill.attachments, new AttachmentTransformer());
  };
}
