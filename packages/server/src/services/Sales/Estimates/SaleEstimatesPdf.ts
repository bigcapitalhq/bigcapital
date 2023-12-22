import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '@/services/TemplateInjectable/TemplateInjectable';
import { GetSaleEstimate } from './GetSaleEstimate';

@Service()
export class SaleEstimatesPdf {
  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  @Inject()
  private getSaleEstimate: GetSaleEstimate;

  /**
   * Retrieve sale invoice pdf content.
   * @param {number} tenantId -
   * @param {ISaleInvoice} saleInvoice -
   */
  public async getSaleEstimatePdf(tenantId: number, saleEstimateId: number) {
    const saleEstimate = await this.getSaleEstimate.getEstimate(
      tenantId,
      saleEstimateId
    );
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/estimate-regular',
      {
        saleEstimate,
      }
    );
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent, {
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    });
  }
}
