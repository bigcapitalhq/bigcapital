import { ItemEntryTransformer } from './ItemEntryTransformer';
import { SaleInvoiceTaxEntryTransformer } from './SaleInvoiceTaxEntryTransformer';
import { SaleInvoiceTransformer } from './SaleInvoiceTransformer';

export class GetInvoicePaymentLinkMetaTransformer extends SaleInvoiceTransformer {
  /**
   * Exclude these attributes from payment link object.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Included attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'companyName',
      'customerName',
      'dueAmount',
      'dueDateFormatted',
      'invoiceDateFormatted',
      'total',
      'totalFormatted',
      'totalLocalFormatted',
      'subtotal',
      'subtotalFormatted',
      'subtotalLocalFormatted',
      'dueAmount',
      'dueAmountFormatted',
      'paymentAmount',
      'paymentAmountFormatted',
      'dueDate',
      'dueDateFormatted',
      'invoiceNo',
      'invoiceMessage',
      'termsConditions',
      'entries',
      'taxes',
    ];
  };

  public customerName(invoice) {
    return invoice.customer.displayName;
  }

  public companyName() {
    return 'Bigcapital Technology, Inc.';
  }

  /**
   * Retrieves the entries of the sale invoice.
   * @param {ISaleInvoice} invoice
   * @returns {}
   */
  protected entries = (invoice) => {
    return this.item(
      invoice.entries,
      new GetInvoicePaymentLinkEntryMetaTransformer(),
      {
        currencyCode: invoice.currencyCode,
      }
    );
  };

  /**
   * Retrieves the sale invoice entries.
   * @returns {}
   */
  protected taxes = (invoice) => {
    return this.item(
      invoice.taxes,
      new GetInvoicePaymentLinkTaxEntryTransformer(),
      {
        subtotal: invoice.subtotal,
        isInclusiveTax: invoice.isInclusiveTax,
        currencyCode: invoice.currencyCode,
      }
    );
  };
}

class GetInvoicePaymentLinkEntryMetaTransformer extends ItemEntryTransformer {
  /**
   * Include these attributes to item entry object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'quantity',
      'quantityFormatted',
      'rate',
      'rateFormatted',
      'total',
      'totalFormatted',
      'itemName',
      'description',
    ];
  };

  public itemName(entry) {
    return entry.item.name;
  }

  /**
   * Exclude these attributes from payment link object.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };
}

class GetInvoicePaymentLinkTaxEntryTransformer extends SaleInvoiceTaxEntryTransformer {
  /**
   * Included attributes.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['name', 'taxRateCode', 'taxRateAmount', 'taxRateAmountFormatted'];
  };
}
