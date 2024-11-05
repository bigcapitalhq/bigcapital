import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';
import { Inject, Service } from 'typedi';
import { defaultSaleReceiptBrandingAttributes } from './constants';
import { mergePdfTemplateWithDefaultAttributes } from '../Invoices/utils';
import { GetOrganizationBrandingAttributes } from '@/services/PdfTemplate/GetOrganizationBrandingAttributes';

@Service()
export class SaleReceiptBrandingTemplate {
  @Inject()
  private getPdfTemplateService: GetPdfTemplate;

  @Inject()
  private getOrgBrandingAttributes: GetOrganizationBrandingAttributes;

  /**
   * Retrieves the sale receipt branding template.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} templateId - The ID of the PDF template.
   * @returns {Promise<Object>} The sale receipt branding template with merged attributes.
   */
  public async getSaleReceiptBrandingTemplate(
    tenantId: number,
    templateId: number
  ) {
    const template = await this.getPdfTemplateService.getPdfTemplate(
      tenantId,
      templateId
    );
    // Retrieves the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttributes.getOrganizationBrandingAttributes(
        tenantId
      );

    // Merges the default branding attributes with organization common branding attrs.
    const organizationBrandingAttrs = {
      ...defaultSaleReceiptBrandingAttributes,
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
