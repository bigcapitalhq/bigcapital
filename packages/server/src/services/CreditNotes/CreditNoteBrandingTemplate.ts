import { Inject } from 'typedi';
import { GetPdfTemplate } from '../PdfTemplate/GetPdfTemplate';
import { defaultCreditNoteBrandingAttributes } from './constants';
import { mergePdfTemplateWithDefaultAttributes } from '../Sales/Invoices/utils';
import { GetOrganizationBrandingAttributes } from '../PdfTemplate/GetOrganizationBrandingAttributes';

export class CreditNoteBrandingTemplate {
  @Inject()
  private getPdfTemplateService: GetPdfTemplate;

  @Inject()
  private getOrgBrandingAttributes: GetOrganizationBrandingAttributes;

  /**
   * Retrieves the credit note branding template.
   * @param {number} tenantId
   * @param {number} templateId
   * @returns {}
   */
  public async getCreditNoteBrandingTemplate(
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
    // Merges the default branding attributes with common organization branding attrs.
    const organizationBrandingAttrs = {
      ...defaultCreditNoteBrandingAttributes,
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
