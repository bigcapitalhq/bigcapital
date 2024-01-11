import { Inject, Service } from 'typedi';
import { TemplateInjectable } from '@/services/TemplateInjectable/TemplateInjectable';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { GetSaleReceipt } from './GetSaleReceipt';

@Service()
export class SaleReceiptsPdf {
  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  @Inject()
  private getSaleReceiptService: GetSaleReceipt;

  /**
   * Retrieves sale invoice pdf content.
   * @param {number} tenantId - 
   * @param {number} saleInvoiceId -
   * @returns {Promise<Buffer>}
   */
  public async saleReceiptPdf(tenantId: number, saleReceiptId: number) {
    const saleReceipt = await this.getSaleReceiptService.getSaleReceipt(
      tenantId,
      saleReceiptId
    );
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/receipt-regular',
      {
        saleReceipt,
      }
    );
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent, {
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    });
  }
}
