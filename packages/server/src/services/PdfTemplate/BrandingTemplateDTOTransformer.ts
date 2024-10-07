import { Inject, Service } from 'typedi';
import { isNil } from 'lodash';
import HasTenancyService from '../Tenancy/TenancyService';

@Service()
export class BrandingTemplateDTOTransformer {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Associates the default branding template id.
   * @param {number} tenantId
   * @param {string} resource
   * @param {Record<string, any>} object
   * @param {string} attributeName
   * @returns
   */
  public assocDefaultBrandingTemplate =
    (tenantId: number, resource: string) =>
    async (object: Record<string, any>) => {
      const { PdfTemplate } = this.tenancy.models(tenantId);
      const attributeName = 'pdfTemplateId';

      const defaultTemplate = await PdfTemplate.query()
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
