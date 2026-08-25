import { Injectable } from '@nestjs/common';
import { defaultPaymentReceivedPdfTemplateAttributes } from '../constants';
import { GetPdfTemplateService } from '../../PdfTemplate/queries/GetPdfTemplate.service';
import { GetOrganizationBrandingAttributesService } from '../../PdfTemplate/queries/GetOrganizationBrandingAttributes.service';
import { mergePdfTemplateWithDefaultAttributes } from '../../SaleInvoices/utils';

@Injectable()
export class PaymentReceivedBrandingTemplate {
  constructor(
    private readonly getPdfTemplateService: GetPdfTemplateService,
    private readonly getOrgBrandingAttributes: GetOrganizationBrandingAttributesService,
  ) {}

  /**
   * Retrieves the payment received pdf template.
   * @param {number} paymentTemplateId
   * @returns
   */
  public async getPaymentReceivedPdfTemplate(paymentTemplateId?: number) {
    // Retrieves the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttributes.execute();

    // Merges the default branding attributes with common organization branding attrs.
    const organizationBrandingAttrs = {
      ...defaultPaymentReceivedPdfTemplateAttributes,
      ...commonOrgBrandingAttrs,
    };

    // The payment may have no assigned template and no default template set for
    // the resource, in which case we fall back to the default branding attributes.
    let template = null;
    if (paymentTemplateId != null) {
      try {
        template =
          await this.getPdfTemplateService.getPdfTemplate(paymentTemplateId);
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
