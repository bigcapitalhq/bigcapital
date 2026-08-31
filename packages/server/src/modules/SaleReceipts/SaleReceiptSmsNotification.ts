import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { SmsNotificationSettingsService } from '@/modules/Settings/SmsNotificationSettings.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { formatMessage } from '@/utils/format-message';
import { formatNumber } from '@/utils/format-number';
import { SMS_QUEUE, SMS_SEND_JOB } from '@/modules/SMS/SMS.constants';
import { SaleReceipt } from './models/SaleReceipt';
import { events } from '@/common/events/events';

type SaleReceiptWithCustomer = SaleReceipt & {
  customer: { displayName: string; personalPhone: string };
};

@Injectable()
export class SaleReceiptSmsNotification {
  constructor(
    @Inject(SaleReceipt.name)
    private readonly saleReceiptModel: TenantModelProxy<typeof SaleReceipt>,

    private readonly tenancyContext: TenancyContext,
    private readonly eventEmitter: EventEmitter2,
    private readonly smsNotificationSettings: SmsNotificationSettingsService,

    @InjectQueue(SMS_QUEUE)
    private readonly smsQueue: Queue,
  ) {}

  /**
   * Notify customer via SMS about the given sale receipt.
   * @param {number} saleReceiptId - Sale receipt id.
   * @returns {Promise<SaleReceipt>}
   */
  public async triggerSms(saleReceiptId: number): Promise<SaleReceipt> {
    const saleReceipt = (await this.saleReceiptModel()
      .query()
      .findById(saleReceiptId)
      .withGraphFetched('customer')
      .throwIfNotFound()) as SaleReceiptWithCustomer;

    this.validateCustomerPhoneNumber(saleReceipt.customer?.personalPhone);

    await this.eventEmitter.emitAsync(events.saleReceipt.onNotifySms, {
      saleReceiptId,
      saleReceipt,
    });

    const message = await this.formatReceiptMessage(saleReceipt);
    await this.enqueueSms(saleReceipt.customer.personalPhone, message);

    await this.eventEmitter.emitAsync(events.saleReceipt.onNotifiedSms, {
      saleReceiptId,
      saleReceipt,
    });

    return saleReceipt;
  }

  /**
   * Notify receipt details by SMS after receipt creation.
   * @param {number} saleReceiptId - Sale receipt id.
   * @returns {Promise<void>}
   */
  public async notifyDetailsBySmsAfterCreation(
    saleReceiptId: number,
  ): Promise<void> {
    const isEnabled = await this.smsNotificationSettings.isNotificationEnabled(
      'sale-receipt-details',
    );
    if (!isEnabled) return;

    await this.triggerSms(saleReceiptId);
  }

  /**
   * Retrieve the SMS details of the given sale receipt.
   * @param {number} saleReceiptId - Sale receipt id.
   * @returns {Promise<Record<string, string>>}
   */
  public async getSmsDetails(
    saleReceiptId: number,
  ): Promise<Record<string, string>> {
    const saleReceipt = (await this.saleReceiptModel()
      .query()
      .findById(saleReceiptId)
      .withGraphFetched('customer')
      .throwIfNotFound()) as SaleReceiptWithCustomer;

    const message = await this.formatReceiptMessage(saleReceipt);

    return {
      customerName: saleReceipt.customer.displayName,
      customerPhoneNumber: saleReceipt.customer.personalPhone,
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
   * Formats the receipt SMS message.
   */
  private async formatReceiptMessage(
    saleReceipt: SaleReceiptWithCustomer,
  ): Promise<string> {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const template = await this.smsNotificationSettings.getSmsMessage(
      'sale-receipt-details',
    );

    const amount = formatNumber(saleReceipt.amount, {
      currencyCode: saleReceipt.currencyCode,
    });

    return formatMessage(template, {
      ReceiptNumber: saleReceipt.receiptNumber,
      ReferenceNumber: saleReceipt.referenceNo,
      CustomerName: saleReceipt.customer.displayName,
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
