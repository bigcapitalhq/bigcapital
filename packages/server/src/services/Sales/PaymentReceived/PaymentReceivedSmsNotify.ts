import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import {
  IPaymentReceivedSmsDetails,
  SMS_NOTIFICATION_KEY,
  IPaymentReceived,
  IPaymentReceivedEntry,
} from '@/interfaces';
import SmsNotificationsSettingsService from '@/services/Settings/SmsNotificationsSettings';
import { formatNumber, formatSmsMessage } from 'utils';
import { TenantMetadata } from '@/system/models';
import SaleNotifyBySms from '../SaleNotifyBySms';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import { PaymentReceivedValidators } from './PaymentReceivedValidators';

@Service()
export class PaymentReceiveNotifyBySms {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private smsNotificationsSettings: SmsNotificationsSettingsService;

  @Inject()
  private saleSmsNotification: SaleNotifyBySms;

  @Inject()
  private validators: PaymentReceivedValidators;

  /**
   * Notify customer via sms about payment receive details.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveid - Payment receive id.
   */
  public async notifyBySms(tenantId: number, paymentReceiveid: number) {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    // Retrieve the payment receive or throw not found service error.
    const paymentReceive = await PaymentReceive.query()
      .findById(paymentReceiveid)
      .withGraphFetched('customer')
      .withGraphFetched('entries.invoice');

    // Validates the payment existance.
    this.validators.validatePaymentExistance(paymentReceive);

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
   * @param {IPaymentReceived} paymentReceive
   * @param {ICustomer} customer
   */
  private sendSmsNotification = async (
    tenantId: number,
    paymentReceive: IPaymentReceived
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
   * @param {IPaymentReceived} payment -
   * @param {ICustomer} customer -
   */
  private formattedPaymentDetailsMessage = (
    tenantId: number,
    payment: IPaymentReceived,
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
   * Formattes the payment details sms notification messafge.
   * @param {string} smsMessage
   * @param {IPaymentReceived} payment
   * @param {ICustomer} customer
   * @param {TenantMetadata} tenantMetadata
   * @returns {string}
   */
  private formatPaymentDetailsMessage = (
    smsMessage: string,
    payment: IPaymentReceived,
    tenantMetadata: any
  ): string => {
    const invoiceNumbers = this.stringifyPaymentInvoicesNumber(payment);

    // Formattes the payment number variable.
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
   * @param {IPaymentReceived} payment
   * @returns {string}
   */
  private stringifyPaymentInvoicesNumber(payment: IPaymentReceived) {
    const invoicesNumberes = payment.entries.map(
      (entry: IPaymentReceivedEntry) => entry.invoice.invoiceNo
    );
    return invoicesNumberes.join(', ');
  }

  /**
   * Retrieve the SMS details of the given invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} paymentReceiveid - Payment receive id.
   */
  public smsDetails = async (
    tenantId: number,
    paymentReceiveid: number
  ): Promise<IPaymentReceivedSmsDetails> => {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    // Retrieve the payment receive or throw not found service error.
    const paymentReceive = await PaymentReceive.query()
      .findById(paymentReceiveid)
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
