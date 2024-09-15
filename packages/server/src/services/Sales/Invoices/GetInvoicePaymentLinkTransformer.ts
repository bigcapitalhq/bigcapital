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
    ];
  };

  public customerName(invoice) {
    return invoice.customer.displayName;
  }

  public companyName() {
    return 'Bigcapital Technology, Inc.';
  }
}
