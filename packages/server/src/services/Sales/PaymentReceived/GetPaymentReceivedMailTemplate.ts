import { Inject, Service } from 'typedi';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { GetPdfTemplate } from '@/services/PdfTemplate/GetPdfTemplate';
import { GetPaymentReceived } from './GetPaymentReceived';
import { GetPaymentReceivedMailTemplateAttrsTransformer } from './GetPaymentReceivedMailTemplateAttrsTransformer';
import {
  PaymentReceivedEmailTemplateProps,
  renderPaymentReceivedEmailTemplate,
} from '@bigcapital/email-components';

@Service()
export class GetPaymentReceivedMailTemplate {
  @Inject()
  private getPaymentReceivedService: GetPaymentReceived;

  @Inject()
  private getBrandingTemplate: GetPdfTemplate;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the mail template attributes of the given payment received.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceivedId - Payment received id.
   * @returns {Promise<PaymentReceivedEmailTemplateProps>}
   */
  public async getMailTemplateAttributes(
    tenantId: number,
    paymentReceivedId: number
  ): Promise<PaymentReceivedEmailTemplateProps> {
    const paymentReceived =
      await this.getPaymentReceivedService.getPaymentReceive(
        tenantId,
        paymentReceivedId
      );
    const brandingTemplate = await this.getBrandingTemplate.getPdfTemplate(
      tenantId,
      paymentReceived.pdfTemplateId
    );
    const mailTemplateAttributes = await this.transformer.transform(
      tenantId,
      paymentReceived,
      new GetPaymentReceivedMailTemplateAttrsTransformer(),
      {
        paymentReceived,
        brandingTemplate,
      }
    );
    return mailTemplateAttributes;
  }

  /**
   * Retrieves the mail template html content.
   * @param {number} tenantId
   * @param {number} paymentReceivedId
   * @param {Partial<PaymentReceivedEmailTemplateProps>} overrideAttributes
   * @returns
   */
  public async getMailTemplate(
    tenantId: number,
    paymentReceivedId: number,
    overrideAttributes?: Partial<PaymentReceivedEmailTemplateProps>
  ): Promise<string> {
    const mailTemplateAttributes = await this.getMailTemplateAttributes(
      tenantId,
      paymentReceivedId
    );
    const mergedAttributes = {
      ...mailTemplateAttributes,
      ...overrideAttributes,
    };
    return renderPaymentReceivedEmailTemplate(mergedAttributes);
  }
}
