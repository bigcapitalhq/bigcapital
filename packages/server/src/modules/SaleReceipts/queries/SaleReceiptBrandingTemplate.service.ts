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
  public async getSaleReceiptBrandingTemplate(templateId?: number) {
    // Retrieves the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttributes.execute();

    // Merges the default branding attributes with organization common branding attrs.
    const organizationBrandingAttrs = {
      ...defaultSaleReceiptBrandingAttributes,
      ...commonOrgBrandingAttrs,
    };

    // The receipt may have no assigned template and no default template set for
    // the resource, in which case we fall back to the default branding attributes.
    let template = null;
    if (templateId != null) {
      try {
        template = await this.getPdfTemplateService.getPdfTemplate(templateId);
      } catch {
        template = null;
      }
    }
    if (!template) {
      return { attributes: organizationBrandingAttrs };
    }

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
