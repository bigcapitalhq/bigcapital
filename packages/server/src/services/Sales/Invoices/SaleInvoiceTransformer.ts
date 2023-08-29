import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';
import { SaleInvoiceTaxEntryTransformer } from './SaleInvoiceTaxEntryTransformer';

export class SaleInvoiceTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedInvoiceDate',
      'formattedDueDate',
      'formattedAmount',
      'formattedDueAmount',
      'formattedPaymentAmount',
      'formattedBalanceAmount',
      'formattedExchangeRate',
      'taxes',
    ];
  };

  /**
   * Retrieve formatted invoice date.
   * @param {ISaleInvoice} invoice
   * @returns {String}
   */
  protected formattedInvoiceDate = (invoice): string => {
    return this.formatDate(invoice.invoiceDate);
  };

  /**
   * Retrieve formatted due date.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected formattedDueDate = (invoice): string => {
    return this.formatDate(invoice.dueDate);
  };

  /**
   * Retrieve formatted invoice amount.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected formattedAmount = (invoice): string => {
    return formatNumber(invoice.balance, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieve formatted invoice due amount.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected formattedDueAmount = (invoice): string => {
    return formatNumber(invoice.dueAmount, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieve formatted payment amount.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected formattedPaymentAmount = (invoice): string => {
    return formatNumber(invoice.paymentAmount, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieve the formatted invoice balance.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected formattedBalanceAmount = (invoice): string => {
    return formatNumber(invoice.balanceAmount, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieve the formatted exchange rate.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected formattedExchangeRate = (invoice): string => {
    return formatNumber(invoice.exchangeRate, { money: false });
  };

  /**
   * Retrieve the taxes lines of sale invoice.
   * @param {ISaleInvoice} invoice
   */
  protected taxes = (invoice) => {
    return this.item(invoice.taxes, new SaleInvoiceTaxEntryTransformer());
  };
}
