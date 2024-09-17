import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';
import { Inject, Service } from 'typedi';
import { mergePdfTemplateWithDefaultAttributes } from '../Invoices/utils';
import { defaultPaymentReceivedPdfTemplateAttributes } from './constants';
import { PdfTemplate } from '@/models/PdfTemplate';

@Service()
export class PaymentReceivedBrandingTemplate {
  @Inject()
  private getPdfTemplateService: GetPdfTemplate;

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
    const attributes = mergePdfTemplateWithDefaultAttributes(
      template.attributes,
      defaultPaymentReceivedPdfTemplateAttributes
    );
    return {
      ...template,
      attributes,
    };
  }
}
