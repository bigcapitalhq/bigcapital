import { Transformer } from '@/modules/Transformer/Transformer';

export class GetPaymentServicesSpecificInvoiceTransformer extends Transformer {
  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['accountId'];
  };

  public includeAttributes = (): string[] => {
    return ['serviceFormatted'];
  };

  public serviceFormatted(_method) {
    return 'Stripe';
  }
}
