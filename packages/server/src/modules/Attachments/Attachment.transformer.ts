import { Transformer } from "../Transformer/Transformer";

export class AttachmentTransformer extends Transformer {
  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['id', 'createdAt'];
  };

  /**
   * Includeded attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [];
  };
}
