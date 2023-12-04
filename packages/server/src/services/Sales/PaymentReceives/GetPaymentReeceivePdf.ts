import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '@/services/TemplateInjectable/TemplateInjectable';
import { IPaymentReceive } from '@/interfaces';

@Service()
export default class GetPaymentReceivePdf {
  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  /**
   * Retrieve sale invoice pdf content.
   * @param {number} tenantId -
   * @param {IPaymentReceive} paymentReceive -
   * @returns {Promise<Buffer>}
   */
  async getPaymentReceivePdf(
    tenantId: number,
    paymentReceive: IPaymentReceive
  ): Promise<Buffer> {
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/payment-receive-standard',
      {
        paymentReceive,
      }
    );
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent, {
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    });
  }
}
