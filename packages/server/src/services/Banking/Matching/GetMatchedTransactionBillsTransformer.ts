import { Transformer } from '@/lib/Transformer/Transformer';

export class GetMatchedTransactionBillsTransformer extends Transformer {
  /**
   * Include these attributes to sale credit note object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['referenceNo'];
  };

  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  protected referenceNo(invoice) {
    return invoice.referenceNo;
  }

  amount(invoice) {
    return 1;
  }
  amountFormatted() {

  }
  date() {

  }
  dateFromatted() {

  }
  transactionId(invoice) {
    return invoice.id;
  }
  transactionNo() {
    
  }
  transactionType() {}
  transsactionTypeFormatted() {}
}
