import { Inject, Service } from 'typedi';
import { mergePdfTemplateWithDefaultAttributes } from './utils';
import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';
import { defaultInvoicePdfTemplateAttributes } from './constants';
import { GetOrganizationBrandingAttributes } from '@/services/PdfTemplate/GetOrganizationBrandingAttributes';

@Service()
export class SaleInvoicePdfTemplate {
  @Inject()
  private getPdfTemplateService: GetPdfTemplate;

  @Inject()
  private getOrgBrandingAttributes: GetOrganizationBrandingAttributes;

  /**
   * Retrieves the invoice pdf template.
   * @param {number} tenantId
   * @param {number} invoiceTemplateId
   * @returns
   */
  async getInvoicePdfTemplate(tenantId: number, invoiceTemplateId: number) {
    const template = await this.getPdfTemplateService.getPdfTemplate(
      tenantId,
      invoiceTemplateId
    );
    // Retrieves the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttributes.getOrganizationBrandingAttributes(
        tenantId
      );
    const organizationBrandingAttrs = {
      ...defaultInvoicePdfTemplateAttributes,
      ...commonOrgBrandingAttrs,
    };
    const brandingTemplateAttrs = {
      ...template.attributes,
      companyLogoUri: template.companyLogoUri,
    };
    const attributes = mergePdfTemplateWithDefaultAttributes(
      brandingTemplateAttrs,
      organizationBrandingAttrs
    );
    return {
      ...template,
      attributes,
    };
  }
}
