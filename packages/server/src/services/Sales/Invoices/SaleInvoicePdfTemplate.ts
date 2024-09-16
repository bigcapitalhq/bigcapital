import { Inject, Service } from 'typedi';
import { mergePdfTemplateWithDefaultAttributes } from './utils';
import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';
import { defaultInvoicePdfTemplateAttributes } from './constants';

@Service()
export class SaleInvoicePdfTemplate {
  @Inject()
  private getPdfTemplateService: GetPdfTemplate;

  /**
   * Retrieves the invoice pdf template.
   * @param {number} tenantId 
   * @param {number} invoiceTemplateId 
   * @returns 
   */
  async getInvoicePdfTemplate(tenantId: number, invoiceTemplateId: number){
    const template = await this.getPdfTemplateService.getPdfTemplate(
      tenantId,
      invoiceTemplateId
    );
    const attributes = mergePdfTemplateWithDefaultAttributes(
      template.attributes,
      defaultInvoicePdfTemplateAttributes
    );
    return {
      ...template,
      attributes,
    };
  }
}
