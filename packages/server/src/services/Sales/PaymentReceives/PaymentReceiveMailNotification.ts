import { Inject, Service } from 'typedi';
import { IPaymentReceiveMailOpts, SendInvoiceMailDTO } from '@/interfaces';
import Mail from '@/lib/Mail';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  DEFAULT_PAYMENT_MAIL_CONTENT,
  DEFAULT_PAYMENT_MAIL_SUBJECT,
} from './constants';
import { Tenant } from '@/system/models';
import { GetPaymentReceive } from './GetPaymentReceive';
import { ContactMailNotification } from '@/services/MailNotification/ContactMailNotification';

@Service()
export class SendPaymentReceiveMailNotification {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getPaymentService: GetPaymentReceive;

  @Inject()
  private contactMailNotification: ContactMailNotification;

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
  public getMailOptions = async (tenantId: number, invoiceId: number) => {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    const paymentReceive = await PaymentReceive.query()
      .findById(invoiceId)
      .throwIfNotFound();

    const formatterData = await this.textFormatter(tenantId, invoiceId);

    return this.contactMailNotification.getMailOptions(
      tenantId,
      paymentReceive.customerId,
      DEFAULT_PAYMENT_MAIL_SUBJECT,
      DEFAULT_PAYMENT_MAIL_CONTENT,
      formatterData
    );
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
    invoiceId: number
  ): Promise<Record<string, string>> => {
    const payment = await this.getPaymentService.getPaymentReceive(
      tenantId,
      invoiceId
    );
    const organization = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    return {
      CompanyName: organization.metadata.name,
      CustomerName: payment.customer.displayName,
      PaymentNumber: payment.payment_receive_no,
      PaymentDate: payment.formattedPaymentDate,
      PaymentAmount: payment.formattedAmount,
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
    paymentReceiveId: number,
    messageDTO: SendInvoiceMailDTO
  ): Promise<void> {
    const defaultMessageOpts = await this.getMailOptions(
      tenantId,
      paymentReceiveId
    );
    // Parsed message opts with default options.
    const parsedMessageOpts = {
      ...defaultMessageOpts,
      ...messageDTO,
    };
    await new Mail()
      .setSubject(parsedMessageOpts.subject)
      .setTo(parsedMessageOpts.to)
      .setContent(parsedMessageOpts.body)
      .send();
  }
}
