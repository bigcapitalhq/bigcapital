import { Transformer } from '@/modules/Transformer/Transformer';
import { Bill } from '../models/Bill';
import { ItemEntryTransformer } from '@/modules/TransactionItemEntry/ItemEntry.transformer';
import { AttachmentTransformer } from '@/modules/Attachments/Attachment.transformer';

export class BillTransformer extends Transformer {
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
      'discountPercentageFormatted',
      'adjustmentFormatted',
      'totalFormatted',
      'totalLocalFormatted',
      'taxes',
      'entries',
      'attachments',
      'branch',
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
  protected formattedBillDate = (bill: Bill): string => {
    return this.formatDate(bill.billDate);
  };

  /**
   * Retrieve formatted bill date.
   * @param {IBill} bill
   * @returns {String}
   */
  protected formattedDueDate = (bill: Bill): string => {
    return this.formatDate(bill.dueDate);
  };

  /**
   * Retrieve the formatted created at date.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedCreatedAt = (bill: Bill): string => {
    return this.formatDate(bill.createdAt);
  };

  /**
   * Retrieve formatted bill amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedAmount = (bill: Bill): string => {
    return this.formatNumber(bill.amount, { currencyCode: bill.currencyCode });
  };

  /**
   * Retrieve formatted bill amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedPaymentAmount = (bill: Bill): string => {
    return this.formatNumber(bill.paymentAmount, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieve formatted bill amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedDueAmount = (bill: Bill): string => {
    return this.formatNumber(bill.dueAmount, {
      currencyCode: bill.currencyCode,
      money: true,
    });
  };

  /**
   * Retrieve formatted bill balance.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedBalance = (bill: Bill): string => {
    return this.formatNumber(bill.balance, { currencyCode: bill.currencyCode });
  };

  /**
   * Retrieve the formatted exchange rate.
   * @param {IBill} bill
   * @returns {string}
   */
  protected formattedExchangeRate = (bill: Bill): string => {
    return this.formatNumber(bill.exchangeRate, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieves the formatted subtotal.
   * @param {IBill} bill
   * @returns {string}
   */
  protected subtotalFormatted = (bill: Bill): string => {
    return this.formatNumber(bill.subtotal, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieves the local subtotal formatted.
   * @param {IBill} bill
   * @returns {string}
   */
  protected subtotalLocalFormatted = (bill: Bill): string => {
    return this.formatNumber(bill.subtotalLocal, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieves the formatted subtotal tax excluded.
   * @param {IBill} bill
   * @returns {string}
   */
  protected subtotalExcludingTaxFormatted = (bill: Bill): string => {
    return this.formatNumber(bill.subtotalExcludingTax, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieves the local formatted tax amount withheld
   * @param {IBill} bill
   * @returns {string}
   */
  protected taxAmountWithheldLocalFormatted = (bill: Bill): string => {
    return this.formatNumber(bill.taxAmountWithheldLocal, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieves the total formatted.
   * @param {IBill} bill
   * @returns {string}
   */
  protected totalFormatted = (bill: Bill): string => {
    return this.formatNumber(bill.total, {
      currencyCode: bill.currencyCode,
      money: true,
    });
  };

  /**
   * Retrieves the local total formatted.
   * @param {IBill} bill
   * @returns {string}
   */
  protected totalLocalFormatted = (bill: Bill): string => {
    return this.formatNumber(bill.totalLocal, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieves the formatted discount amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected discountAmountFormatted = (bill: Bill): string => {
    return this.formatNumber(bill.discountAmount, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieves the formatted discount percentage.
   * @param {IBill} bill
   * @returns {string}
   */
  protected discountPercentageFormatted = (bill: Bill): string => {
    return bill.discountPercentage ? `${bill.discountPercentage}%` : '';
  };

  /**
   * Retrieves the formatted adjustment amount.
   * @param {IBill} bill
   * @returns {string}
   */
  protected adjustmentFormatted = (bill: Bill): string => {
    return this.formatNumber(bill.adjustment, {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieve the taxes lines of bill.
   * @param {Bill} bill
   */
  // protected taxes = (bill: Bill) => {
  //   return this.item(bill.taxes, new SaleInvoiceTaxEntryTransformer(), {
  //     subtotal: bill.subtotal,
  //     isInclusiveTax: bill.isInclusiveTax,
  //     currencyCode: bill.currencyCode,
  //   });
  // };

  /**
   * Retrieves the entries of the bill.
   * @param {Bill} credit
   */
  protected entries = (bill: Bill) => {
    return this.item(bill.entries, new ItemEntryTransformer(), {
      currencyCode: bill.currencyCode,
    });
  };

  /**
   * Retrieves the bill attachments.
   * @param {Bill} bill
   */
  protected attachments = (bill: Bill) => {
    return this.item(bill.attachments, new AttachmentTransformer());
  };
}
