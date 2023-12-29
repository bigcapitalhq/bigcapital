import { Inject, Service } from 'typedi';
import { isEmpty } from 'lodash';
import { SaleInvoiceMailOptions } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  DEFAULT_INVOICE_MAIL_CONTENT,
  DEFAULT_INVOICE_MAIL_SUBJECT,
} from './constants';
import { GetSaleInvoice } from './GetSaleInvoice';
import { Tenant } from '@/system/models';
import { ServiceError } from '@/exceptions';
import { ContactMailNotification } from '@/services/MailNotification/ContactMailNotification';

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
   * @returns {}
   */
  public async getMailOpts(
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

    return this.contactMailNotification.getMailOptions(
      tenantId,
      saleInvoice.customerId,
      defaultSubject,
      defaultBody,
      formatterData
    );
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
    const organization = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    return {
      CompanyName: organization.metadata.name,
      CustomerName: invoice.customer.displayName,
      InvoiceNumber: invoice.invoiceNo,
      InvoiceDueAmount: invoice.dueAmountFormatted,
      InvoiceDueDate: invoice.dueDateFormatted,
      InvoiceDate: invoice.invoiceDateFormatted,
      InvoiceAmount: invoice.totalFormatted,
      OverdueDays: invoice.overdueDays,
    };
  };

  /**
   * Validates the mail notification options before sending it.
   * @param {Partial<SaleInvoiceMailOptions>} mailNotificationOpts
   * @throws {ServiceError}
   */
  public validateMailNotification(
    mailNotificationOpts: Partial<SaleInvoiceMailOptions>
  ) {
    if (isEmpty(mailNotificationOpts.from)) {
      throw new ServiceError(ERRORS.MAIL_FROM_NOT_FOUND);
    }
    if (isEmpty(mailNotificationOpts.to)) {
      throw new ServiceError(ERRORS.MAIL_TO_NOT_FOUND);
    }
    if (isEmpty(mailNotificationOpts.subject)) {
      throw new ServiceError(ERRORS.MAIL_SUBJECT_NOT_FOUND);
    }
    if (isEmpty(mailNotificationOpts.body)) {
      throw new ServiceError(ERRORS.MAIL_BODY_NOT_FOUND);
    }
  }
}

const ERRORS = {
  MAIL_FROM_NOT_FOUND: 'Mail from address not found',
  MAIL_TO_NOT_FOUND: 'Mail to address not found',
  MAIL_SUBJECT_NOT_FOUND: 'Mail subject not found',
  MAIL_BODY_NOT_FOUND: 'Mail body not found',
};
