import { Inject, Injectable } from '@nestjs/common';
import { SETTINGS_PROVIDER } from './Settings.types';
import { SettingsStore } from './SettingsStore';
import { ServiceError } from '@/modules/Items/ServiceError';

export interface SmsNotificationMeta {
  key: string;
  notificationLabel: string;
  notificationDescription: string;
  module: string;
  moduleFormatted: string;
  defaultSmsMessage: string;
  allowedVariables: { variable: string; description: string }[];
}

export interface SmsNotificationDto {
  is_notification_enabled?: boolean;
  sms_message?: string;
  message_text?: string;
}

@Injectable()
export class SmsNotificationSettingsService {
  constructor(
    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,
  ) {}

  private readonly notifications: SmsNotificationMeta[] = [
    {
      key: 'sale-invoice-details',
      notificationLabel: 'Sale Invoice Details',
      notificationDescription:
        'Sent to the customer when a sale invoice is created.',
      module: 'Sales Invoices',
      moduleFormatted: 'Invoice',
      defaultSmsMessage:
        'Hi {CustomerName}, invoice {InvoiceNumber} is due on {DueDate}. Amount due: {DueAmount}. - {CompanyName}',
      allowedVariables: [
        { variable: 'InvoiceNumber', description: 'Invoice number' },
        { variable: 'ReferenceNumber', description: 'Reference number' },
        { variable: 'CustomerName', description: 'Customer name' },
        { variable: 'DueAmount', description: 'Due amount' },
        { variable: 'DueDate', description: 'Due date' },
        { variable: 'Amount', description: 'Invoice amount' },
        { variable: 'CompanyName', description: 'Company name' },
      ],
    },
    {
      key: 'sale-invoice-reminder',
      notificationLabel: 'Sale Invoice Reminder',
      notificationDescription: 'Sent to the customer as a payment reminder.',
      module: 'Sales Invoices',
      moduleFormatted: 'Invoice',
      defaultSmsMessage:
        'Reminder: Invoice {InvoiceNumber} is due on {DueDate}. Amount: {DueAmount}. - {CompanyName}',
      allowedVariables: [
        { variable: 'InvoiceNumber', description: 'Invoice number' },
        { variable: 'ReferenceNumber', description: 'Reference number' },
        { variable: 'CustomerName', description: 'Customer name' },
        { variable: 'DueAmount', description: 'Due amount' },
        { variable: 'DueDate', description: 'Due date' },
        { variable: 'Amount', description: 'Invoice amount' },
        { variable: 'CompanyName', description: 'Company name' },
      ],
    },
    {
      key: 'sale-estimate-details',
      notificationLabel: 'Sale Estimate Details',
      notificationDescription:
        'Sent to the customer when a sale estimate is created.',
      module: 'Sales Estimates',
      moduleFormatted: 'Estimate',
      defaultSmsMessage:
        'Hi {CustomerName}, estimate {EstimateNumber} for {Amount}. - {CompanyName}',
      allowedVariables: [
        { variable: 'EstimateNumber', description: 'Estimate number' },
        { variable: 'ReferenceNumber', description: 'Reference number' },
        { variable: 'EstimateDate', description: 'Estimate date' },
        { variable: 'ExpirationDate', description: 'Expiration date' },
        { variable: 'CustomerName', description: 'Customer name' },
        { variable: 'Amount', description: 'Estimate amount' },
        { variable: 'CompanyName', description: 'Company name' },
      ],
    },
    {
      key: 'sale-receipt-details',
      notificationLabel: 'Sale Receipt Details',
      notificationDescription:
        'Sent to the customer when a sale receipt is created.',
      module: 'Sales Receipts',
      moduleFormatted: 'Receipt',
      defaultSmsMessage:
        'Hi {CustomerName}, receipt {ReceiptNumber} for {Amount}. - {CompanyName}',
      allowedVariables: [
        { variable: 'ReceiptNumber', description: 'Receipt number' },
        { variable: 'ReferenceNumber', description: 'Reference number' },
        { variable: 'CustomerName', description: 'Customer name' },
        { variable: 'Amount', description: 'Receipt amount' },
        { variable: 'CompanyName', description: 'Company name' },
      ],
    },
    {
      key: 'payment-receive-details',
      notificationLabel: 'Payment Receive Details',
      notificationDescription:
        'Sent to the customer when a payment is received.',
      module: 'Payment Receives',
      moduleFormatted: 'Payment',
      defaultSmsMessage:
        'Hi {CustomerName}, payment {PaymentNumber} of {Amount} received. Invoices: {InvoiceNumber}. - {CompanyName}',
      allowedVariables: [
        { variable: 'Amount', description: 'Payment amount' },
        { variable: 'ReferenceNumber', description: 'Reference number' },
        { variable: 'CustomerName', description: 'Customer name' },
        { variable: 'PaymentNumber', description: 'Payment number' },
        { variable: 'InvoiceNumber', description: 'Invoice numbers' },
        { variable: 'CompanyName', description: 'Company name' },
      ],
    },
    {
      key: 'customer-balance',
      notificationLabel: 'Customer Balance',
      notificationDescription: 'Sent to the customer with the current balance.',
      module: 'Customers',
      moduleFormatted: 'Customer',
      defaultSmsMessage:
        'Hi {CustomerName}, your balance is {Balance}. - {CompanyName}',
      allowedVariables: [
        { variable: 'CustomerName', description: 'Customer name' },
        { variable: 'Balance', description: 'Customer balance' },
        { variable: 'CompanyName', description: 'Company name' },
      ],
    },
  ];

