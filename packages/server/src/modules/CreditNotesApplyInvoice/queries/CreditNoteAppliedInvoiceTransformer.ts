import { Transformer } from '../../Transformer/Transformer';
import { CreditNoteAppliedInvoice } from '../models/CreditNoteAppliedInvoice';

export class CreditNoteAppliedInvoiceTransformer extends Transformer {
  /**
   * Includeded attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'formttedAmount',
      'creditNoteNumber',
      'creditNoteDate',
      'invoiceNumber',
      'invoiceReferenceNo',
      'formattedCreditNoteDate',
    ];
  };

  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['saleInvoice', 'creditNote'];
  };

  /**
   * Formatted amount.
   * @param {CreditNoteAppliedInvoice} item -
   * @returns {string}
   */
  public formttedAmount = (item: CreditNoteAppliedInvoice) => {
    return this.formatNumber(item.amount, {
      currencyCode: item.creditNote.currencyCode,
    });
  };

  /**
   * Credit note number.
   * @param {CreditNoteAppliedInvoice} item -
   * @returns {string}
   */
  public creditNoteNumber = (item: CreditNoteAppliedInvoice) => {
    return item.creditNote.creditNoteNumber;
  };

  /**
   * Credit note date.
   * @param {CreditNoteAppliedInvoice} item -
   * @returns {string}
   */
  public creditNoteDate = (item: CreditNoteAppliedInvoice) => {
    return item.creditNote.creditNoteDate;
  };

  /**
   * Invoice number.
   * @param {CreditNoteAppliedInvoice} item -
   * @returns {string}
   */
  public invoiceNumber = (item: CreditNoteAppliedInvoice) => {
    return item.saleInvoice.invoiceNo;
  };

  /**
   * Invoice reference no.
   * @param {CreditNoteAppliedInvoice} item -
   * @returns {string}
   */
  public invoiceReferenceNo = (item: CreditNoteAppliedInvoice) => {
    return item.saleInvoice.referenceNo;
  };

  /**
   * Formatted credit note date.
   * @param {CreditNoteAppliedInvoice} item -
   * @returns {string}
   */
  public formattedCreditNoteDate = (item: CreditNoteAppliedInvoice) => {
    return this.formatDate(item.creditNote.creditNoteDate);
  };
}
