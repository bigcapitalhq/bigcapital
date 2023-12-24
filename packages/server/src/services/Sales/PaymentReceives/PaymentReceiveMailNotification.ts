import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import { IPaymentReceiveMailOpts, SendInvoiceMailDTO } from '@/interfaces';
import Mail from '@/lib/Mail';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  DEFAULT_PAYMENT_MAIL_CONTENT,
  DEFAULT_PAYMENT_MAIL_SUBJECT,
  ERRORS,
} from './constants';
import { ServiceError } from '@/exceptions';
import { formatSmsMessage } from '@/utils';
import { Tenant } from '@/system/models';
import { GetPaymentReceive } from './GetPaymentReceive';

@Service()
export class SendPaymentReceiveMailNotification {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getPaymentService: GetPaymentReceive;

  @Inject('agenda')
  private agenda: any;

  /**
   * Sends the mail of the given payment receive.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {SendInvoiceMailDTO} messageDTO
   */
  public async triggerMail(
    tenantId: number,
    paymentReceiveId: number,
    messageDTO: IPaymentReceiveMailOpts
  ) {
    const payload = {
      tenantId,
      paymentReceiveId,
      messageDTO,
    };
    await this.agenda.now('payment-receive-mail-send', payload);
  }

  /**
   * Retrieves the default payment mail options.
   * @param {number} tenantId
   * @param {number} invoiceId
   * @returns {Promise<SendInvoiceMailDTO>}
   */
  public getDefaultMailOpts = async (tenantId: number, invoiceId: number) => {
    const { PaymentReceive } = this.tenancy.models(tenantId);
    const paymentReceive = await PaymentReceive.query()
      .findById(invoiceId)
      .withGraphFetched('customer')
      .throwIfNotFound();

    return {
      attachInvoice: true,
      subject: DEFAULT_PAYMENT_MAIL_SUBJECT,
      body: DEFAULT_PAYMENT_MAIL_CONTENT,
      to: paymentReceive.customer.email,
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
    const payment = await this.getPaymentService.getPaymentReceive(
      tenantId,
      invoiceId
    );
    const organization = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    return formatSmsMessage(text, {
      CompanyName: organization.metadata.name,
      CustomerName: payment.customer.displayName,
      PaymentNumber: payment.invoiceNo,
      PaymentDate: payment.dueAmountFormatted,
      PaymentAmount: payment.dueAmountFormatted,
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
    paymentReceiveId: number,
    messageDTO: SendInvoiceMailDTO
  ): Promise<void> {
    const defaultMessageOpts = await this.getDefaultMailOpts(
      tenantId,
      paymentReceiveId
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
    const formatter = R.curry(this.textFormatter)(tenantId, paymentReceiveId);
    const subject = await formatter(parsedMessageOpts.subject);
    const body = await formatter(parsedMessageOpts.body);

    await new Mail()
      .setSubject(subject)
      .setTo(parsedMessageOpts.to)
      .setContent(body)
      .send();
  }
}
