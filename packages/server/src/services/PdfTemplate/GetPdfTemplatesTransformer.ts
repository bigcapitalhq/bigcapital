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

  /**
   * Formats the creation date of the PDF template.
   * @param {Object} template
   * @returns {string} A formatted string representing the creation date of the template.
   */
  protected createdAtFormatted = (template) => {
    return this.formatDate(template.createdAt);
  };

  /**
   * Formats the creation date of the PDF template.
   * @param {Object} template -
   * @returns {string} A formatted string representing the creation date of the template.
   */
  protected resourceFormatted = (template) => {
    return getTransactionTypeLabel(template.resource);
  };
}
