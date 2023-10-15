import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';
import { SaleInvoiceTaxEntryTransformer } from './SaleInvoiceTaxEntryTransformer';
import { ItemEntryTransformer } from './ItemEntryTransformer';
import { SaleInvoiceEntryTransformer } from './SaleInvoiceEntryTransformer';
import { AttachmentTransformer } from '@/services/Attachments/AttachmentTransformer';
import { DiscountType } from '@/interfaces';

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
      'discountAmountFormatted',
      'discountPercentageFormatted',
      'adjustmentFormatted',
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
    // const dueAmount = formatNumber(invoice.dueAmount, {
    //   currencyCode: invoice.currencyCode,
    // });
    // console.log('dueAmountFormatted', invoice.dueAmount, dueAmount)
    // console.log("OPTIONS", this.options)

    return formatNumber(invoice.dueAmount, {
      // currencyCode: "USD",
      currencyCode: this.context.organization.baseCurrency,
      money: false, 
      symbol: this.options?.baseCurrencySymbol ?? ""
    });
  };

  /**
   * Retrieve formatted payment amount.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected paymentAmountFormatted = (invoice): string => {
    return formatNumber(-invoice.paymentAmount, {
      currencyCode: this.context.organization.baseCurrency,
      money: false, 
      symbol: this.options?.baseCurrencySymbol ?? ""
    });
  };

  /**
   * Retrieve the formatted invoice balance.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected balanceAmountFormatted = (invoice): string => {
    return formatNumber(invoice.balanceAmount, {
      currencyCode: this.context.organization.baseCurrency,
      money: false, 
      symbol: this.options?.baseCurrencySymbol ?? ""
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
      symbol: this.options?.baseCurrencySymbol ?? ""
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
      currencyCode: this.context.organization.baseCurrency,
      money: false, 
      symbol: this.options?.baseCurrencySymbol ?? ""
    });
  };

  /**
   * Retrieves formatted subtotal excluding tax in foreign currency.
   * @param invoice
   * @returns {string}
   */
  protected subtotalExludingTaxFormatted = (invoice): string => {
    return formatNumber(invoice.subtotalExludingTax, {
      currencyCode: this.context.organization.baseCurrency,
      money: false, 
      symbol: this.options?.baseCurrencySymbol ?? ""
    });
  };

  /**
   * Retrieves formatted tax amount withheld in foreign currency.
   * @param invoice
   * @returns {string}
   */
  protected taxAmountWithheldFormatted = (invoice): string => {
    return formatNumber(invoice.taxAmountWithheld, {
      currencyCode: this.context.organization.baseCurrency,
      money: false, 
      symbol: this.options?.baseCurrencySymbol ?? ""
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
   * Retrieves formatted discount amount.
   * @param invoice
   * @returns {string}
   */
  protected discountAmountFormatted = (invoice): string => {
    return formatNumber(invoice.discountAmount, {
      currencyCode: invoice.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves formatted discount percentage.
   * @param invoice
   * @returns {string}
   */
  protected discountPercentageFormatted = (invoice): string => {
    return invoice.discountType === DiscountType.Percentage
      ? `${invoice.discount}%`
      : '';
  };

  /**
   * Retrieves formatted adjustment amount.
   * @param invoice 
   * @returns {string}
   */
  protected adjustmentFormatted = (invoice): string => {
    return this.formatMoney(invoice.adjustment, {
      currencyCode: invoice.currencyCode,
      excerptZero: true,
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
      money: false, 
      symbol: this.options?.baseCurrencySymbol ?? ""
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
      money: false, 
      symbol: this.options?.baseCurrencySymbol ?? ""    });
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
      baseCurrencySymbol: this.options?.baseCurrencySymbol ?? ""
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
