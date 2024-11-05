import { Inject, Service } from 'typedi';
import { mergePdfTemplateWithDefaultAttributes } from './utils';
import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';
import { defaultEstimatePdfBrandingAttributes } from '../Estimates/constants';
import { GetOrganizationBrandingAttributes } from '@/services/PdfTemplate/GetOrganizationBrandingAttributes';

@Service()
export class SaleEstimatePdfTemplate {
  @Inject()
  private getPdfTemplateService: GetPdfTemplate;

  @Inject()
  private getOrgBrandingAttrs: GetOrganizationBrandingAttributes;

  /**
   * Retrieves the estimate pdf template.
   * @param {number} tenantId
   * @param {number} invoiceTemplateId
   * @returns
   */
  async getEstimatePdfTemplate(tenantId: number, estimateTemplateId: number) {
    const template = await this.getPdfTemplateService.getPdfTemplate(
      tenantId,
      estimateTemplateId
    );
    // Retreives the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttrs.getOrganizationBrandingAttributes(
        tenantId
      );
    // Merge the default branding attributes with organization attrs.
    const orgainizationBrandingAttrs = {
      ...defaultEstimatePdfBrandingAttributes,
      ...commonOrgBrandingAttrs,
    };
    const brandingTemplateAttrs = {
      ...template.attributes,
      companyLogoUri: template.companyLogoUri,
    };
    const attributes = mergePdfTemplateWithDefaultAttributes(
      brandingTemplateAttrs,
      orgainizationBrandingAttrs
    );
    return {
      ...template,
      attributes,
    };
  }
}
