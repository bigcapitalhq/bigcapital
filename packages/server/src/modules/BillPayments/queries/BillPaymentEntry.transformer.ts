import { BillTransformer } from "../../Bills/queries/Bill.transformer";
import { Transformer } from "../../Transformer/Transformer";

export class BillPaymentEntryTransformer extends Transformer{
  /**
   * Include these attributes to bill payment object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['paymentAmountFormatted', 'bill'];
  };

  /**
   * Retreives the bill.
   */
  protected bill = (entry) => {
    return this.item(entry.bill, new BillTransformer());
  };

  /**
   * Retreives the payment amount formatted.
   * @returns {string}
   */
  protected paymentAmountFormatted(entry) {
    return this.formatNumber(entry.paymentAmount, { money: false });
  }
}
