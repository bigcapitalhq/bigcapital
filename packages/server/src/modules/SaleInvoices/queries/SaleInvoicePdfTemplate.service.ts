import { mergePdfTemplateWithDefaultAttributes } from '../utils';
import { defaultInvoicePdfTemplateAttributes } from '../constants';
import { GetOrganizationBrandingAttributesService } from '@/modules/PdfTemplate/queries/GetOrganizationBrandingAttributes.service';
import { GetPdfTemplateService } from '@/modules/PdfTemplate/queries/GetPdfTemplate.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaleInvoicePdfTemplate {
  constructor(
    private readonly getPdfTemplateService: GetPdfTemplateService,
    private readonly getOrgBrandingAttributes: GetOrganizationBrandingAttributesService,
  ) {}

  /**
   * Retrieves the invoice pdf template.
   * @param {number} invoiceTemplateId
   * @returns
   */
  async getInvoicePdfTemplate(invoiceTemplateId: number) {
    const template =
      await this.getPdfTemplateService.getPdfTemplate(invoiceTemplateId);
    // Retrieves the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttributes.getOrganizationBrandingAttributes();

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
      organizationBrandingAttrs,
    );
    return {
      ...template,
      attributes,
    };
  }
}
