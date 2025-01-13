import { castArray } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { MailTenancy } from '../MailTenancy/MailTenancy.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { Customer } from '../Customers/models/Customer';
import { CommonMailOptions } from './MailNotification.types';

@Injectable()
export class ContactMailNotification {
  constructor(
    private readonly mailTenancy: MailTenancy,
    private readonly tenantContext: TenancyContext,

    @Inject(Customer.name)
    private readonly customerModel: typeof Customer,
  ) {}

  /**
   * Gets the default mail address of the given contact.
   * @param {number} invoiceId - Contact id.
   * @returns {Promise<Pick<CommonMailOptions, 'to' | 'from'>>}
   */
  public async getDefaultMailOptions(
    customerId: number,
  ): Promise<
    Pick<CommonMailOptions, 'to' | 'from' | 'toOptions' | 'fromOptions'>
  > {
    const customer = await this.customerModel
      .query()
      .findById(customerId)
      .throwIfNotFound();

    const toOptions = customer.contactAddresses;
    const fromOptions = await this.mailTenancy.senders();

    const toAddress = toOptions.find((a) => a.primary);
    const fromAddress = fromOptions.find((a) => a.primary);

    const to = toAddress?.mail ? castArray(toAddress?.mail) : [];
    const from = fromAddress?.mail ? castArray(fromAddress?.mail) : [];

    return { to, from, toOptions, fromOptions };
  }

  /**
   * Retrieves the mail options of the given contact.
   * @param {number} tenantId - Tenant id.
   * @returns {Promise<CommonMailOptions>}
   */
  public async formatMailOptions(
    mailOptions: CommonMailOptions,
    formatterArgs?: Record<string, any>,
  ): Promise<CommonMailOptions> {
    const commonFormatArgs = await this.getCommonFormatArgs();
    const formatArgs = {
      ...commonFormatArgs,
      ...formatterArgs,
    };
    const subjectFormatted = formatSmsMessage(mailOptions?.subject, formatArgs);
    const messageFormatted = formatSmsMessage(mailOptions?.message, formatArgs);

    return {
      ...mailOptions,
      subject: subjectFormatted,
      message: messageFormatted,
    };
  }

  /**
   * Retrieves the common format args.
   * @returns {Promise<Record<string, string>>}
   */
  public async getCommonFormatArgs(): Promise<Record<string, string>> {
    const tenantMetadata = await this.tenantContext.getTenantMetadata();

    return {
      ['Company Name']: tenantMetadata.name,
    };
  }
}
