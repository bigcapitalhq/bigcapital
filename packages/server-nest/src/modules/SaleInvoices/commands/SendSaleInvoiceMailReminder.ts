import { Injectable } from '@nestjs/common';
import {
  DEFAULT_INVOICE_REMINDER_MAIL_CONTENT,
  DEFAULT_INVOICE_REMINDER_MAIL_SUBJECT,
} from '../constants';
import { SaleInvoicePdf } from '../queries/SaleInvoicePdf.service';
import { SendSaleInvoiceMailCommon } from './SendInvoiceInvoiceMailCommon.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ISaleInvoiceMailSend, ISaleInvoiceMailSent, SendInvoiceMailDTO } from '../SaleInvoice.types';
import { mergeAndValidateMailOptions } from '@/modules/MailNotification/utils';
import { MailTransporter } from '@/modules/Mail/MailTransporter.service';
import { Mail } from '@/modules/Mail/Mail';

@Injectable()
export class SendInvoiceMailReminder {
  constructor(
    private readonly invoicePdf: SaleInvoicePdf,
    private readonly invoiceCommonMail: SendSaleInvoiceMailCommon,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailTransporter: MailTransporter,
  ) {}

  /**
   * Triggers the reminder mail of the given sale invoice.
   * @param {number} saleInvoiceId
   */
  public async triggerMail(
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO,
  ) {
    const payload = {
      saleInvoiceId,
      messageOptions,
    };
    // await this.agenda.now('sale-invoice-reminder-mail-send', payload);
  }

  /**
   * Retrieves the mail options of the given sale invoice.
   * @param {number} saleInvoiceId - The sale invocie id.
   * @returns {Promise<SaleInvoiceMailOptions>}
   */
  public async getMailOption(saleInvoiceId: number) {
    return this.invoiceCommonMail.getMailOption(
      saleInvoiceId,
      DEFAULT_INVOICE_REMINDER_MAIL_SUBJECT,
      DEFAULT_INVOICE_REMINDER_MAIL_CONTENT,
    );
  }

  /**
   * Triggers the mail invoice.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {SendInvoiceMailDTO} messageOptions - The message options.
   * @returns {Promise<void>}
   */
  public async sendMail(
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO,
  ) {
    const localMessageOpts = await this.getMailOption(saleInvoiceId);

    const messageOpts = mergeAndValidateMailOptions(
      localMessageOpts,
      messageOptions,
    );
    const mail = new Mail()
      .setSubject(messageOpts.subject)
      .setTo(messageOpts.to)
      .setContent(messageOpts.body);

    if (messageOpts.attachInvoice) {
      // Retrieves document buffer of the invoice pdf document.
      const [invoicePdfBuffer, filename] = await this.invoicePdf.getSaleInvoicePdf(
        saleInvoiceId,
      );
      mail.setAttachments([
        { filename, content: invoicePdfBuffer },
      ]);
    }
    // Triggers the event `onSaleInvoiceSend`.
    await this.eventEmitter.emitAsync(events.saleInvoice.onMailReminderSend, {
      saleInvoiceId,
      messageOptions,
    } as ISaleInvoiceMailSend);

    await this.mailTransporter.send(mail);

    // Triggers the event `onSaleInvoiceSent`.
    await this.eventEmitter.emitAsync(events.saleInvoice.onMailReminderSent, {
      saleInvoiceId,
      messageOptions,
    } as ISaleInvoiceMailSent);
  }
}
