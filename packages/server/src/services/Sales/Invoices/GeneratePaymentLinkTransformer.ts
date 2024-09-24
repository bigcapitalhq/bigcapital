import { Transformer } from '@/lib/Transformer/Transformer';
import { PUBLIC_PAYMENT_LINK } from './constants';

export class GeneratePaymentLinkTransformer extends Transformer {
  /**
   * Exclude these attributes from payment link object.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['linkId'];
  };

  /**
   * Included attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['link'];
  };

  /**
   * Retrieves the public/private payment linl
   * @returns {string}
   */
  public link(link) {
    return PUBLIC_PAYMENT_LINK?.replace('{PAYMENT_LINK_ID}', link.linkId);
  }
}
