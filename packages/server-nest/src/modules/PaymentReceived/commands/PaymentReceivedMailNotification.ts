import { Inject, Injectable } from '@nestjs/common';
import {
  DEFAULT_PAYMENT_MAIL_CONTENT,
  DEFAULT_PAYMENT_MAIL_SUBJECT,
} from '../constants';
import { transformPaymentReceivedToMailDataArgs } from '../utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ContactMailNotification } from '@/modules/MailNotification/ContactMailNotification';
import { PaymentReceived } from '../models/PaymentReceived';
import { GetPaymentReceivedService } from '../queries/GetPaymentReceived.service';
import { mergeAndValidateMailOptions } from '@/modules/MailNotification/utils';
import { PaymentReceiveMailOptsDTO } from '../types/PaymentReceived.types';
import { PaymentReceiveMailOpts } from '../types/PaymentReceived.types';
import { PaymentReceiveMailPresendEvent } from '../types/PaymentReceived.types';
import { SendInvoiceMailDTO } from '@/modules/SaleInvoices/SaleInvoice.types';
import { Mail } from '@/modules/Mail/Mail';
import { MailTransporter } from '@/modules/Mail/MailTransporter.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class SendPaymentReceiveMailNotification {
  constructor(
    private readonly getPaymentService: GetPaymentReceivedService,
    private readonly contactMailNotification: ContactMailNotification,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailTransport: MailTransporter,

    @Inject(PaymentReceived.name)
    private readonly paymentReceiveModel: TenantModelProxy<
      typeof PaymentReceived
    >,
  ) {}

  /**
   * Sends the mail of the given payment receive.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {PaymentReceiveMailOptsDTO} messageDTO
   * @returns {Promise<void>}
   */
  public async triggerMail(
    paymentReceiveId: number,
    messageDTO: PaymentReceiveMailOptsDTO,
  ): Promise<void> {
    const payload = {
      paymentReceiveId,
      messageDTO,
    };
    // await this.agenda.now('payment-receive-mail-send', payload);

    // Triggers `onPaymentReceivePreMailSend` event.
    await this.eventEmitter.emitAsync(events.paymentReceive.onPreMailSend, {
      paymentReceiveId,
      messageOptions: messageDTO,
    } as PaymentReceiveMailPresendEvent);
  }

  /**
   * Retrieves the default payment mail options.
   * @param {number} paymentReceiveId - Payment receive id.
   * @returns {Promise<PaymentReceiveMailOpts>}
   */
  public getMailOptions = async (
    paymentId: number,
  ): Promise<PaymentReceiveMailOpts> => {
    const paymentReceive = await this.paymentReceiveModel()
      .query()
      .findById(paymentId)
      .throwIfNotFound();

    const formatArgs = await this.textFormatter(paymentId);

    const mailOptions =
      await this.contactMailNotification.getDefaultMailOptions(
        paymentReceive.customerId,
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
   * @param {number} invoiceId - Sale invoice id.
   * @returns {Promise<Record<string, string>>}
   */
  public textFormatter = async (
    invoiceId: number,
  ): Promise<Record<string, string>> => {
    const payment = await this.getPaymentService.getPaymentReceive(invoiceId);
    return transformPaymentReceivedToMailDataArgs(payment);
  };

  /**
   * Retrieves the formatted mail options of the given payment receive.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @param {SendInvoiceMailDTO} messageDTO
   * @returns {Promise<PaymentReceiveMailOpts>}
   */
  public getFormattedMailOptions = async (
    paymentReceiveId: number,
    messageDTO: SendInvoiceMailDTO,
  ) => {
    const formatterArgs = await this.textFormatter(paymentReceiveId);

    // Default message options.
    const defaultMessageOpts = await this.getMailOptions(paymentReceiveId);
    // Parsed message opts with default options.
    const parsedMessageOpts = mergeAndValidateMailOptions(
      defaultMessageOpts,
      messageDTO,
    );
    // Formats the message options.
    return this.contactMailNotification.formatMailOptions(
      parsedMessageOpts,
      formatterArgs,
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
    paymentReceiveId: number,
    messageDTO: PaymentReceiveMailOptsDTO,
  ): Promise<void> {
    // Retrieves the formatted mail options.
    const formattedMessageOptions = await this.getFormattedMailOptions(
      paymentReceiveId,
      messageDTO,
    );
    const mail = new Mail()
      .setSubject(formattedMessageOptions.subject)
      .setTo(formattedMessageOptions.to)
      .setCC(formattedMessageOptions.cc)
      .setBCC(formattedMessageOptions.bcc)
      .setContent(formattedMessageOptions.message);

    const eventPayload = {
      paymentReceiveId,
      messageOptions: formattedMessageOptions,
    };
    // Triggers `onPaymentReceiveMailSend` event.
    await this.eventEmitter.emitAsync(
      events.paymentReceive.onMailSend,
      eventPayload,
    );
    await this.mailTransport.send(mail);

    // Triggers `onPaymentReceiveMailSent` event.
    await this.eventEmitter.emitAsync(
      events.paymentReceive.onMailSent,
      eventPayload,
    );
  }
}
