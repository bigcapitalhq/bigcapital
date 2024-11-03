import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';
import { Inject, Service } from 'typedi';
import { mergePdfTemplateWithDefaultAttributes } from '../Invoices/utils';
import { defaultPaymentReceivedPdfTemplateAttributes } from './constants';
import { PdfTemplate } from '@/models/PdfTemplate';
import { GetOrganizationBrandingAttributes } from '@/services/PdfTemplate/GetOrganizationBrandingAttributes';

@Service()
export class PaymentReceivedBrandingTemplate {
  @Inject()
  private getPdfTemplateService: GetPdfTemplate;

  @Inject()
  private getOrgBrandingAttributes: GetOrganizationBrandingAttributes;

  /**
   * Retrieves the payment received pdf template.
   * @param {number} tenantId
   * @param {number} paymentTemplateId
   * @returns
   */
  public async getPaymentReceivedPdfTemplate(
    tenantId: number,
    paymentTemplateId: number
  ) {
    const template = await this.getPdfTemplateService.getPdfTemplate(
      tenantId,
      paymentTemplateId
    );
    // Retrieves the organization branding attributes.
    const commonOrgBrandingAttrs =
      await this.getOrgBrandingAttributes.getOrganizationBrandingAttributes(
        tenantId
      );
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