  /**
   * Retrieves all SMS notifications metadata with current settings values.
   * @returns {Promise<Record<string, unknown>[]>}
   */
  public async getSmsNotifications(): Promise<Record<string, unknown>[]> {
    const store = await this.settingsStore();

    return this.notifications.map((notification) =>
      this.toResponse(store, notification),
    );
  }

  /**
   * Retrieves a single SMS notification metadata with current settings values.
   * @param {string} key - Notification key.
   * @returns {Promise<Record<string, unknown>>}
   */
  public async getSmsNotification(
    key: string,
  ): Promise<Record<string, unknown>> {
    const store = await this.settingsStore();
    const notification = this.findNotification(key);
    return this.toResponse(store, notification);
  }

  /**
   * Edits the given SMS notification settings.
   * @param {string} key - Notification key.
   * @param {SmsNotificationDto} dto - Update DTO.
   * @returns {Promise<Record<string, unknown>>}
   */
  public async editSmsNotification(
    key: string,
    dto: SmsNotificationDto,
  ): Promise<Record<string, unknown>> {
    const store = await this.settingsStore();
    const notification = this.findNotification(key);

    const messageText =
      typeof dto.message_text === 'string' ? dto.message_text : dto.sms_message;

    if (typeof messageText === 'string') {
      this.validateSmsMessage(notification, messageText);
      store.set({
        group: 'sms-notification',
        key: `sms-message.${key}`,
        value: messageText,
      });
    }

    if (typeof dto.is_notification_enabled === 'boolean') {
      store.set({
        group: 'sms-notification',
        key: `sms-notification-enable.${key}`,
        value: dto.is_notification_enabled,
      });
    }

    await store.save();

    return this.toResponse(store, notification);
  }

  /**
   * Determines whether the given notification is enabled.
   * @param {string} key - Notification key.
   * @returns {Promise<boolean>}
   */
  public async isNotificationEnabled(key: string): Promise<boolean> {
    const store = await this.settingsStore();
    return store.get(
      { group: 'sms-notification', key: `sms-notification-enable.${key}` },
      false,
    ) as boolean;
  }

  /**
   * Retrieves the SMS message template for the given notification key.
   * @param {string} key - Notification key.
   * @returns {Promise<string>}
   */
  public async getSmsMessage(key: string): Promise<string> {
    const store = await this.settingsStore();
    const notification = this.findNotification(key);
    return store.get(
      { group: 'sms-notification', key: `sms-message.${key}` },
      notification.defaultSmsMessage,
    ) as string;
  }

  /**
   * Finds the notification metadata by key.
   */
  private findNotification(key: string): SmsNotificationMeta {
    const notification = this.notifications.find((n) => n.key === key);
    if (!notification) {
      throw new ServiceError(
        'SMS_NOTIFICATION_NOT_FOUND',
        `SMS notification ${key} not found.`,
      );
    }
    return notification;
  }

  /**
   * Validates the SMS message placeholders.
   */
  private validateSmsMessage(
    notification: SmsNotificationMeta,
    message: string,
  ): void {
    const matches = message.match(/\{([^{}]+)\}/g) || [];
    const allowedVariables = notification.allowedVariables.map(
      (v) => v.variable,
    );
    const unsupported = matches
      .map((match) => match.replace(/\{|\}/g, ''))
      .filter((variable) => !allowedVariables.includes(variable));

    if (unsupported.length > 0) {
      throw new ServiceError(
        'UNSUPPORTED_SMS_MESSAGE_VARIABLES',
        'The SMS message has unsupported variables.',
        { unsupported_args: unsupported },
      );
    }
  }

  /**
   * Converts notification metadata to response shape.
   */
  private toResponse(
    store: SettingsStore,
    notification: SmsNotificationMeta,
  ): Record<string, unknown> {
    const smsMessage = store.get(
      { group: 'sms-notification', key: `sms-message.${notification.key}` },
      notification.defaultSmsMessage,
    ) as string;

    const isEnabled = store.get(
      {
        group: 'sms-notification',
        key: `sms-notification-enable.${notification.key}`,
      },
      false,
    ) as boolean;

    return {
      key: notification.key,
      notification_label: notification.notificationLabel,
      notification_description: notification.notificationDescription,
      module: notification.module,
      module_formatted: notification.moduleFormatted,
      default_sms_message: notification.defaultSmsMessage,
      allowed_variables: notification.allowedVariables,
      sms_message: smsMessage,
      is_notification_enabled: isEnabled,
    };
  }
}
