import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import SMSClient from '@/services/SMSClient';
import {
  IPaymentReceiveSmsDetails,
  SMS_NOTIFICATION_KEY,
  IPaymentReceive,
  IPaymentReceiveEntry,
} from '@/interfaces';
import PaymentReceiveService from './PaymentsReceives';
import SmsNotificationsSettingsService from '@/services/Settings/SmsNotificationsSettings';
import { formatNumber, formatSmsMessage } from 'utils';
import { TenantMetadata } from '@/system/models';
import SaleNotifyBySms from '../SaleNotifyBySms';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

@Service()
export default class PaymentReceiveNotifyBySms {
  @Inject()
  paymentReceiveService: PaymentReceiveService;

  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  smsNotificationsSettings: SmsNotificationsSettingsService;

  @Inject()
  saleSmsNotification: SaleNotifyBySms;

  /**
   * Notify customer via sms about payment receive details.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceived - Payment receive id.
   */
  public async notifyBySms(tenantId: number, paymentReceived: number) {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    // Retrieve the payment receive or throw not found service error.
    const paymentReceive = await PaymentReceive.query()
      .findById(paymentReceived)
      .withGraphFetched('customer')
      .withGraphFetched('entries.invoice');

    // Validate the customer phone number.
    this.saleSmsNotification.validateCustomerPhoneNumber(
      paymentReceive.customer.personalPhone
    );
    // Triggers `onPaymentReceiveNotifySms` event.
    await this.eventPublisher.emitAsync(events.paymentReceive.onNotifySms, {
      tenantId,
      paymentReceive,
    });
    // Sends the payment receive sms notification to the given customer.
    await this.sendSmsNotification(tenantId, paymentReceive);

    // Triggers `onPaymentReceiveNotifiedSms` event.
    await this.eventPublisher.emitAsync(events.paymentReceive.onNotifiedSms, {
      tenantId,
      paymentReceive,
    });
    return paymentReceive;
  }

  /**
   * Sends the payment details sms notification of the given customer.
   * @param {number} tenantId
   * @param {IPaymentReceive} paymentReceive
   * @param {ICustomer} customer
   */
  private sendSmsNotification = async (
    tenantId: number,
    paymentReceive: IPaymentReceive
  ) => {
    const smsClient = this.tenancy.smsClient(tenantId);
    const tenantMetadata = await TenantMetadata.query().findOne({ tenantId });

    // Retrieve the formatted payment details sms notification message.
    const message = this.formattedPaymentDetailsMessage(
      tenantId,
      paymentReceive,
      tenantMetadata
    );
    // The target phone number.
    const phoneNumber = paymentReceive.customer.personalPhone;

    await smsClient.sendMessageJob(phoneNumber, message);
  };

  /**
   * Notify via SMS message after payment transaction creation.
   * @param {number} tenantId
   * @param {number} paymentReceiveId
   * @returns {Promise<void>}
   */
  public notifyViaSmsNotificationAfterCreation = async (
    tenantId: number,
    paymentReceiveId: number
  ): Promise<void> => {
    const notification = this.smsNotificationsSettings.getSmsNotificationMeta(
      tenantId,
      SMS_NOTIFICATION_KEY.PAYMENT_RECEIVE_DETAILS
    );
    // Can't continue if the sms auto-notification is not enabled.
    if (!notification.isNotificationEnabled) return;

    await this.notifyBySms(tenantId, paymentReceiveId);
  };

  /**
   * Formates the payment receive details sms message.
   * @param {number} tenantId -
   * @param {IPaymentReceive} payment -
   * @param {ICustomer} customer -
   */
  private formattedPaymentDetailsMessage = (
    tenantId: number,
    payment: IPaymentReceive,
    tenantMetadata: TenantMetadata
  ) => {
    const notification = this.smsNotificationsSettings.getSmsNotificationMeta(
      tenantId,
      SMS_NOTIFICATION_KEY.PAYMENT_RECEIVE_DETAILS
    );
    return this.formatPaymentDetailsMessage(
      notification.smsMessage,
      payment,
      tenantMetadata
    );
  };

  /**
   * Formats the payment details sms notification message.
   * @param {string} smsMessage
   * @param {IPaymentReceive} payment
   * @param {ICustomer} customer
   * @param {TenantMetadata} tenantMetadata
   * @returns {string}
   */
  private formatPaymentDetailsMessage = (
    smsMessage: string,
    payment: IPaymentReceive,
    tenantMetadata: any
  ): string => {
    const invoiceNumbers = this.stringifyPaymentInvoicesNumber(payment);

    // Formats the payment number variable.
    const formattedPaymentNumber = formatNumber(payment.amount, {
      currencyCode: payment.currencyCode,
    });

    return formatSmsMessage(smsMessage, {
      Amount: formattedPaymentNumber,
      ReferenceNumber: payment.referenceNo,
      CustomerName: payment.customer.displayName,
      PaymentNumber: payment.paymentReceiveNo,
      InvoiceNumber: invoiceNumbers,
      CompanyName: tenantMetadata.name,
    });
  };

  /**
   * Stringify payment receive invoices to numbers as string.
   * @param {IPaymentReceive} payment
   * @returns {string}
   */
  private stringifyPaymentInvoicesNumber(payment: IPaymentReceive) {
    const invoicesNumbers = payment.entries.map(
      (entry: IPaymentReceiveEntry) => entry.invoice.invoiceNo
    );
    return invoicesNumbers.join(', ');
  }

  /**
   * Retrieve the SMS details of the given invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceived - Payment receive id.
   */
  public smsDetails = async (
    tenantId: number,
    paymentReceived: number
  ): Promise<IPaymentReceiveSmsDetails> => {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    // Retrieve the payment receive or throw not found service error.
    const paymentReceive = await PaymentReceive.query()
      .findById(paymentReceived)
      .withGraphFetched('customer')
      .withGraphFetched('entries.invoice');

    // Current tenant metadata.
    const tenantMetadata = await TenantMetadata.query().findOne({ tenantId });

    // Retrieve the formatted sms message of payment receive details.
    const smsMessage = this.formattedPaymentDetailsMessage(
      tenantId,
      paymentReceive,
      tenantMetadata
    );

    return {
      customerName: paymentReceive.customer.displayName,
      customerPhoneNumber: paymentReceive.customer.personalPhone,
      smsMessage,
    };
  };
}
