import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import events from '@/subscribers/events';
import SMSClient from '@/services/SMSClient';
import {
  ISaleReceiptSmsDetails,
  ISaleReceipt,
  SMS_NOTIFICATION_KEY,
  ICustomer,
} from '@/interfaces';
import SalesReceiptService from './SalesReceipts';
import SmsNotificationsSettingsService from '@/services/Settings/SmsNotificationsSettings';
import { formatNumber, formatSmsMessage } from 'utils';
import { TenantMetadata } from '@/system/models';
import SaleNotifyBySms from './SaleNotifyBySms';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './Receipts/constants';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

@Service()
export default class SaleReceiptNotifyBySms {
  @Inject()
  receiptsService: SalesReceiptService;

  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  smsNotificationsSettings: SmsNotificationsSettingsService;

  @Inject()
  saleSmsNotification: SaleNotifyBySms;

  /**
   * Notify customer via sms about sale receipt.
   * @param {number} tenantId - Tenant id.
   * @param {number} saleReceiptId - Sale receipt id.
   */
  public async notifyBySms(tenantId: number, saleReceiptId: number) {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    // Retrieve the sale receipt or throw not found service error.
    const saleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('customer');

    // Validates the receipt receipt existence.
    this.validateSaleReceiptExistence(saleReceipt);

    // Validate the customer phone number.
    this.saleSmsNotification.validateCustomerPhoneNumber(
      saleReceipt.customer.personalPhone
    );
    // Triggers `onSaleReceiptNotifySms` event.
    await this.eventPublisher.emitAsync(events.saleReceipt.onNotifySms, {
      tenantId,
      saleReceipt,
    });
    // Sends the payment receive sms notification to the given customer.
    await this.sendSmsNotification(tenantId, saleReceipt);

    // Triggers `onSaleReceiptNotifiedSms` event.
    await this.eventPublisher.emitAsync(events.saleReceipt.onNotifiedSms, {
      tenantId,
      saleReceipt,
    });
    return saleReceipt;
  }

  /**
   * Sends SMS notification.
   * @param {ISaleReceipt} invoice
   * @param {ICustomer} customer
   * @returns
   */
  public sendSmsNotification = async (
    tenantId: number,
    saleReceipt: ISaleReceipt & { customer: ICustomer }
  ) => {
    const smsClient = this.tenancy.smsClient(tenantId);
    const tenantMetadata = await TenantMetadata.query().findOne({ tenantId });

    // Retrieve formatted sms notification message of receipt details.
    const formattedSmsMessage = this.formattedReceiptDetailsMessage(
      tenantId,
      saleReceipt,
      tenantMetadata
    );
    const phoneNumber = saleReceipt.customer.personalPhone;

    // Run the send sms notification message job.
    return smsClient.sendMessageJob(phoneNumber, formattedSmsMessage);
  };

  /**
   * Notify via SMS message after receipt creation.
   * @param {number} tenantId
   * @param {number} receiptId
   * @returns {Promise<void>}
   */
  public notifyViaSmsAfterCreation = async (
    tenantId: number,
    receiptId: number
  ): Promise<void> => {
    const notification = this.smsNotificationsSettings.getSmsNotificationMeta(
      tenantId,
      SMS_NOTIFICATION_KEY.SALE_RECEIPT_DETAILS
    );
    // Can't continue if the sms auto-notification is not enabled.
    if (!notification.isNotificationEnabled) return;

    await this.notifyBySms(tenantId, receiptId);
  };

  /**
   * Retrieve the formatted sms notification message of the given sale receipt.
   * @param {number} tenantId
   * @param {ISaleReceipt} saleReceipt
   * @param {TenantMetadata} tenantMetadata
   * @returns {string}
   */
  private formattedReceiptDetailsMessage = (
    tenantId: number,
    saleReceipt: ISaleReceipt & { customer: ICustomer },
    tenantMetadata: TenantMetadata
  ): string => {
    const notification = this.smsNotificationsSettings.getSmsNotificationMeta(
      tenantId,
      SMS_NOTIFICATION_KEY.SALE_RECEIPT_DETAILS
    );
    return this.formatReceiptDetailsMessage(
      notification.smsMessage,
      saleReceipt,
      tenantMetadata
    );
  };

  /**
   * Formats the receipt sms notification message.
   * @param {string} smsMessage
   * @param {ISaleReceipt} saleReceipt
   * @param {TenantMetadata} tenantMetadata
   * @returns {string}
   */
  private formatReceiptDetailsMessage = (
    smsMessage: string,
    saleReceipt: ISaleReceipt & { customer: ICustomer },
    tenantMetadata: TenantMetadata
  ): string => {
    // Format the receipt amount.
    const formattedAmount = formatNumber(saleReceipt.amount, {
      currencyCode: saleReceipt.currencyCode,
    });

    return formatSmsMessage(smsMessage, {
      ReceiptNumber: saleReceipt.receiptNumber,
      ReferenceNumber: saleReceipt.referenceNo,
      CustomerName: saleReceipt.customer.displayName,
      Amount: formattedAmount,
      CompanyName: tenantMetadata.name,
    });
  };

  /**
   * Retrieve the SMS details of the given invoice.
   * @param {number} tenantId -
   * @param {number} saleReceiptId - Sale receipt id.
   */
  public smsDetails = async (
    tenantId: number,
    saleReceiptId: number
  ): Promise<ISaleReceiptSmsDetails> => {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    // Retrieve the sale receipt or throw not found service error.
    const saleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .withGraphFetched('customer');

    // Validates the receipt receipt existence.
    this.validateSaleReceiptExistence(saleReceipt);

    // Current tenant metadata.
    const tenantMetadata = await TenantMetadata.query().findOne({ tenantId });

    // Retrieve the sale receipt formatted sms notification message.
    const formattedSmsMessage = this.formattedReceiptDetailsMessage(
      tenantId,
      saleReceipt,
      tenantMetadata
    );
    return {
      customerName: saleReceipt.customer.displayName,
      customerPhoneNumber: saleReceipt.customer.personalPhone,
      smsMessage: formattedSmsMessage,
    };
  };

  /**
   * Validates the receipt receipt existence.
   * @param {ISaleReceipt|null} saleReceipt
   */
  private validateSaleReceiptExistence(saleReceipt: ISaleReceipt | null) {
    if (!saleReceipt) {
      throw new ServiceError(ERRORS.SALE_RECEIPT_NOT_FOUND);
    }
  }
}
