import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { SaleInvoicePdf } from '../queries/SaleInvoicePdf.service';
import { SendSaleInvoiceMailCommon } from './SendInvoiceInvoiceMailCommon.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { mergeAndValidateMailOptions } from '@/modules/MailNotification/utils';
import {
  SaleInvoiceMailOptions,
  SendInvoiceMailDTO,
  SendSaleInvoiceMailJobPayload,
} from '../SaleInvoice.types';
import { ISaleInvoiceMailSend } from '../SaleInvoice.types';
import { Mail } from '@/modules/Mail/Mail';
import { MailTransporter } from '@/modules/Mail/MailTransporter.service';
import { SendSaleInvoiceMailJob, SendSaleInvoiceQueue } from '../constants';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

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
    private readonly tenancyContect: TenancyContext,

    @InjectQueue(SendSaleInvoiceQueue) private readonly sendInvoiceQueue: Queue,
  ) { }

  /**
   * Sends the invoice mail of the given sale invoice.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {SendInvoiceMailDTO} messageDTO - Message DTO.
   */
  public async triggerMail(
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO,
  ) {
    const tenant = await this.tenancyContect.getTenant();
    const user = await this.tenancyContect.getSystemUser();

    const organizationId = tenant.organizationId;
    const userId = user.id;

    const payload = {
      saleInvoiceId,
      messageOptions,
      userId,
      organizationId,
    } as SendSaleInvoiceMailJobPayload;

    await this.sendInvoiceQueue.add(SendSaleInvoiceMailJob, payload);

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

    try {
      await this.mailTransporter.send(mail);
    } catch (error) {
      console.error('Failed to send invoice mail:', error);
      throw error;
    }

    // Triggers the event `onSaleInvoiceSend`.
    await this.eventEmitter.emitAsync(
      events.saleInvoice.onMailSent,
      eventPayload,
    );
  }
}
