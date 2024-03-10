import { Inject, Service } from 'typedi';
import {
  ISaleInvoiceMailSend,
  ISaleInvoiceMailSent,
  SendInvoiceMailDTO,
} from '@/interfaces';
import Mail from '@/lib/Mail';
import { SaleInvoicePdf } from './SaleInvoicePdf';
import { SendSaleInvoiceMailCommon } from './SendInvoiceInvoiceMailCommon';
import {
  DEFAULT_INVOICE_REMINDER_MAIL_CONTENT,
  DEFAULT_INVOICE_REMINDER_MAIL_SUBJECT,
} from './constants';
import { parseAndValidateMailOptions } from '@/services/MailNotification/utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class SendInvoiceMailReminder {
  @Inject('agenda')
  private agenda: any;

  @Inject()
  private invoicePdf: SaleInvoicePdf;

  @Inject()
  private invoiceCommonMail: SendSaleInvoiceMailCommon;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Triggers the reminder mail of the given sale invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   */
  public async triggerMail(
    tenantId: number,
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO
  ) {
    const payload = {
      tenantId,
      saleInvoiceId,
      messageOptions,
    };
    await this.agenda.now('sale-invoice-reminder-mail-send', payload);
  }

  /**
   * Retrieves the mail options of the given sale invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @returns {Promise<SaleInvoiceMailOptions>}
   */
  public async getMailOption(tenantId: number, saleInvoiceId: number) {
    return this.invoiceCommonMail.getMailOption(
      tenantId,
      saleInvoiceId,
      DEFAULT_INVOICE_REMINDER_MAIL_SUBJECT,
      DEFAULT_INVOICE_REMINDER_MAIL_CONTENT
    );
  }

  /**
   * Triggers the mail invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {SendInvoiceMailDTO} messageOptions
   * @returns {Promise<void>}
   */
  public async sendMail(
    tenantId: number,
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO
  ) {
    const localMessageOpts = await this.getMailOption(tenantId, saleInvoiceId);

    const messageOpts = parseAndValidateMailOptions(
      localMessageOpts,
      messageOptions
    );
    const mail = new Mail()
      .setSubject(messageOpts.subject)
      .setTo(messageOpts.to)
      .setContent(messageOpts.body);

    if (messageOpts.attachInvoice) {
      // Retrieves document buffer of the invoice pdf document.
      const invoicePdfBuffer = await this.invoicePdf.saleInvoicePdf(
        tenantId,
        saleInvoiceId
      );
      mail.setAttachments([
        { filename: 'invoice.pdf', content: invoicePdfBuffer },
      ]);
    }
    // Triggers the event `onSaleInvoiceSend`.
    await this.eventPublisher.emitAsync(events.saleInvoice.onMailReminderSend, {
      saleInvoiceId,
      messageOptions,
    } as ISaleInvoiceMailSend);

    await mail.send();

    // Triggers the event `onSaleInvoiceSent`.
    await this.eventPublisher.emitAsync(events.saleInvoice.onMailReminderSent, {
      saleInvoiceId,
      messageOptions,
    } as ISaleInvoiceMailSent);
  }
}
