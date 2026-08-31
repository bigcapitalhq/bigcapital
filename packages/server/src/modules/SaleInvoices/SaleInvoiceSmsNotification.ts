import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as moment from 'moment';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { SmsNotificationSettingsService } from '@/modules/Settings/SmsNotificationSettings.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { formatMessage } from '@/utils/format-message';
import { formatNumber } from '@/utils/format-number';
import { SMS_QUEUE, SMS_SEND_JOB } from '@/modules/SMS/SMS.constants';
import { SaleInvoice } from './models/SaleInvoice';
import { events } from '@/common/events/events';

type SaleInvoiceWithCustomer = SaleInvoice & {
  customer: { displayName: string; personalPhone: string };
};

@Injectable()
export class SaleInvoiceSmsNotification {
  constructor(
    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,

    private readonly tenancyContext: TenancyContext,
    private readonly eventEmitter: EventEmitter2,
    private readonly smsNotificationSettings: SmsNotificationSettingsService,

    @InjectQueue(SMS_QUEUE)
    private readonly smsQueue: Queue,
  ) {}

  /**
   * Notify customer via SMS about the given sale invoice.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {'details' | 'reminder'} notificationType - Notification type.
   * @returns {Promise<SaleInvoice>}
   */
  public async triggerSms(
    saleInvoiceId: number,
    notificationType: 'details' | 'reminder',
  ): Promise<SaleInvoice> {
    const saleInvoice = (await this.saleInvoiceModel()
      .query()
      .findById(saleInvoiceId)
      .withGraphFetched('customer')
      .throwIfNotFound()) as SaleInvoiceWithCustomer;

    this.validateCustomerPhoneNumber(saleInvoice.customer?.personalPhone);

    const notificationKey = this.transformNotificationType(notificationType);

    await this.eventEmitter.emitAsync(events.saleInvoice.onNotifySms, {
      saleInvoiceId,
      saleInvoice,
    });

    const message = await this.formatInvoiceMessage(
      saleInvoice,
      notificationKey,
    );

    await this.enqueueSms(saleInvoice.customer.personalPhone, message);

    await this.eventEmitter.emitAsync(events.saleInvoice.onNotifiedSms, {
      saleInvoiceId,
      saleInvoice,
    });

    return saleInvoice;
  }

  /**
   * Notify invoice details by SMS after invoice creation.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @returns {Promise<void>}
   */
  public async notifyDetailsBySmsAfterCreation(
    saleInvoiceId: number,
  ): Promise<void> {
    const isEnabled = await this.smsNotificationSettings.isNotificationEnabled(
      'sale-invoice-details',
    );
    if (!isEnabled) return;

    await this.triggerSms(saleInvoiceId, 'details');
  }

  /**
   * Retrieve the SMS details of the given invoice.
   * @param {number} saleInvoiceId - Sale invoice id.
   * @param {'details' | 'reminder'} notificationType - Notification type.
   * @returns {Promise<Record<string, string>>}
   */
  public async getSmsDetails(
    saleInvoiceId: number,
    notificationType: 'details' | 'reminder',
  ): Promise<Record<string, string>> {
    const saleInvoice = (await this.saleInvoiceModel()
      .query()
      .findById(saleInvoiceId)
      .withGraphFetched('customer')
      .throwIfNotFound()) as SaleInvoiceWithCustomer;

    const notificationKey = this.transformNotificationType(notificationType);
    const message = await this.formatInvoiceMessage(
      saleInvoice,
      notificationKey,
    );

    return {
      customerName: saleInvoice.customer.displayName,
      customerPhoneNumber: saleInvoice.customer.personalPhone,
      smsMessage: message,
    };
  }

  /**
   * Validates the customer phone number.
   */
  private validateCustomerPhoneNumber(phone?: string): void {
    if (!phone || phone.trim().length === 0) {
      throw new ServiceError(
        'CUSTOMER_HAS_NO_PHONE_NUMBER',
        'The customer does not have a personal phone number.',
      );
    }
  }

  /**
   * Transformes the invoice notification type to SMS notification key.
   */
  private transformNotificationType(
    notificationType: 'details' | 'reminder',
  ): string {
    return notificationType === 'reminder'
      ? 'sale-invoice-reminder'
      : 'sale-invoice-details';
  }

  /**
   * Formats the invoice SMS message.
   */
  private async formatInvoiceMessage(
    saleInvoice: SaleInvoiceWithCustomer,
    notificationKey: string,
  ): Promise<string> {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const template =
      await this.smsNotificationSettings.getSmsMessage(notificationKey);

    const dueAmount = formatNumber(saleInvoice.dueAmount, {
      currencyCode: saleInvoice.currencyCode,
    });
    const amount = formatNumber(saleInvoice.balance, {
      currencyCode: saleInvoice.currencyCode,
    });

    return formatMessage(template, {
      InvoiceNumber: saleInvoice.invoiceNo,
      ReferenceNumber: saleInvoice.referenceNo,
      CustomerName: saleInvoice.customer.displayName,
      DueAmount: dueAmount,
      DueDate: moment(saleInvoice.dueDate).format('YYYY/MM/DD'),
      Amount: amount,
      CompanyName: tenantMetadata.name,
    });
  }

  /**
   * Enqueues the SMS job.
   */
  private async enqueueSms(to: string, body: string): Promise<void> {
    const tenant = await this.tenancyContext.getTenant();
    const user = await this.tenancyContext.getSystemUser();

    await this.smsQueue.add(SMS_SEND_JOB, {
      to,
      body,
      organizationId: tenant.organizationId,
      userId: user.id,
    });
  }
}
