import { Transformer } from '@/lib/Transformer/Transformer';
import { getTransactionTypeLabel } from '@/utils/transactions-types';

export class GetPdfTemplatesTransformer extends Transformer {
  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['attributes'];
  };

  /**
   * Includeded attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['createdAtFormatted', 'resourceFormatted'];
  };

  private createdAtFormatted = (template) => {
    return this.formatDate(template.createdAt);
  };

  private resourceFormatted = (template) => {
    return getTransactionTypeLabel(template.resource);
  };
}
