import { Inject, Service } from 'typedi';
import { ChromiumlyTenancy } from '@/services/ChromiumlyTenancy/ChromiumlyTenancy';
import { TemplateInjectable } from '@/services/TemplateInjectable/TemplateInjectable';
import { GetPaymentReceived } from './GetPaymentReceived';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { PaymentReceivedBrandingTemplate } from './PaymentReceivedBrandingTemplate';
import { transformPaymentReceivedToPdfTemplate } from './utils';
import { PaymentReceivedPdfTemplateAttributes } from '@/interfaces';

@Service()
export default class GetPaymentReceivedPdf {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private chromiumlyTenancy: ChromiumlyTenancy;

  @Inject()
  private templateInjectable: TemplateInjectable;

  @Inject()
  private getPaymentService: GetPaymentReceived;

  @Inject()
  private paymentBrandingTemplateService: PaymentReceivedBrandingTemplate;

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
    const brandingAttributes = await this.getPaymentBrandingAttributes(
      tenantId,
      paymentReceiveId
    );
    const htmlContent = await this.templateInjectable.render(
      tenantId,
      'modules/payment-receive-standard',
      brandingAttributes
    );
    // Converts the given html content to pdf document.
    return this.chromiumlyTenancy.convertHtmlContent(tenantId, htmlContent);
  }

  /**
   * Retrieves the given payment received branding attributes.
   * @param {number} tenantId
   * @param {number} paymentReceivedId
   * @returns {Promise<PaymentReceivedPdfTemplateAttributes>}
   */
  async getPaymentBrandingAttributes(
    tenantId: number,
    paymentReceivedId: number
  ): Promise<PaymentReceivedPdfTemplateAttributes> {
    const { PdfTemplate } = this.tenancy.models(tenantId);

    const paymentReceived = await this.getPaymentService.getPaymentReceive(
      tenantId,
      paymentReceivedId
    );
    const templateId =
      paymentReceived?.pdfTemplateId ??
      (
        await PdfTemplate.query().findOne({
          resource: 'PaymentReceive',
          default: true,
        })
      )?.id;

    const brandingTemplate =
      await this.paymentBrandingTemplateService.getPaymentReceivedPdfTemplate(
        tenantId,
        templateId
      );
    return {
      ...brandingTemplate.attributes,
      ...transformPaymentReceivedToPdfTemplate(paymentReceived),
    };
  }
}
