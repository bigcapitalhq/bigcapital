import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { assign } from 'lodash';
import { SendInvoiceMailDTO } from '@/interfaces';
import Mail from '@/lib/Mail';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { CommandSaleInvoiceValidators } from './CommandSaleInvoiceValidators';
import { SaleInvoiceMailFormatter } from './SaleInvoiceMailFormatter';
import {
  DEFAULT_INVOICE_REMINDER_MAIL_CONTENT,
  DEFAULT_INVOICE_REMINDER_MAIL_SUBJECT,
  ERRORS,
} from './constants';
import { SaleInvoicePdf } from './SaleInvoicePdf';
import { ServiceError } from '@/exceptions';

@Service()
export class SendInvoiceMailReminder {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject('agenda')
  private agenda: any;

  @Inject()
  private commandInvoiceValidator: CommandSaleInvoiceValidators;

  @Inject()
  private invoiceFormatter: SaleInvoiceMailFormatter;

  @Inject()
  private invoicePdf: SaleInvoicePdf;

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
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphFetched('customer');

    // Validates the invoice existance.
    this.commandInvoiceValidator.validateInvoiceExistance(saleInvoice);

    const parsedMessageOptions = {
      attachInvoice: true,
      subject: DEFAULT_INVOICE_REMINDER_MAIL_SUBJECT,
      body: DEFAULT_INVOICE_REMINDER_MAIL_CONTENT,
      to: saleInvoice.customer.email,
      ...messageOptions,
    };
    // In case there is no email address from the customer or from options, throw an error.
    if (!parsedMessageOptions.to) {
      throw new ServiceError(ERRORS.NO_INVOICE_CUSTOMER_EMAIL_ADDR);
    }
    const formatter = R.curry(this.invoiceFormatter.formatText)(
      tenantId,
      saleInvoiceId
    );
    const toEmail = parsedMessageOptions.to;
    const subject = await formatter(parsedMessageOptions.subject);
    const body = await formatter(parsedMessageOptions.body);
    const attachments = [];

    if (parsedMessageOptions.attachInvoice) {
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
