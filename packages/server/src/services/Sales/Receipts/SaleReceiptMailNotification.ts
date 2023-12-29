import * as R from 'ramda';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { Tenant } from '@/system/models';
import Mail from '@/lib/Mail';
import { GetSaleReceipt } from './GetSaleReceipt';
import { SaleReceiptsPdf } from './SaleReceiptsPdfService';
import {
  DEFAULT_RECEIPT_MAIL_CONTENT,
  DEFAULT_RECEIPT_MAIL_SUBJECT,
} from './constants';
import { SaleReceiptMailOpts } from '@/interfaces';
import { ContactMailNotification } from '@/services/MailNotification/ContactMailNotification';

@Service()
export class SaleReceiptMailNotification {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getSaleReceiptService: GetSaleReceipt;

  @Inject()
  private receiptPdfService: SaleReceiptsPdf;

  @Inject()
  private contactMailNotification: ContactMailNotification;

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
   * Retrieves the mail options of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns
   */
  public async getMailOptions(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const saleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .throwIfNotFound();

    const formattedData = await this.textFormatter(tenantId, saleReceiptId);

    return this.contactMailNotification.getMailOptions(
      tenantId,
      saleReceipt.customerId,
      DEFAULT_RECEIPT_MAIL_SUBJECT,
      DEFAULT_RECEIPT_MAIL_CONTENT,
      formattedData
    );
  }

  /**
   * Retrieves the formatted text of the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} receiptId - Sale receipt id.
   * @param {string} text - The given text.
   * @returns {Promise<string>}
   */
  public textFormatter = async (
    tenantId: number,
    receiptId: number
  ): Promise<Record<string, string>> => {
    const invoice = await this.getSaleReceiptService.getSaleReceipt(
      tenantId,
      receiptId
    );
    const organization = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    return {
      CompanyName: organization.metadata.name,
      CustomerName: invoice.customer.displayName,
      ReceiptNumber: invoice.receiptNumber,
      ReceiptDate: invoice.formattedReceiptDate,
      ReceiptAmount: invoice.formattedAmount,
    };
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
    const defaultMessageOpts = await this.getMailOptions(
      tenantId,
      saleReceiptId
    );
    // Parsed message opts with default options.
    const parsedMessageOpts = {
      ...defaultMessageOpts,
      ...messageOpts,
    };

    const mail = new Mail()
      .setSubject(parsedMessageOpts.subject)
      .setTo(parsedMessageOpts.to)
      .setContent(parsedMessageOpts.body);

    if (parsedMessageOpts.attachInvoice) {
      // Retrieves document buffer of the invoice pdf document.
      const receiptPdfBuffer = await this.receiptPdfService.saleReceiptPdf(
        tenantId,
        saleReceiptId
      );
      mail.setAttachments([
        { filename: 'invoice.pdf', content: receiptPdfBuffer },
      ]);
    }
    await mail.send();
  }
}
