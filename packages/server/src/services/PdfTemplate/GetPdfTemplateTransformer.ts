import { Transformer } from '@/lib/Transformer/Transformer';
import { getTransactionTypeLabel } from '@/utils/transactions-types';
import { getUploadedObjectUri } from '../Attachments/utils';

export class GetPdfTemplateTransformer extends Transformer {
  /**
   * Includeded attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['createdAtFormatted', 'resourceFormatted', 'attributes'];
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

  /**
   * Retrieves transformed brand attributes.
   * @param {} template
   * @returns
   */
  protected attributes = (template) => {
    return this.item(
      template.attributes,
      new GetPdfTemplateAttributesTransformer()
    );
  };
}

class GetPdfTemplateAttributesTransformer extends Transformer {
  /**
   * Includeded attributes.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['companyLogoUri'];
  };

  /**
   * Retrieves the company logo uri.
   * @returns {string}
   */
  protected companyLogoUri(template) {
    return template.companyLogoKey
      ? getUploadedObjectUri(template.companyLogoKey)
      : '';
  }
}
