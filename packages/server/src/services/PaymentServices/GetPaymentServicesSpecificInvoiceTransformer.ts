import { Transformer } from '@/lib/Transformer/Transformer';

export class GetPaymentServicesSpecificInvoiceTransformer extends Transformer {
  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['accountId'];
  };
}
