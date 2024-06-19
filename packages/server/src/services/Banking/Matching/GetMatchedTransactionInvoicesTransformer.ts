import { Transformer } from '@/lib/Transformer/Transformer';

export class GetMatchedTransactionInvoicesTransformer extends Transformer {
  /**
   * Include these attributes to sale credit note object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['referenceNo', 'transactionNo'];
  };

  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  protected referenceNo(invoice) {
    return invoice.referenceNo;
  }

  protected transactionNo(invoice) {
    return invoice.invoiceNo;
  }
}
