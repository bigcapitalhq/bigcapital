import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '@/utils';
import { PurchaseInvoiceTransformer } from '../Bills/PurchaseInvoiceTransformer';

export class BillPaymentEntryTransformer extends Transformer {
  /**
   * Include these attributes to bill payment object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['paymentAmountFormatted', 'bill'];
  };

  /**
   * Retreives the
   */
  protected bill = (entry) => {
    return this.item(entry.bill, new PurchaseInvoiceTransformer());
  };

  /**
   * Retreives the payment amount formatted.
   * @returns {string}
   */
  protected paymentAmountFormatted(entry) {
    return formatNumber(entry.paymentAmount, { money: false });
  }
}
