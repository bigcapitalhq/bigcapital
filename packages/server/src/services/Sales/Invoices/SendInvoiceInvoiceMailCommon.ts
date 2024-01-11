import { Inject, Service } from 'typedi';
import { SaleInvoiceMailOptions } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetSaleInvoice } from './GetSaleInvoice';
import { ContactMailNotification } from '@/services/MailNotification/ContactMailNotification';
import {
  DEFAULT_INVOICE_MAIL_CONTENT,
  DEFAULT_INVOICE_MAIL_SUBJECT,
} from './constants';

@Service()
export class SendSaleInvoiceMailCommon {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getSaleInvoiceService: GetSaleInvoice;

  @Inject()
  private contactMailNotification: ContactMailNotification;

  /**
   * Retrieves the mail options.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Invoice id.
   * @param {string} defaultSubject - Subject text.
   * @param {string} defaultBody - Subject body.
   * @returns {Promise<SaleInvoiceMailOptions>}
   */
  public async getMailOption(
    tenantId: number,
    invoiceId: number,
    defaultSubject: string = DEFAULT_INVOICE_MAIL_SUBJECT,
    defaultBody: string = DEFAULT_INVOICE_MAIL_CONTENT
  ): Promise<SaleInvoiceMailOptions> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findById(invoiceId)
      .throwIfNotFound();

    const formatterData = await this.formatText(tenantId, invoiceId);

    const mailOptions = await this.contactMailNotification.getMailOptions(
      tenantId,
      saleInvoice.customerId,
      defaultSubject,
      defaultBody,
      formatterData
    );
    return {
      ...mailOptions,
      attachInvoice: true,
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
    invoiceId: number
  ): Promise<Record<string, string | number>> => {
    const invoice = await this.getSaleInvoiceService.getSaleInvoice(
      tenantId,
      invoiceId
    );

    return {
      CustomerName: invoice.customer.displayName,
      InvoiceNumber: invoice.invoiceNo,
      InvoiceDueAmount: invoice.dueAmountFormatted,
      InvoiceDueDate: invoice.dueDateFormatted,
      InvoiceDate: invoice.invoiceDateFormatted,
      InvoiceAmount: invoice.totalFormatted,
      OverdueDays: invoice.overdueDays,
    };
  };
}
