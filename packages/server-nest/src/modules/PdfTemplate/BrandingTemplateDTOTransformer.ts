import { Inject, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { PdfTemplateModel } from './models/PdfTemplate';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class BrandingTemplateDTOTransformer {
  /**
   * @param {PdfTemplateModel} - Pdf template model.
   */
  constructor(
    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplate: TenantModelProxy<typeof PdfTemplateModel>,
  ) {}

  /**
   * Associates the default branding template id.
   * @param {string} resource - Resource name.
   * @param {Record<string, any>} object -
   * @param {string} attributeName
   * @returns
   */
  public assocDefaultBrandingTemplate =
    (resource: string) => async (object: Record<string, any>) => {
      const attributeName = 'pdfTemplateId';

      const defaultTemplate = await this.pdfTemplate()
        .query()
        .modify('default')
        .findOne({ resource });

      // If the default template is not found OR the given object has no defined template id.
      if (!defaultTemplate || !isNil(object[attributeName])) {
        return object;
      }
      return {
        ...object,
        [attributeName]: defaultTemplate.id,
      };
    };
}
