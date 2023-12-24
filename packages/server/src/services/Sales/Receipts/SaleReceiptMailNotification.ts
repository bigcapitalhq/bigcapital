import * as R from 'ramda';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { Tenant } from '@/system/models';
import { formatSmsMessage } from '@/utils';
import { ServiceError } from '@/exceptions';
import Mail from '@/lib/Mail';
import { GetSaleReceipt } from './GetSaleReceipt';
import { SaleReceiptsPdf } from './SaleReceiptsPdfService';
import {
  DEFAULT_RECEIPT_MAIL_CONTENT,
  DEFAULT_RECEIPT_MAIL_SUBJECT,
} from './constants';
import { ERRORS } from './constants';
import { SaleReceiptMailOpts } from '@/interfaces';

@Service()
export class SaleReceiptMailNotification {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getSaleReceiptService: GetSaleReceipt;

  @Inject()
  private receiptPdfService: SaleReceiptsPdf;

  @Inject('agenda')
  private agenda: any;

  /**
   * Sends the receipt mail of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @param {SendInvoiceMailDTO} messageDTO
   */
  public async triggerMail(
    tenantId: number,
    saleReceiptId: number,
    messageOpts: SaleReceiptMailOpts
  ) {
    const payload = {
      tenantId,
      saleReceiptId,
      messageOpts,
    };
    await this.agenda.now('sale-receipt-mail-send', payload);
  }

  /**
   * Retrieves the default receipt mail options.
   * @param {number} tenantId
   * @param {number} invoiceId
   * @returns {Promise<SendInvoiceMailDTO>}
   */
  public getDefaultMailOpts = async (tenantId: number, invoiceId: number) => {
    const { SaleReceipt } = this.tenancy.models(tenantId);
    const saleReceipt = await SaleReceipt.query()
      .findById(invoiceId)
      .withGraphFetched('customer')
      .throwIfNotFound();

    return {
      attachInvoice: true,
      subject: DEFAULT_RECEIPT_MAIL_SUBJECT,
      body: DEFAULT_RECEIPT_MAIL_CONTENT,
      to: saleReceipt.customer.email,
    };
  };

  /**
   * Retrieves the formatted text of the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} receiptId - Sale receipt id.
   * @param {string} text - The given text.
   * @returns {Promise<string>}
   */
  public textFormatter = async (
    tenantId: number,
    receiptId: number,
    text: string
  ): Promise<string> => {
    const invoice = await this.getSaleReceiptService.getSaleReceipt(
      tenantId,
      receiptId
    );
    const organization = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    return formatSmsMessage(text, {
      CompanyName: organization.metadata.name,
      CustomerName: invoice.customer.displayName,
      ReceiptNumber: invoice.receiptNumber,
      ReceiptDate: invoice.formattedReceiptDate,
      ReceiptAmount: invoice.formattedAmount,
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
    saleReceiptId: number,
    messageOpts: SaleReceiptMailOpts
  ) {
    const defaultMessageOpts = await this.getDefaultMailOpts(
      tenantId,
      saleReceiptId
    );
    // Parsed message opts with default options.
    const parsedMessageOpts = {
      ...defaultMessageOpts,
      ...messageOpts,
    };
    // In case there is no email address from the customer or from options, throw an error.
    if (!parsedMessageOpts.to) {
      throw new ServiceError(ERRORS.NO_INVOICE_CUSTOMER_EMAIL_ADDR);
    }
    const formatter = R.curry(this.textFormatter)(tenantId, saleReceiptId);
    const body = await formatter(parsedMessageOpts.body);
    const subject = await formatter(parsedMessageOpts.subject);
    const attachments = [];

    if (parsedMessageOpts.attachInvoice) {
      // Retrieves document buffer of the invoice pdf document.
      const receiptPdfBuffer = await this.receiptPdfService.saleReceiptPdf(
        tenantId,
        saleReceiptId
      );
      attachments.push({ filename: 'invoice.pdf', content: receiptPdfBuffer });
    }
    await new Mail()
      .setSubject(subject)
      .setTo(parsedMessageOpts.to)
      .setContent(body)
      .setAttachments(attachments)
      .send();
  }
}
