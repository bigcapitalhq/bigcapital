import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';
import { SaleInvoiceTaxEntryTransformer } from './SaleInvoiceTaxEntryTransformer';
import { ItemEntryTransformer } from './ItemEntryTransformer';
import { AttachmentTransformer } from '@/services/Attachments/AttachmentTransformer';

export class SaleInvoiceTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'invoiceDateFormatted',
      'dueDateFormatted',
      'createdAtFormatted',
      'dueAmountFormatted',
      'paymentAmountFormatted',
      'balanceAmountFormatted',
      'exchangeRateFormatted',
      'subtotalFormatted',
      'subtotalLocalFormatted',
      'subtotalExludingTaxFormatted',
      'taxAmountWithheldFormatted',
      'taxAmountWithheldLocalFormatted',
      'totalFormatted',
      'totalLocalFormatted',
      'taxes',
      'entries',
      'attachments',
    ];
  };

  /**
   * Retrieve formatted invoice date.
   * @param {ISaleInvoice} invoice
   * @returns {String}
   */
  protected invoiceDateFormatted = (invoice): string => {
    return this.formatDate(invoice.invoiceDate);
  };

  /**
   * Retrieve formatted due date.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected dueDateFormatted = (invoice): string => {
    return this.formatDate(invoice.dueDate);
  };

  /**
   * Retrieve the formatted created at date.
   * @param invoice
   * @returns {string}
   */
  protected createdAtFormatted = (invoice): string => {
    return this.formatDate(invoice.createdAt);
  };

  /**
   * Retrieve formatted invoice due amount.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected dueAmountFormatted = (invoice): string => {
    return formatNumber(invoice.dueAmount, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieve formatted payment amount.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected paymentAmountFormatted = (invoice): string => {
    return formatNumber(invoice.paymentAmount, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieve the formatted invoice balance.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected balanceAmountFormatted = (invoice): string => {
    return formatNumber(invoice.balanceAmount, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieve the formatted exchange rate.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected exchangeRateFormatted = (invoice): string => {
    return formatNumber(invoice.exchangeRate, { money: false });
  };

  /**
   * Retrieves formatted subtotal in base currency.
   * (Tax inclusive if the tax inclusive is enabled)
   * @param invoice
   * @returns {string}
   */
  protected subtotalFormatted = (invoice): string => {
    return formatNumber(invoice.subtotal, {
      currencyCode: this.context.organization.baseCurrency,
      money: false,
    });
  };

  /**
   * Retrieves formatted subtotal in foreign currency.
   * (Tax inclusive if the tax inclusive is enabled)
   * @param invoice
   * @returns {string}
   */
  protected subtotalLocalFormatted = (invoice): string => {
    return formatNumber(invoice.subtotalLocal, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieves formatted subtotal excluding tax in foreign currency.
   * @param invoice
   * @returns {string}
   */
  protected subtotalExludingTaxFormatted = (invoice): string => {
    return formatNumber(invoice.subtotalExludingTax, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieves formatted tax amount withheld in foreign currency.
   * @param invoice
   * @returns {string}
   */
  protected taxAmountWithheldFormatted = (invoice): string => {
    return formatNumber(invoice.taxAmountWithheld, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieves formatted tax amount withheld in base currency.
   * @param invoice
   * @returns {string}
   */
  protected taxAmountWithheldLocalFormatted = (invoice): string => {
    return formatNumber(invoice.taxAmountWithheldLocal, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieves formatted total in foreign currency.
   * @param invoice
   * @returns {string}
   */
  protected totalFormatted = (invoice): string => {
    return formatNumber(invoice.total, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieves formatted total in base currency.
   * @param invoice
   * @returns {string}
   */
  protected totalLocalFormatted = (invoice): string => {
    return formatNumber(invoice.totalLocal, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieve the taxes lines of sale invoice.
   * @param {ISaleInvoice} invoice
   */
  protected taxes = (invoice) => {
    return this.item(invoice.taxes, new SaleInvoiceTaxEntryTransformer(), {
      subtotal: invoice.subtotal,
      isInclusiveTax: invoice.isInclusiveTax,
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieves the entries of the sale invoice.
   * @param {ISaleInvoice} invoice
   * @returns {}
   */
  protected entries = (invoice) => {
    return this.item(invoice.entries, new ItemEntryTransformer(), {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieves the sale invoice attachments.
   * @param {ISaleInvoice} invoice
   * @returns
   */
  protected attachments = (invoice) => {
    return this.item(invoice.attachments, new AttachmentTransformer());
  };
}
