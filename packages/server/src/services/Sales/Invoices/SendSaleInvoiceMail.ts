import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { SendInvoiceMailDTO } from '@/interfaces';
import Mail from '@/lib/Mail';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { SaleInvoicePdf } from './SaleInvoicePdf';
import {
  DEFAULT_INVOICE_MAIL_CONTENT,
  DEFAULT_INVOICE_MAIL_SUBJECT,
  ERRORS,
} from './constants';
import { ServiceError } from '@/exceptions';
import { formatSmsMessage } from '@/utils';
import { GetSaleInvoice } from './GetSaleInvoice';
import { Tenant } from '@/system/models';

@Service()
export class SendSaleInvoiceMail {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getSaleInvoiceService: GetSaleInvoice;
  
  @Inject()
  private invoicePdf: SaleInvoicePdf;

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
   * Retrieves the default invoice mail options.
   * @param {number} tenantId
   * @param {number} invoiceId
   * @returns {Promise<SendInvoiceMailDTO>}
   */
  public getDefaultMailOpts = async (tenantId: number, invoiceId: number) => {
    const { SaleInvoice } = this.tenancy.models(tenantId);
    const saleInvoice = await SaleInvoice.query()
      .findById(invoiceId)
      .withGraphFetched('customer')
      .throwIfNotFound();

    return {
      attachInvoice: true,
      subject: DEFAULT_INVOICE_MAIL_SUBJECT,
      body: DEFAULT_INVOICE_MAIL_CONTENT,
      to: saleInvoice.customer.email,
    };
  };

  /**
   * Retrieves the formatted text of the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Sale invoice id.
   * @param {string} text - The given text.
   * @returns {Promise<string>}
   */
  public textFormatter = async (
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
   * @param {SendInvoiceMailDTO} messageDTO
   * @returns {Promise<void>}
   */
  public async sendMail(
    tenantId: number,
    saleInvoiceId: number,
    messageDTO: SendInvoiceMailDTO
  ) {
    const defaultMessageOpts = await this.getDefaultMailOpts(
      tenantId,
      saleInvoiceId
    );
    // Parsed message opts with default options.
    const parsedMessageOpts = {
      ...defaultMessageOpts,
      ...messageDTO,
    };
    // In case there is no email address from the customer or from options, throw an error.
    if (!parsedMessageOpts.to) {
      throw new ServiceError(ERRORS.NO_INVOICE_CUSTOMER_EMAIL_ADDR);
    }
    const formatter = R.curry(this.textFormatter)(tenantId, saleInvoiceId);
    const subject = await formatter(parsedMessageOpts.subject);
    const body = await formatter(parsedMessageOpts.body);
    const attachments = [];

    if (parsedMessageOpts.attachInvoice) {
      // Retrieves document buffer of the invoice pdf document.
      const invoicePdfBuffer = await this.invoicePdf.saleInvoicePdf(
        tenantId,
        saleInvoiceId
      );
      attachments.push({ filename: 'invoice.pdf', content: invoicePdfBuffer });
    }
    await new Mail()
      .setSubject(subject)
      .setTo(parsedMessageOpts.to)
      .setContent(body)
      .setAttachments(attachments)
      .send();
  }
}
