import { Injectable } from '@nestjs/common';
import { SaleInvoicePdf } from '../queries/SaleInvoicePdf.service';
import { SendSaleInvoiceMailCommon } from './SendInvoiceInvoiceMailCommon.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { mergeAndValidateMailOptions } from '@/modules/MailNotification/utils';
import { SaleInvoiceMailOptions, SendInvoiceMailDTO } from '../SaleInvoice.types';
import { ISaleInvoiceMailSend } from '../SaleInvoice.types';
import { Mail } from '@/modules/Mail/Mail';
import { MailTransporter } from '@/modules/Mail/MailTransporter.service';

@Injectable()
export class SendSaleInvoiceMail {
  /**
   * @param {SaleInvoicePdf} invoicePdf - Sale invoice pdf service.
   * @param {SendSaleInvoiceMailCommon} invoiceMail - Sale invoice mail service.
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {MailTransporter} mailTransporter - Mail transporter service.
   */
  constructor(
    private readonly invoicePdf: SaleInvoicePdf,
    private readonly invoiceMail: SendSaleInvoiceMailCommon,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailTransporter: MailTransporter,
  ) {}

  /**
   * Sends the invoice mail of the given sale invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {SendInvoiceMailDTO} messageDTO
   */
  public async triggerMail(
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO,
  ) {
    const payload = {
      saleInvoiceId,
      messageOptions,
    };
    // await this.agenda.now('sale-invoice-mail-send', payload);

    // Triggers the event `onSaleInvoicePreMailSend`.
    await this.eventEmitter.emitAsync(events.saleInvoice.onPreMailSend, {
      saleInvoiceId,
      messageOptions,
    } as ISaleInvoiceMailSend);
  }

  /**
   * Retrieves the formatted mail options.
   * @param {number} saleInvoiceId
   * @param {SendInvoiceMailDTO} messageOptions
   * @returns {Promise<SaleInvoiceMailOptions>}
   */
  async getFormattedMailOptions(
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO,
  ): Promise<SaleInvoiceMailOptions> {
    const defaultMessageOptions =
      await this.invoiceMail.getInvoiceMailOptions(saleInvoiceId);

    // Merges message options with default options and parses the options values.
    const parsedMessageOptions = mergeAndValidateMailOptions(
      defaultMessageOptions,
      messageOptions,
    );
    return this.invoiceMail.formatInvoiceMailOptions(
      saleInvoiceId,
      parsedMessageOptions,
    );
  }

  /**
   * Triggers the mail invoice.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {SendInvoiceMailDTO} messageDTO - Message options.
   * @returns {Promise<void>}
   */
  public async sendMail(
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO,
  ) {
    const formattedMessageOptions = await this.getFormattedMailOptions(
      saleInvoiceId,
      messageOptions,
    );
    const mail = new Mail()
      .setSubject(formattedMessageOptions.subject)
      .setTo(formattedMessageOptions.to)
      .setCC(formattedMessageOptions.cc)
      .setBCC(formattedMessageOptions.bcc)
      .setContent(formattedMessageOptions.message);

    // Attach invoice document.
    if (formattedMessageOptions.attachInvoice) {
      // Retrieves document buffer of the invoice pdf document.
      const [invoicePdfBuffer, invoiceFilename] =
        await this.invoicePdf.getSaleInvoicePdf(saleInvoiceId);

      mail.setAttachments([
        { filename: `${invoiceFilename}.pdf`, content: invoicePdfBuffer },
      ]);
    }
    const eventPayload = {
      saleInvoiceId,
      messageOptions,
      formattedMessageOptions,
    } as ISaleInvoiceMailSend;

    // Triggers the event `onSaleInvoiceSend`.
    await this.eventEmitter.emitAsync(
      events.saleInvoice.onMailSend,
      eventPayload,
    );
    await this.mailTransporter.send(mail);

    // Triggers the event `onSaleInvoiceSend`.
    await this.eventEmitter.emitAsync(
      events.saleInvoice.onMailSent,
      eventPayload,
    );
  }
}
