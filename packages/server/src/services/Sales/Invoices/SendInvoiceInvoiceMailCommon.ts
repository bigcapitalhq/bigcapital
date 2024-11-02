import { Inject, Service } from 'typedi';
import { SaleInvoiceMailOptions } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetSaleInvoice } from './GetSaleInvoice';
import { ContactMailNotification } from '@/services/MailNotification/ContactMailNotification';
import {
  DEFAULT_INVOICE_MAIL_CONTENT,
  DEFAULT_INVOICE_MAIL_SUBJECT,
} from './constants';
import { GetInvoicePaymentMail } from './GetInvoicePaymentMail';

@Service()
export class SendSaleInvoiceMailCommon {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getSaleInvoiceService: GetSaleInvoice;

  @Inject()
  private contactMailNotification: ContactMailNotification;

  @Inject()
  private getInvoicePaymentMail: GetInvoicePaymentMail;

  /**
   * Retrieves the mail options.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Invoice id.
   * @param {string} defaultSubject - Subject text.
   * @param {string} defaultBody - Subject body.
   * @returns {Promise<SaleInvoiceMailOptions>}
   */
  public async getInvoiceMailOptions(
    tenantId: number,
    invoiceId: number,
    defaultSubject: string = DEFAULT_INVOICE_MAIL_SUBJECT,
    defaultMessage: string = DEFAULT_INVOICE_MAIL_CONTENT
  ): Promise<SaleInvoiceMailOptions> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    const saleInvoice = await SaleInvoice.query()
      .findById(invoiceId)
      .throwIfNotFound();

    const contactMailDefaultOptions =
      await this.contactMailNotification.getDefaultMailOptions(
        tenantId,
        saleInvoice.customerId
      );
    const formatArgs = await this.getInvoiceFormatterArgs(tenantId, invoiceId);

    return {
      ...contactMailDefaultOptions,
      subject: defaultSubject,
      message: defaultMessage,
      attachInvoice: true,
      formatArgs,
    };
  }

  /**
   * Formats the given invoice mail options.
   * @param {number} tenantId
   * @param {number} invoiceId
   * @param {SaleInvoiceMailOptions} mailOptions
   * @returns {Promise<SaleInvoiceMailOptions>}
   */
  public async formatInvoiceMailOptions(
    tenantId: number,
    invoiceId: number,
    mailOptions: SaleInvoiceMailOptions
  ): Promise<SaleInvoiceMailOptions> {
    const formatterArgs = await this.getInvoiceFormatterArgs(
      tenantId,
      invoiceId
    );
    const formattedOptions =
      await this.contactMailNotification.formatMailOptions(
        tenantId,
        mailOptions,
        formatterArgs
      );
    const message = await this.getInvoicePaymentMail.getMailTemplate(
      tenantId,
      invoiceId,
      {
        // # Invoice message
        invoiceMessage: formattedOptions.message,
        preview: formattedOptions.message,
      }
    );
    return { ...formattedOptions, message };
  }

  /**
   * Retrieves the formatted text of the given sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} invoiceId - Sale invoice id.
   * @param {string} text - The given text.
   * @returns {Promise<string>}
   */
  public getInvoiceFormatterArgs = async (
    tenantId: number,
    invoiceId: number
  ): Promise<Record<string, string | number>> => {
    const invoice = await this.getSaleInvoiceService.getSaleInvoice(
      tenantId,
      invoiceId
    );
    const commonArgs = await this.contactMailNotification.getCommonFormatArgs(
      tenantId
    );
    return {
      ...commonArgs,
      'Customer Name': invoice.customer.displayName,
      'Invoice Number': invoice.invoiceNo,
      'Invoice DueAmount': invoice.dueAmountFormatted,
      'Invoice DueDate': invoice.dueDateFormatted,
      'Invoice Date': invoice.invoiceDateFormatted,
      'Invoice Amount': invoice.totalFormatted,
      'Overdue Days': invoice.overdueDays,
    };
  };
}
