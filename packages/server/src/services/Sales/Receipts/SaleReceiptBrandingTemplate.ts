import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';
import { Inject, Service } from 'typedi';
import { defaultSaleReceiptBrandingAttributes } from './constants';
import { mergePdfTemplateWithDefaultAttributes } from '../Invoices/utils';

@Service()
export class SaleReceiptBrandingTemplate {
  @Inject()
  private getPdfTemplateService: GetPdfTemplate;


  /**
   * Retrieves the sale receipt branding template.
   * @param {number} tenantId - The ID of the tenant.
   * @param {number} templateId - The ID of the PDF template.
   * @returns {Promise<Object>} The sale receipt branding template with merged attributes.
   */
  public async getSaleReceiptBrandingTemplate(
    tenantId: number,
    templateId: number
  ) {
    const template = await this.getPdfTemplateService.getPdfTemplate(
      tenantId,
      templateId
    );
    const attributes = mergePdfTemplateWithDefaultAttributes(
      template.attributes,
      defaultSaleReceiptBrandingAttributes
    );
    return {
      ...template,
      attributes,
    };
  }
}
