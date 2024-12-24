import { Injectable } from '@nestjs/common';
import { defaultSaleReceiptBrandingAttributes } from '../constants';
import { GetPdfTemplateService } from '@/modules/PdfTemplate/queries/GetPdfTemplate.service';
import { GetOrganizationBrandingAttributesService } from '@/modules/PdfTemplate/queries/GetOrganizationBrandingAttributes.service';
import { mergePdfTemplateWithDefaultAttributes } from '@/modules/SaleInvoices/utils';

@Injectable()
export class SaleReceiptBrandingTemplate {
  /**
   * @param {GetPdfTemplate} getPdfTemplateService -
   * @param {GetOrganizationBrandingAttributes} getOrgBrandingAttributes -
   */
  constructor(
    private readonly getPdfTemplateService: GetPdfTemplateService,
    private readonly getOrgBrandingAttributes: GetOrganizationBrandingAttributesService,
  ) {}

  /**
   * Retrieves the sale receipt branding template.
   * @param {number} templateId - The ID of the PDF template.
   * @returns {Promise<Object>} The sale receipt branding template with merged attributes.
   */
  public async getSaleReceiptBrandingTemplate(templateId: number) {
    const template =
      await this.getPdfTemplateService.getPdfTemplate(templateId);
    // Retrieves the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttributes.getOrganizationBrandingAttributes();

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
      organizationBrandingAttrs,
    );
    return {
      ...template,
      attributes,
    };
  }
}
