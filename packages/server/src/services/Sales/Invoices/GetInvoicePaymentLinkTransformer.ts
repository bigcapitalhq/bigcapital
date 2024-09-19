import { ItemEntryTransformer } from './ItemEntryTransformer';
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

  itemName(entry) {
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
