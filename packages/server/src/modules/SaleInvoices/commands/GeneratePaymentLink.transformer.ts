import { Transformer } from '@/modules/Transformer/Transformer';
import { PUBLIC_PAYMENT_LINK } from '../constants';

interface GeneratePaymentLinkTransformerOptions {
  baseUrl: string;
}
export class GeneratePaymentLinkTransformer extends Transformer<GeneratePaymentLinkTransformerOptions> {
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
    return PUBLIC_PAYMENT_LINK?.replace(
      '{BASE_URL}',
      this.options.baseUrl,
    ).replace('{PAYMENT_LINK_ID}', link.linkId);
  }
}
