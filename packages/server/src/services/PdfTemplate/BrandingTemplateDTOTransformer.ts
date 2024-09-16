import * as R from 'ramda';
import HasTenancyService from '../Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

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
  public assocDefaultBrandingTemplate =  (
    tenantId: number,
    resource: string,
  ) => async (object: Record<string, any>) => {
    const { PdfTemplate } = this.tenancy.models(tenantId);
    const attributeName = 'pdfTemplateId';

    const defaultTemplate = await PdfTemplate.query().findOne({
      resource,
      default: true,
    });
    console.log(defaultTemplate);

    if (!defaultTemplate) {
      return object;
    }
    return {
      ...object,
      [attributeName]: defaultTemplate.id,
    };
  },
}
