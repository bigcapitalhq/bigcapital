import { Inject, Service } from 'typedi';
import { mergePdfTemplateWithDefaultAttributes } from './utils';
import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';
import { defaultEstimatePdfBrandingAttributes } from '../Estimates/constants';

@Service()
export class SaleEstimatePdfTemplate {
  @Inject()
  private getPdfTemplateService: GetPdfTemplate;

  /**
   * Retrieves the estimate pdf template.
   * @param {number} tenantId
   * @param {number} invoiceTemplateId
   * @returns
   */
  async getEstimatePdfTemplate(tenantId: number, estimateTemplateId: number) {
    const template = await this.getPdfTemplateService.getPdfTemplate(
      tenantId,
      estimateTemplateId
    );
    const attributes = mergePdfTemplateWithDefaultAttributes(
      template.attributes,
      defaultEstimatePdfBrandingAttributes
    );
    return {
      ...template,
      attributes,
    };
  }
}
