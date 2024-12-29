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

  public formttedAmount = (item: CreditNoteAppliedInvoice) => {
    return this.formatNumber(item.amount, {
      currencyCode: item.creditNote.currencyCode,
    });
  };

  public creditNoteNumber = (item: CreditNoteAppliedInvoice) => {
    return item.creditNote.creditNoteNumber;
  };

  public creditNoteDate = (item: CreditNoteAppliedInvoice) => {
    return item.creditNote.creditNoteDate;
  };

  public invoiceNumber = (item: CreditNoteAppliedInvoice) => {
    return item.saleInvoice.invoiceNo;
  };

  public invoiceReferenceNo = (item: CreditNoteAppliedInvoice) => {
    return item.saleInvoice.referenceNo;
  };

  public formattedCreditNoteDate = (item: CreditNoteAppliedInvoice) => {
    return this.formatDate(item.creditNote.creditNoteDate);
  };
}
