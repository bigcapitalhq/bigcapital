import { Inject, Service } from 'typedi';
import Mail from '@/lib/Mail';
import {
  ISaleInvoiceMailSend,
  SaleInvoiceMailOptions,
  SendInvoiceMailDTO,
} from '@/interfaces';
import { SaleInvoicePdf } from './SaleInvoicePdf';
import { SendSaleInvoiceMailCommon } from './SendInvoiceInvoiceMailCommon';
import { mergeAndValidateMailOptions } from '@/services/MailNotification/utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class SendSaleInvoiceMail {
  @Inject()
  private invoicePdf: SaleInvoicePdf;

  @Inject()
  private invoiceMail: SendSaleInvoiceMailCommon;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject('agenda')
  private agenda: any;

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
   * Retrieves the formatted mail options.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {SendInvoiceMailDTO} messageOptions
   * @returns {Promise<SaleInvoiceMailOptions>}
   */
  async getFormattedMailOptions(
    tenantId: number,
    saleInvoiceId: number,
    messageOptions: SendInvoiceMailDTO
  ): Promise<SaleInvoiceMailOptions> {
    const defaultMessageOptions = await this.invoiceMail.getInvoiceMailOptions(
      tenantId,
      saleInvoiceId
    );
    // Merges message options with default options and parses the options values.
    const parsedMessageOptions = mergeAndValidateMailOptions(
      defaultMessageOptions,
      messageOptions
    );
    return this.invoiceMail.formatInvoiceMailOptions(
      tenantId,
      saleInvoiceId,
      parsedMessageOptions
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
    const formattedMessageOptions = await this.getFormattedMailOptions(
      tenantId,
      saleInvoiceId,
      messageOptions
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
