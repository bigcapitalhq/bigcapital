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
import { transformPaymentReceivedToMailDataArgs } from './utils';
import { GetPaymentReceivedMailTemplate } from './GetPaymentReceivedMailTemplate';
import events from '@/subscribers/events';

@Service()
export class SendPaymentReceiveMailNotification {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getPaymentService: GetPaymentReceived;

  @Inject()
  private contactMailNotification: ContactMailNotification;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private paymentMailTemplate: GetPaymentReceivedMailTemplate;

  @Inject('agenda')
  private agenda: any;

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
    const commonArgs = await this.contactMailNotification.getCommonFormatArgs(
      tenantId
    );
    const paymentArgs = transformPaymentReceivedToMailDataArgs(payment);

    return {
      ...commonArgs,
      ...paymentArgs,
    };
  };

  /**
   * Retrieves the mail options of the given payment received.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceivedId - Payment received id.
   * @param {string} defaultSubject - Default subject of the mail.
   * @param {string} defaultContent - Default content of the mail.
   * @returns
   */
  public getMailOptions = async (
    tenantId: number,
    paymentReceivedId: number,
    defaultSubject: string = DEFAULT_PAYMENT_MAIL_SUBJECT,
    defaultContent: string = DEFAULT_PAYMENT_MAIL_CONTENT
  ): Promise<PaymentReceiveMailOpts> => {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    const paymentReceived = await PaymentReceive.query().findById(
      paymentReceivedId
    );
    const formatArgs = await this.textFormatter(tenantId, paymentReceivedId);

    // Retrieves the default mail options.
    const mailOptions =
      await this.contactMailNotification.getDefaultMailOptions(
        tenantId,
        paymentReceived.customerId
      );
    return {
      ...mailOptions,
      message: defaultContent,
      subject: defaultSubject,
      attachPdf: true,
      formatArgs,
    };
  };

  /**
   * Formats the mail options of the given payment receive.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {PaymentReceiveMailOpts} mailOptions
   * @returns {Promise<PaymentReceiveMailOpts>}
   */
  public formattedMailOptions = async (
    tenantId: number,
    paymentReceiveId: number,
    mailOptions: PaymentReceiveMailOpts
  ): Promise<PaymentReceiveMailOpts> => {
    const formatterArgs = await this.textFormatter(tenantId, paymentReceiveId);
    const formattedOptions =
      await this.contactMailNotification.formatMailOptions(
        tenantId,
        mailOptions,
        formatterArgs
      );
    // Retrieves the mail template.
    const message = await this.paymentMailTemplate.getMailTemplate(
      tenantId,
      paymentReceiveId,
      {
        message: formattedOptions.message,
        preview: formattedOptions.message,
      }
    );
    return { ...formattedOptions, message };
  };

  /**
   * Retrieves the formatted mail options of the given payment receive.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {SendInvoiceMailDTO} messageDTO
   * @returns {Promise<PaymentReceiveMailOpts>}
   */
  public getFormattedMailOptions = async (
    tenantId: number,
    paymentReceiveId: number,
    messageDTO: SendInvoiceMailDTO
  ) => {
    const formatterArgs = await this.textFormatter(tenantId, paymentReceiveId);

    // Default message options.
    const defaultMessageOpts = await this.getMailOptions(
      tenantId,
      paymentReceiveId
    );
    // Parsed message opts with default options.
    const parsedMessageOpts = mergeAndValidateMailOptions(
      defaultMessageOpts,
      messageDTO
    );
    // Formats the message options.
    return this.formattedMailOptions(
      tenantId,
      paymentReceiveId,
      parsedMessageOpts
    );
  };

  /**
   * Triggers the mail invoice.
   * @param {number} tenantId
   * @param {number} saleInvoiceId - Invoice id.
   * @param {SendInvoiceMailDTO} messageDTO - Message options.
   * @returns {Promise<void>}
   */
  public async sendMail(
    tenantId: number,
    paymentReceiveId: number,
    messageDTO: SendInvoiceMailDTO
  ): Promise<void> {
    // Retrieves the formatted mail options.
    const formattedMessageOptions = await this.getFormattedMailOptions(
      tenantId,
      paymentReceiveId,
      messageDTO
    );
    const mail = new Mail()
      .setSubject(formattedMessageOptions.subject)
      .setTo(formattedMessageOptions.to)
      .setCC(formattedMessageOptions.cc)
      .setBCC(formattedMessageOptions.bcc)
      .setContent(formattedMessageOptions.message);

    const eventPayload = {
      tenantId,
      paymentReceiveId,
      messageOptions: formattedMessageOptions,
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
