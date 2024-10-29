import { Inject, Service } from 'typedi';
import Mail from '@/lib/Mail';
import {
  ISaleInvoiceMailSend,
  SaleInvoiceMailOptions,
  SendInvoiceMailDTO,
} from '@/interfaces';
import { SaleInvoicePdf } from './SaleInvoicePdf';
import { SendSaleInvoiceMailCommon } from './SendInvoiceInvoiceMailCommon';
import {
  DEFAULT_INVOICE_MAIL_CONTENT,
  DEFAULT_INVOICE_MAIL_SUBJECT,
} from './constants';
import {
  parseMailOptions,
  validateRequiredMailOptions,
} from '@/services/MailNotification/utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class SendSaleInvoiceMail {
  @Inject()
  private invoicePdf: SaleInvoicePdf;

  @Inject()
  private invoiceMail: SendSaleInvoiceMailCommon;

  @Inject('agenda')
  private agenda: any;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Sends the invoice mail of the given sale invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {SendInvoiceMailDTO} messageDTO
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
    await this.agenda.now('sale-invoice-mail-send', payload);

    // Triggers the event `onSaleInvoicePreMailSend`.
    await this.eventPublisher.emitAsync(events.saleInvoice.onPreMailSend, {
      tenantId,
      saleInvoiceId,
      messageOptions,
    } as ISaleInvoiceMailSend);
  }

  /**
   * Retrieves the mail options of the given sale invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @returns {Promise<SaleInvoiceMailOptions>}
   */
  public async getMailOption(
    tenantId: number,
    saleInvoiceId: number,
    defaultSubject: string = DEFAULT_INVOICE_MAIL_SUBJECT,
    defaultMessage: string = DEFAULT_INVOICE_MAIL_CONTENT
  ): Promise<SaleInvoiceMailOptions> {
    return this.invoiceMail.getInvoiceMailOptions(
      tenantId,
      saleInvoiceId,
      defaultSubject,
      defaultMessage
    );
  }

  /**
   * Triggers the mail invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {SendInvoiceMailDTO} messageDTO
   * @returns {Promise<void>}
   */
  public async sendMail(
    tenantId: number,
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO
  ) {
    const defaultMessageOptions = await this.getMailOption(
      tenantId,
      saleInvoiceId
    );
    // Merges message options with default options and parses the options values.
    const parsedMessageOptions = parseMailOptions(
      defaultMessageOptions,
      messageOptions
    );
    // Validates the required mail options.
    validateRequiredMailOptions(parsedMessageOptions);

    const formattedMessageOptions =
      await this.invoiceMail.formatInvoiceMailOptions(
        tenantId,
        saleInvoiceId,
        parsedMessageOptions
      );
    const mail = new Mail()
      .setSubject(formattedMessageOptions.subject)
      .setTo(formattedMessageOptions.to)
      .setContent(formattedMessageOptions.message);

    // Attach invoice document.
    if (formattedMessageOptions.attachInvoice) {
      // Retrieves document buffer of the invoice pdf document.
      const [invoicePdfBuffer, invoiceFilename] =
        await this.invoicePdf.saleInvoicePdf(tenantId, saleInvoiceId);

      mail.setAttachments([
        { filename: `${invoiceFilename}.pdf`, content: invoicePdfBuffer },
      ]);
    }

    const eventPayload = {
      tenantId,
      saleInvoiceId,
      messageOptions,
      formattedMessageOptions,
    } as ISaleInvoiceMailSend;

    // Triggers the event `onSaleInvoiceSend`.
    await this.eventPublisher.emitAsync(
      events.saleInvoice.onMailSend,
      eventPayload
    );
    await mail.send();

    // Triggers the event `onSaleInvoiceSend`.
    await this.eventPublisher.emitAsync(
      events.saleInvoice.onMailSent,
      eventPayload
    );
  }
}
