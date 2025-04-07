import { Transformer } from "@/modules/Transformer/Transformer";

export class RefundVendorCreditTransformer extends Transformer {
  /**
   * Includeded attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['formttedAmount', 'formattedDate'];
  };

  /**
   * Formatted amount.
   * @returns {string}
   */
  protected formttedAmount = (item) => {
    return this.formatNumber(item.amount, {
      currencyCode: item.currencyCode,
    });
  };

  /**
   * Formatted date.
   * @returns {string}
   */
  protected formattedDate = (item) => {
    return this.formatDate(item.date);
  };
}
