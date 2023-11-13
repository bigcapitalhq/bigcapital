import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '@/services/TemplateInjectable/TemplateInjectable';
import { ISaleInvoice } from '@/interfaces';

@Service()
export class SaleInvoicePdf {
  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  /**
   * Retrieve sale invoice pdf content.
   * @param {number} tenantId - Tenant Id.
   * @param {ISaleInvoice} saleInvoice -
   * @returns {Promise<Buffer>}
   */
  async saleInvoicePdf(
    tenantId: number,
    saleInvoice: ISaleInvoice
  ): Promise<Buffer> {
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/invoice-regular',
      {
        saleInvoice,
      }
    );
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent, {
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    });
  }
}
