import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '@/services/TemplateInjectable/TemplateInjectable';
import { GetPaymentReceived } from './GetPaymentReceived';

@Service()
export default class GetPaymentReceivedPdf {
  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  @Inject()
  private getPaymentService: GetPaymentReceived;

  /**
   * Retrieve sale invoice pdf content.
   * @param {number} tenantId -
   * @param {IPaymentReceived} paymentReceive -
   * @returns {Promise<Buffer>}
   */
  async getPaymentReceivePdf(
    tenantId: number,
    paymentReceiveId: number
  ): Promise<Buffer> {
    const paymentReceive = await this.getPaymentService.getPaymentReceive(
      tenantId,
      paymentReceiveId
    );
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
