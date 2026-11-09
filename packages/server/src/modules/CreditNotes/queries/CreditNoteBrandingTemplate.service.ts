import { Injectable } from '@nestjs/common';
import { defaultCreditNoteBrandingAttributes } from '../constants';
import { GetPdfTemplateService } from '../../PdfTemplate/queries/GetPdfTemplate.service';
import { GetOrganizationBrandingAttributesService } from '../../PdfTemplate/queries/GetOrganizationBrandingAttributes.service';
import { mergePdfTemplateWithDefaultAttributes } from '../../SaleInvoices/utils';

@Injectable()
export class CreditNoteBrandingTemplate {
  constructor(
    private getPdfTemplateService: GetPdfTemplateService,
    private getOrgBrandingAttributes: GetOrganizationBrandingAttributesService,
  ) {}

  /**
   * Retrieves the credit note branding template.
   * @param {number} templateId
   * @returns {}
   */
  public async getCreditNoteBrandingTemplate(templateId?: number) {
    // Retrieves the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttributes.execute();

    // Merges the default branding attributes with common organization branding attrs.
    const organizationBrandingAttrs = {
      ...defaultCreditNoteBrandingAttributes,
      ...commonOrgBrandingAttrs,
    };

    // The credit note may have no assigned template and no default template set
    // for the resource, in which case we fall back to the default branding attributes.
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
