import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { SendInvoiceMailDTO } from '@/interfaces';
import Mail from '@/lib/Mail';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  DEFAULT_INVOICE_REMINDER_MAIL_CONTENT,
  DEFAULT_INVOICE_REMINDER_MAIL_SUBJECT,
  ERRORS,
} from './constants';
import { SaleInvoicePdf } from './SaleInvoicePdf';
import { ServiceError } from '@/exceptions';
import { GetSaleInvoice } from './GetSaleInvoice';
import { Tenant } from '@/system/models';
import { formatSmsMessage } from '@/utils';

@Service()
export class SendInvoiceMailReminder {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject('agenda')
  private agenda: any;

  @Inject()
  private invoicePdf: SaleInvoicePdf;

  @Inject()
  private getSaleInvoiceService: GetSaleInvoice;

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
   * Parses the default message options.
   * @param {number} tenantId
   * @param {number} invoiceId
   * @returns {Promise<SendInvoiceMailDTO>}
   */
  public async getDefaultMailOpts(tenantId: number, invoiceId: number) {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findById(invoiceId)
      .withGraphFetched('customer')
      .throwIfNotFound();

    return {
      attachInvoice: true,
      subject: DEFAULT_INVOICE_REMINDER_MAIL_SUBJECT,
      body: DEFAULT_INVOICE_REMINDER_MAIL_CONTENT,
      to: saleInvoice.customer.email,
    };
  }

  /**
   * Retrieves the formatted text of the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Sale invoice id.
   * @param {string} text - The given text.
   * @returns {Promise<string>}
   */
  public formatText = async (
    tenantId: number,
    invoiceId: number,
    text: string
  ): Promise<string> => {
    const invoice = await this.getSaleInvoiceService.getSaleInvoice(
      tenantId,
      invoiceId
    );
    const organization = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    return formatSmsMessage(text, {
      CompanyName: organization.metadata.name,
      CustomerName: invoice.customer.displayName,
      InvoiceNumber: invoice.invoiceNo,
      InvoiceDueAmount: invoice.dueAmountFormatted,
      InvoiceDueDate: invoice.dueDateFormatted,
      InvoiceDate: invoice.invoiceDateFormatted,
      InvoiceAmount: invoice.totalFormatted,
    });
  };

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
    const defaultMessageOpts = await this.getDefaultMailOpts(
      tenantId,
      saleInvoiceId
    );
    const parsedMessageOptions = {
      ...defaultMessageOpts,
      ...messageOptions,
    };
    // In case there is no email address from the customer or from options, throw an error.
    if (!parsedMessageOptions.to) {
      throw new ServiceError(ERRORS.NO_INVOICE_CUSTOMER_EMAIL_ADDR);
    }
    const formatter = R.curry(this.formatText)(tenantId, saleInvoiceId);
    const subject = await formatter(parsedMessageOptions.subject);
    const body = await formatter(parsedMessageOptions.body);
    const attachments = [];

    if (parsedMessageOptions.attachInvoice) {
      // Retrieves document buffer of the invoice pdf document.
      const invoicePdfBuffer = await this.invoicePdf.saleInvoicePdf(
        tenantId,
        saleInvoiceId
      );
      attachments.push({ filename: 'invoice.pdf', content: invoicePdfBuffer });
    }
    const mail = new Mail()
      .setSubject(subject)
      .setTo(parsedMessageOptions.to)
      .setContent(body)
      .setAttachments(attachments);

    await mail.send();
  }
}
