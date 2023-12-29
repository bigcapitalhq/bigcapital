import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { SaleInvoiceMailOptions } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { MailTenancy } from '@/services/MailTenancy/MailTenancy';
import { formatSmsMessage } from '@/utils';

@Service()
export class ContactMailNotification {
  @Inject()
  private mailTenancy: MailTenancy;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Parses the default message options.
   * @param {number} tenantId
   * @param {number} invoiceId
   * @returns {Promise<SaleInvoiceMailOptions>}
   */
  public async getDefaultMailOptions(
    tenantId: number,
    contactId: number,
    subject: string = '',
    body: string = ''
  ): Promise<any> {
    const { Contact, Customer } = this.tenancy.models(tenantId);
    const contact = await Customer.query().findById(contactId).throwIfNotFound();

    const toAddresses = contact.contactAddresses;
    const fromAddresses = await this.mailTenancy.senders(tenantId);

    const toAddress = toAddresses.find((a) => a.primary);
    const fromAddress = fromAddresses.find((a) => a.primary);

    const to = toAddress?.mail || '';
    const from = fromAddress?.mail || '';

    return {
      subject,
      body,
      to,
      from,
      fromAddresses,
      toAddresses,
    };
  }

  /**
   * Retrieves the mail options.
   * @param {number}
   * @param {number} invoiceId
   * @returns {}
   */
  public async getMailOptions(
    tenantId: number,
    contactId: number,
    defaultSubject?: string,
    defaultBody?: string,
    formatterData?: Record<string, any>
  ): Promise<SaleInvoiceMailOptions> {
    const mailOpts = await this.getDefaultMailOptions(
      tenantId,
      contactId,
      defaultSubject,
      defaultBody
    );
    const subject = formatSmsMessage(mailOpts.subject, formatterData);
    const body = formatSmsMessage(mailOpts.body, formatterData);

    return {
      ...mailOpts,
      subject,
      body,
    };
  }
}
