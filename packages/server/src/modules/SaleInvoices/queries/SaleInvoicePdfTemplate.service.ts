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
  async getInvoicePdfTemplate(invoiceTemplateId?: number) {
    // Retrieves the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttributes.execute();

    const organizationBrandingAttrs = {
      ...defaultInvoicePdfTemplateAttributes,
      ...commonOrgBrandingAttrs,
    };

    // The invoice may have no assigned template and no default template set for
    // the resource, in which case we fall back to the default branding attributes.
    let template = null;
    if (invoiceTemplateId != null) {
      try {
        template =
          await this.getPdfTemplateService.getPdfTemplate(invoiceTemplateId);
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
