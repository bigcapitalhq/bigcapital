import { Injectable } from '@nestjs/common';
import { mergePdfTemplateWithDefaultAttributes } from '../utils';
import { GetPdfTemplateService } from '@/modules/PdfTemplate/queries/GetPdfTemplate.service';
import { GetOrganizationBrandingAttributesService } from '@/modules/PdfTemplate/queries/GetOrganizationBrandingAttributes.service';
import { defaultEstimatePdfBrandingAttributes } from '@/modules/SaleEstimates/constants';

@Injectable()
export class SaleEstimatePdfTemplate {
  constructor(
    private readonly getPdfTemplateService: GetPdfTemplateService,
    private readonly getOrgBrandingAttrs: GetOrganizationBrandingAttributesService,
  ) {}

  /**
   * Retrieves the estimate pdf template.
   * @param {number} invoiceTemplateId
   * @returns
   */
  public async getEstimatePdfTemplate(estimateTemplateId: number) {
    const template =
      await this.getPdfTemplateService.getPdfTemplate(estimateTemplateId);
    // Retreives the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttrs.getOrganizationBrandingAttributes();

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
      orgainizationBrandingAttrs,
    );
    return {
      ...template,
      attributes,
    };
  }
}
