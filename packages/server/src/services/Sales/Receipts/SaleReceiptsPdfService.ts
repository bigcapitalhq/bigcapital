import { Inject, Service } from 'typedi';
import { TemplateInjectable } from '@/services/TemplateInjectable/TemplateInjectable';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';

@Service()
export class SaleReceiptsPdf {
  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  /**
   * Retrieve sale invoice pdf content.
   * @param {} saleInvoice -
   */
  public async saleReceiptPdf(tenantId: number, saleReceipt) {
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
