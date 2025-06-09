import {
  PaymentReceivedEmailTemplateProps,
  renderPaymentReceivedEmailTemplate,
} from '@bigcapital/email-components';
import { Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { GetPdfTemplateService } from '@/modules/PdfTemplate/queries/GetPdfTemplate.service';
import { GetPaymentReceivedService } from './GetPaymentReceived.service';
import { GetPaymentReceivedMailTemplateAttrsTransformer } from './GetPaymentReceivedMailTemplateAttrs.transformer';

@Injectable()
export class GetPaymentReceivedMailTemplate {
  constructor(
    private readonly getPaymentReceivedService: GetPaymentReceivedService,
    private readonly getBrandingTemplate: GetPdfTemplateService,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieves the mail template attributes of the given payment received.
   * @param {number} paymentReceivedId - Payment received id.
   * @returns {Promise<PaymentReceivedEmailTemplateProps>}
   */
  public async getMailTemplateAttributes(
    paymentReceivedId: number,
  ): Promise<PaymentReceivedEmailTemplateProps> {
    const paymentReceived =
      await this.getPaymentReceivedService.getPaymentReceive(paymentReceivedId);
    const brandingTemplate = await this.getBrandingTemplate.getPdfTemplate(
      paymentReceived.pdfTemplateId,
    );
    const mailTemplateAttributes = await this.transformer.transform(
      paymentReceived,
      new GetPaymentReceivedMailTemplateAttrsTransformer(),
      {
        paymentReceived,
        brandingTemplate,
      },
    );
    return mailTemplateAttributes;
  }

  /**
   * Retrieves the mail template html content.
   * @param {number} paymentReceivedId 
   * @param {Partial<PaymentReceivedEmailTemplateProps>} overrideAttributes
   * @returns
   */
  public async getMailTemplate(
    paymentReceivedId: number,
    overrideAttributes?: Partial<PaymentReceivedEmailTemplateProps>,
  ): Promise<string> {
    const mailTemplateAttributes =
      await this.getMailTemplateAttributes(paymentReceivedId);
    const mergedAttributes = {
      ...mailTemplateAttributes,
      ...overrideAttributes,
    };
    return renderPaymentReceivedEmailTemplate(mergedAttributes);
  }
}
