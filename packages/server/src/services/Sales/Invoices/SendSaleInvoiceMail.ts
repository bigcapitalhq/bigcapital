import { Inject, Service } from 'typedi';
import Mail from '@/lib/Mail';
import { SendInvoiceMailDTO } from '@/interfaces';
import { SaleInvoicePdf } from './SaleInvoicePdf';
import { SendSaleInvoiceMailCommon } from './SendInvoiceInvoiceMailCommon';
import {
  DEFAULT_INVOICE_MAIL_CONTENT,
  DEFAULT_INVOICE_MAIL_SUBJECT,
} from './constants';
import { parseAndValidateMailOptions } from '@/services/MailNotification/utils';

@Service()
export class SendSaleInvoiceMail {
  @Inject()
  private invoicePdf: SaleInvoicePdf;

  @Inject()
  private invoiceMail: SendSaleInvoiceMailCommon;

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
    messageDTO: SendInvoiceMailDTO
  ) {
    const payload = {
      tenantId,
      saleInvoiceId,
      messageDTO,
    };
    await this.agenda.now('sale-invoice-mail-send', payload);
  }

  /**
   * Retrieves the mail options of the given sale invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @returns {Promise<SaleInvoiceMailOptions>}
   */
  public async getMailOption(tenantId: number, saleInvoiceId: number) {
    return this.invoiceMail.getMailOption(
      tenantId,
      saleInvoiceId,
      DEFAULT_INVOICE_MAIL_SUBJECT,
      DEFAULT_INVOICE_MAIL_CONTENT
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
    messageDTO: SendInvoiceMailDTO
  ) {
    const defaultMessageOpts = await this.getMailOption(
      tenantId,
      saleInvoiceId
    );
    // Merge message opts with default options and validate the incoming options.
    const messageOpts = parseAndValidateMailOptions(
      defaultMessageOpts,
      messageDTO
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
    await mail.send();
  }
}
