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
  public async getCreditNoteBrandingTemplate(templateId: number) {
    const template =
      await this.getPdfTemplateService.getPdfTemplate(templateId);

    // Retrieves the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttributes.execute();

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
      organizationBrandingAttrs,
    );
    return {
      ...template,
      attributes,
    };
  }
}
