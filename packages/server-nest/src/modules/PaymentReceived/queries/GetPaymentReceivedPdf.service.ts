import { Inject, Injectable } from '@nestjs/common';
import { GetPaymentReceivedService } from './GetPaymentReceived.service';
import { PaymentReceivedBrandingTemplate } from './PaymentReceivedBrandingTemplate.service';
import { transformPaymentReceivedToPdfTemplate } from '../utils';

import { PaymentReceived } from '../models/PaymentReceived';
import { PdfTemplateModel } from '@/modules/PdfTemplate/models/PdfTemplate';
import { ChromiumlyTenancy } from '@/modules/ChromiumlyTenancy/ChromiumlyTenancy.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TemplateInjectable } from '@/modules/TemplateInjectable/TemplateInjectable.service';
import { PaymentReceivedPdfTemplateAttributes } from '../types/PaymentReceived.types';
import { events } from '@/common/events/events';

@Injectable()
export default class GetPaymentReceivedPdf {
  constructor(
    private chromiumlyTenancy: ChromiumlyTenancy,
    private templateInjectable: TemplateInjectable,
    private getPaymentService: GetPaymentReceivedService,
    private paymentBrandingTemplateService: PaymentReceivedBrandingTemplate,
    private eventPublisher: EventEmitter2,

    @Inject(PaymentReceived.name)
    private paymentReceiveModel: typeof PaymentReceived,

    @Inject(PdfTemplateModel.name)
    private pdfTemplateModel: typeof PdfTemplateModel,
  ) {}

  /**
   * Retrieve sale invoice pdf content.
   * @param {number} tenantId -
   * @param {IPaymentReceived} paymentReceive -
   * @returns {Promise<Buffer>}
   */
  async getPaymentReceivePdf(
    paymentReceivedId: number,
  ): Promise<[Buffer, string]> {
    const brandingAttributes =
      await this.getPaymentBrandingAttributes(paymentReceivedId);

    const htmlContent = await this.templateInjectable.render(
      'modules/payment-receive-standard',
      brandingAttributes,
    );
    const filename = await this.getPaymentReceivedFilename(paymentReceivedId);
    // Converts the given html content to pdf document.
    const content =
      await this.chromiumlyTenancy.convertHtmlContent(htmlContent);
    const eventPayload = { paymentReceivedId };

    // Triggers the `onCreditNotePdfViewed` event.
    await this.eventPublisher.emitAsync(
      events.paymentReceive.onPdfViewed,
      eventPayload,
    );
    return [content, filename];
  }

  /**
   * Retrieves the filename of the given payment.
   * @param {number} tenantId
   * @param {number} paymentReceivedId
   * @returns {Promise<string>}
   */
  private async getPaymentReceivedFilename(
    paymentReceivedId: number,
  ): Promise<string> {
    const payment = await this.paymentReceiveModel
      .query()
      .findById(paymentReceivedId);

    return `Payment-${payment.paymentReceiveNo}`;
  }

  /**
   * Retrieves the given payment received branding attributes.
   * @param {number} paymentReceivedId - Payment received identifier.
   * @returns {Promise<PaymentReceivedPdfTemplateAttributes>}
   */
  async getPaymentBrandingAttributes(
    paymentReceivedId: number,
  ): Promise<PaymentReceivedPdfTemplateAttributes> {
    const paymentReceived =
      await this.getPaymentService.getPaymentReceive(paymentReceivedId);

    const templateId =
      paymentReceived?.pdfTemplateId ??
      (
        await this.pdfTemplateModel.query().findOne({
          resource: 'PaymentReceive',
          default: true,
        })
      )?.id;

    const brandingTemplate =
      await this.paymentBrandingTemplateService.getPaymentReceivedPdfTemplate(
        templateId,
      );

    return {
      ...brandingTemplate.attributes,
      ...transformPaymentReceivedToPdfTemplate(paymentReceived),
    };
  }
}
