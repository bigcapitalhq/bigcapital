import { Transformer } from '@/lib/Transformer/Transformer';

export class GetPdfTemplatesTransformer extends Transformer {
  // Empty transformer with no additional methods or attributes

  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['attributes'];
  };
}
