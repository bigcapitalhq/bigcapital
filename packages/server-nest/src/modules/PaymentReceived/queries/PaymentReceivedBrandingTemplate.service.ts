import { Inject, Injectable } from '@nestjs/common';
import { defaultPaymentReceivedPdfTemplateAttributes } from '../constants';
import { GetPdfTemplateService } from '../../PdfTemplate/queries/GetPdfTemplate.service';
import { GetOrganizationBrandingAttributesService } from '../../PdfTemplate/queries/GetOrganizationBrandingAttributes.service';
import { PdfTemplateModel } from '../../PdfTemplate/models/PdfTemplate';
import { mergePdfTemplateWithDefaultAttributes } from '../../SaleInvoices/utils';

@Injectable()
export class PaymentReceivedBrandingTemplate {
  constructor(
    private readonly getPdfTemplateService: GetPdfTemplateService,
    private readonly getOrgBrandingAttributes: GetOrganizationBrandingAttributesService,

    @Inject(PdfTemplateModel.name)
    private readonly pdfTemplateModel: typeof PdfTemplateModel,
  ) {}

  /**
   * Retrieves the payment received pdf template.
   * @param {number} paymentTemplateId
   * @returns 
   */
  public async getPaymentReceivedPdfTemplate(paymentTemplateId: number) {
    const template = await this.getPdfTemplateService.getPdfTemplate(
      paymentTemplateId
    );
    // Retrieves the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttributes.getOrganizationBrandingAttributes();

    // Merges the default branding attributes with common organization branding attrs.
    const organizationBrandingAttrs = {
      ...defaultPaymentReceivedPdfTemplateAttributes,
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
