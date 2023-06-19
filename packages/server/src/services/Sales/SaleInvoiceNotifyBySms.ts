import { Service, Inject } from 'typedi';
import moment from 'moment';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import SaleInvoicesService from './SalesInvoices';
import SMSClient from '@/services/SMSClient';
import {
  ISaleInvoice,
  ISaleInvoiceSmsDetailsDTO,
  ISaleInvoiceSmsDetails,
  SMS_NOTIFICATION_KEY,
  InvoiceNotificationType,
  ICustomer,
} from '@/interfaces';
import SmsNotificationsSettingsService from '@/services/Settings/SmsNotificationsSettings';
import { formatSmsMessage, formatNumber } from 'utils';
import { TenantMetadata } from '@/system/models';
import SaleNotifyBySms from './SaleNotifyBySms';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

@Service()
export default class SaleInvoiceNotifyBySms {
  @Inject()
  invoiceService: SaleInvoicesService;

  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  smsNotificationsSettings: SmsNotificationsSettingsService;

  @Inject()
  saleSmsNotification: SaleNotifyBySms;

  /**
   * Notify customer via sms about sale invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} saleInvoiceId - Sale invoice id.
   */
  public notifyBySms = async (
    tenantId: number,
    saleInvoiceId: number,
    invoiceNotificationType: InvoiceNotificationType
  ) => {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Retrieve the sale invoice or throw not found service error.
    const saleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphFetched('customer');

    // Validate the customer phone number existence and number validation.
    this.saleSmsNotification.validateCustomerPhoneNumber(
      saleInvoice.customer.personalPhone
    );
    // Transformes the invoice notification key to sms notification key.
    const notificationKey = this.transformDTOKeyToNotificationKey(
      invoiceNotificationType
    );
    // Triggers `onSaleInvoiceNotifySms` event.
    await this.eventPublisher.emitAsync(events.saleInvoice.onNotifySms, {
      tenantId,
      saleInvoice,
    });
    // Formats the sms message and sends sms notification.
    await this.sendSmsNotification(tenantId, notificationKey, saleInvoice);

    // Triggers `onSaleInvoiceNotifySms` event.
    await this.eventPublisher.emitAsync(events.saleInvoice.onNotifiedSms, {
      tenantId,
      saleInvoice,
    });
    return saleInvoice;
  };

  /**
   * Notify invoice details by sms notification after invoice creation.
   * @param {number} tenantId
   * @param {number} saleInvoiceId
   * @returns {Promise<void>}
   */
  public notifyDetailsBySmsAfterCreation = async (
    tenantId: number,
    saleInvoiceId: number
  ): Promise<void> => {
    const notification = this.smsNotificationsSettings.getSmsNotificationMeta(
      tenantId,
      SMS_NOTIFICATION_KEY.SALE_INVOICE_DETAILS
    );
    // Can't continue if the sms auto-notification is not enabled.
    if (!notification.isNotificationEnabled) return;

    await this.notifyBySms(tenantId, saleInvoiceId, 'details');
  };

  /**
   * Sends SMS notification.
   * @param {ISaleInvoice} invoice
   * @param {ICustomer} customer
   * @returns {Promise<void>}
   */
  private sendSmsNotification = async (
    tenantId: number,
    notificationType:
      | SMS_NOTIFICATION_KEY.SALE_INVOICE_DETAILS
      | SMS_NOTIFICATION_KEY.SALE_INVOICE_REMINDER,
    invoice: ISaleInvoice & { customer: ICustomer }
  ): Promise<void> => {
    const smsClient = this.tenancy.smsClient(tenantId);
    const tenantMetadata = await TenantMetadata.query().findOne({ tenantId });

    // Formates the given sms message.
    const message = this.formattedInvoiceDetailsMessage(
      tenantId,
      notificationType,
      invoice,
      tenantMetadata
    );
    const phoneNumber = invoice.customer.personalPhone;

    // Run the send sms notification message job.
    await smsClient.sendMessageJob(phoneNumber, message);
  };

