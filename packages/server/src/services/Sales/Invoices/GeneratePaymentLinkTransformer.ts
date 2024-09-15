import { Transformer } from '@/lib/Transformer/Transformer';

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
   * 
   * @param link 
   * @returns 
   */
  public link(link) {
    return `http://localhost:3000/payment/${link.linkId}`;
  }
}
