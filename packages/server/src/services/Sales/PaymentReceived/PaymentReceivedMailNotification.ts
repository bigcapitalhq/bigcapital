import { Inject, Service } from 'typedi';
import {
  PaymentReceiveMailOpts,
  PaymentReceiveMailOptsDTO,
  PaymentReceiveMailPresendEvent,
  SendInvoiceMailDTO,
} from '@/interfaces';
import Mail from '@/lib/Mail';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  DEFAULT_PAYMENT_MAIL_CONTENT,
  DEFAULT_PAYMENT_MAIL_SUBJECT,
} from './constants';
import { GetPaymentReceived } from './GetPaymentReceived';
import { ContactMailNotification } from '@/services/MailNotification/ContactMailNotification';
import { mergeAndValidateMailOptions } from '@/services/MailNotification/utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { transformPaymentReceivedToMailDataArgs } from './utils';

@Service()
export class SendPaymentReceiveMailNotification {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getPaymentService: GetPaymentReceived;

  @Inject()
  private contactMailNotification: ContactMailNotification;

  @Inject('agenda')
  private agenda: any;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Sends the mail of the given payment receive.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {PaymentReceiveMailOptsDTO} messageDTO
   * @returns {Promise<void>}
   */
  public async triggerMail(
    tenantId: number,
    paymentReceiveId: number,
    messageDTO: PaymentReceiveMailOptsDTO
  ): Promise<void> {
    const payload = {
      tenantId,
      paymentReceiveId,
      messageDTO,
    };
    await this.agenda.now('payment-receive-mail-send', payload);

    // Triggers `onPaymentReceivePreMailSend` event.
    await this.eventPublisher.emitAsync(events.paymentReceive.onPreMailSend, {
      tenantId,
      paymentReceiveId,
      messageOptions: messageDTO,
    } as PaymentReceiveMailPresendEvent);
  }

  /**
   * Retrieves the default payment mail options.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveId - Payment receive id.
   * @returns {Promise<PaymentReceiveMailOpts>}
   */
  public getMailOptions = async (
    tenantId: number,
    paymentId: number
  ): Promise<PaymentReceiveMailOpts> => {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    const paymentReceive = await PaymentReceive.query()
      .findById(paymentId)
      .throwIfNotFound();

    const formatArgs = await this.textFormatter(tenantId, paymentId);

    const mailOptions =
      await this.contactMailNotification.getDefaultMailOptions(
        tenantId,
        paymentReceive.customerId
      );
    return {
      ...mailOptions,
      subject: DEFAULT_PAYMENT_MAIL_SUBJECT,
      message: DEFAULT_PAYMENT_MAIL_CONTENT,
      ...formatArgs,
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
    invoiceId: number
  ): Promise<Record<string, string>> => {
    const payment = await this.getPaymentService.getPaymentReceive(
      tenantId,
      invoiceId
    );
    return transformPaymentReceivedToMailDataArgs(payment);
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
    const parsedMessageOpts = mergeAndValidateMailOptions(
      defaultMessageOpts,
      messageDTO
    );
    const mail = new Mail()
      .setSubject(parsedMessageOpts.subject)
      .setTo(parsedMessageOpts.to)
      .setContent(parsedMessageOpts.message);

    const eventPayload = {
      tenantId,
      paymentReceiveId,
      messageOptions: parsedMessageOpts,
    };
    // Triggers `onPaymentReceiveMailSend` event.
    await this.eventPublisher.emitAsync(
      events.paymentReceive.onMailSend,
      eventPayload
    );
    await mail.send();

    // Triggers `onPaymentReceiveMailSent` event.
    await this.eventPublisher.emitAsync(
      events.paymentReceive.onMailSent,
      eventPayload
    );
  }
}
