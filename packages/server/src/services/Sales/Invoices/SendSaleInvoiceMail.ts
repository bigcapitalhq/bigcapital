import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { SendInvoiceMailDTO } from '@/interfaces';
import Mail from '@/lib/Mail';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { SaleInvoicePdf } from './SaleInvoicePdf';
import { SaleInvoiceMailFormatter } from './SaleInvoiceMailFormatter';
import {
  DEFAULT_INVOICE_MAIL_CONTENT,
  DEFAULT_INVOICE_MAIL_SUBJECT,
  ERRORS,
} from './constants';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators';
import { ServiceError } from '@/exceptions';

@Service()
export class SendSaleInvoiceMail {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject('agenda')
  private agenda: any;

  @Inject()
  private invoicePdf: SaleInvoicePdf;

  @Inject()
  private invoiceFormatter: SaleInvoiceMailFormatter;

  @Inject()
  private commandInvoiceValidator: CommandSaleInvoiceValidators;

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
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphFetched('customer');

    this.commandInvoiceValidator.validateInvoiceExistance(saleInvoice);

    // Parsed message opts with default options.
    const parsedMessageOpts = {
      attachInvoice: true,
      subject: DEFAULT_INVOICE_MAIL_SUBJECT,
      body: DEFAULT_INVOICE_MAIL_CONTENT,
      to: saleInvoice.customer.email,
      ...messageDTO,
    };
    // In case there is no email address from the customer or from options, throw an error.
    if (!parsedMessageOpts.to) {
      throw new ServiceError(ERRORS.NO_INVOICE_CUSTOMER_EMAIL_ADDR);
    }
    const formatter = R.curry(this.invoiceFormatter.formatText)(
      tenantId,
      saleInvoiceId
    );
    const toEmail = parsedMessageOpts.to;
    const subject = await formatter(parsedMessageOpts.subject);
    const body = await formatter(parsedMessageOpts.body);
    const attachments = [];

    if (parsedMessageOpts.attachInvoice) {
      // Retrieves document buffer of the invoice pdf document.
      const invoicePdfBuffer = await this.invoicePdf.saleInvoicePdf(
        tenantId,
        saleInvoiceId
      );
      attachments.push({
        filename: 'invoice.pdf',
        content: invoicePdfBuffer,
      });
    }
    const mail = new Mail()
      .setSubject(subject)
      .setTo(toEmail)
      .setContent(body)
      .setAttachments(attachments);

    await mail.send();
  }
}