  /**
   * Formates the invoice details sms message.
   * @param {number} tenantId
   * @param {ISaleInvoice} invoice
   * @param {ICustomer} customer
   * @returns {string}
   */
  private formattedInvoiceDetailsMessage = (
    tenantId: number,
    notificationKey:
      | SMS_NOTIFICATION_KEY.SALE_INVOICE_DETAILS
      | SMS_NOTIFICATION_KEY.SALE_INVOICE_REMINDER,
    invoice: ISaleInvoice,
    tenantMetadata: TenantMetadata
  ): string => {
    const notification = this.smsNotificationsSettings.getSmsNotificationMeta(
      tenantId,
      notificationKey
    );
    return this.formatInvoiceDetailsMessage(
      notification.smsMessage,
      invoice,
      tenantMetadata
    );
  };

  /**
   * Formattees the given invoice details sms message.
   * @param {string} smsMessage
   * @param {ISaleInvoice} invoice
   * @param {ICustomer} customer
   * @param {TenantMetadata} tenantMetadata
   */
  private formatInvoiceDetailsMessage = (
    smsMessage: string,
    invoice: ISaleInvoice & { customer: ICustomer },
    tenantMetadata: TenantMetadata
  ) => {
    const formattedDueAmount = formatNumber(invoice.dueAmount, {
      currencyCode: invoice.currencyCode,
    });
    const formattedAmount = formatNumber(invoice.balance, {
      currencyCode: invoice.currencyCode,
    });

    return formatSmsMessage(smsMessage, {
      InvoiceNumber: invoice.invoiceNo,
      ReferenceNumber: invoice.referenceNo,
      CustomerName: invoice.customer.displayName,
      DueAmount: formattedDueAmount,
      DueDate: moment(invoice.dueDate).format('YYYY/MM/DD'),
      Amount: formattedAmount,
      CompanyName: tenantMetadata.name,
    });
  };

  /**
   * Retrieve the SMS details of the given invoice.
   * @param {number} tenantId - Tenant id.
   * @param {number} saleInvoiceId - Sale invoice id.
   */
  public smsDetails = async (
    tenantId: number,
    saleInvoiceId: number,
    invoiceSmsDetailsDTO: ISaleInvoiceSmsDetailsDTO
  ): Promise<ISaleInvoiceSmsDetails> => {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Retrieve the sale invoice or throw not found service error.
    const saleInvoice = await SaleInvoice.query()
      .findById(saleInvoiceId)
      .withGraphFetched('customer');

    // Validates the sale invoice existence.
    this.validateSaleInvoiceExistence(saleInvoice);

    // Current tenant metadata.
    const tenantMetadata = await TenantMetadata.query().findOne({ tenantId });

    // Transformes the invoice notification key to sms notification key.
    const notificationKey = this.transformDTOKeyToNotificationKey(
      invoiceSmsDetailsDTO.notificationKey
    );
    // Formates the given sms message.
    const smsMessage = this.formattedInvoiceDetailsMessage(
      tenantId,
      notificationKey,
      saleInvoice,
      tenantMetadata
    );

    return {
      customerName: saleInvoice.customer.displayName,
      customerPhoneNumber: saleInvoice.customer.personalPhone,
      smsMessage,
    };
  };

  /**
   * Transformes the invoice notification key DTO to notification key.
   * @param {string} invoiceNotifKey
   * @returns {SMS_NOTIFICATION_KEY.SALE_INVOICE_DETAILS
   *   | SMS_NOTIFICATION_KEY.SALE_INVOICE_REMINDER}
   */
  private transformDTOKeyToNotificationKey = (
    invoiceNotifKey: string
  ):
    | SMS_NOTIFICATION_KEY.SALE_INVOICE_DETAILS
    | SMS_NOTIFICATION_KEY.SALE_INVOICE_REMINDER => {
    const invoiceNotifKeyPairs = {
      details: SMS_NOTIFICATION_KEY.SALE_INVOICE_DETAILS,
      reminder: SMS_NOTIFICATION_KEY.SALE_INVOICE_REMINDER,
    };
    return (
      invoiceNotifKeyPairs[invoiceNotifKey] ||
      SMS_NOTIFICATION_KEY.SALE_INVOICE_DETAILS
    );
  };

  /**
   * Validates the sale invoice existence.
   * @param {ISaleInvoice|null} saleInvoice
   */
  private validateSaleInvoiceExistence(saleInvoice: ISaleInvoice | null) {
    if (!saleInvoice) {
      throw new ServiceError(ERRORS.SALE_INVOICE_NOT_FOUND);
    }
  }
}
