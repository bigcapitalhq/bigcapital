import { Transformer } from "@/modules/Transformer/Transformer";

export class CreditNoteWithInvoicesToApplyTransformer extends Transformer {
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
    return this.formatNumber(invoice.balance, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieve formatted invoice due amount.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected formattedDueAmount = (invoice): string => {
    return this.formatNumber(invoice.dueAmount, {
      currencyCode: invoice.currencyCode,
    });
  };

  /**
   * Retrieve formatted payment amount.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected formattedPaymentAmount = (invoice): string => {
    return this.formatNumber(invoice.paymentAmount, {
      currencyCode: invoice.currencyCode,
    });
  };
}
