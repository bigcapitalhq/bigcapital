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
import { PaymentReceived } from './models/PaymentReceived';
import { PaymentReceivedEntry } from './models/PaymentReceivedEntry';
import { events } from '@/common/events/events';

type PaymentReceivedWithCustomer = PaymentReceived & {
  customer: { displayName: string; personalPhone: string };
  entries: Array<PaymentReceivedEntry & { invoice?: { invoiceNo: string } }>;
};

@Injectable()
export class PaymentReceivedSmsNotification {
  constructor(
    @Inject(PaymentReceived.name)
    private readonly paymentReceivedModel: TenantModelProxy<
      typeof PaymentReceived
    >,

    private readonly tenancyContext: TenancyContext,
    private readonly eventEmitter: EventEmitter2,
    private readonly smsNotificationSettings: SmsNotificationSettingsService,

    @InjectQueue(SMS_QUEUE)
    private readonly smsQueue: Queue,
  ) {}

  /**
   * Notify customer via SMS about the given payment received.
   * @param {number} paymentReceiveId - Payment receive id.
   * @returns {Promise<PaymentReceived>}
   */
  public async triggerSms(paymentReceiveId: number): Promise<PaymentReceived> {
    const paymentReceive = (await this.paymentReceivedModel()
      .query()
      .findById(paymentReceiveId)
      .withGraphFetched('customer')
      .withGraphFetched('entries.invoice')
      .throwIfNotFound()) as PaymentReceivedWithCustomer;

    this.validateCustomerPhoneNumber(paymentReceive.customer?.personalPhone);

    await this.eventEmitter.emitAsync(events.paymentReceive.onNotifySms, {
      paymentReceiveId,
      paymentReceive,
    });

    const message = await this.formatPaymentMessage(paymentReceive);
    await this.enqueueSms(paymentReceive.customer.personalPhone, message);

    await this.eventEmitter.emitAsync(events.paymentReceive.onNotifiedSms, {
      paymentReceiveId,
      paymentReceive,
    });

    return paymentReceive;
  }

  /**
   * Notify payment receive details by SMS after creation.
   * @param {number} paymentReceiveId - Payment receive id.
   * @returns {Promise<void>}
   */
  public async notifyDetailsBySmsAfterCreation(
    paymentReceiveId: number,
  ): Promise<void> {
    const isEnabled = await this.smsNotificationSettings.isNotificationEnabled(
      'payment-receive-details',
    );
    if (!isEnabled) return;

    await this.triggerSms(paymentReceiveId);
  }

  /**
   * Retrieve the SMS details of the given payment received.
   * @param {number} paymentReceiveId - Payment receive id.
   * @returns {Promise<Record<string, string>>}
   */
  public async getSmsDetails(
    paymentReceiveId: number,
  ): Promise<Record<string, string>> {
    const paymentReceive = (await this.paymentReceivedModel()
      .query()
      .findById(paymentReceiveId)
      .withGraphFetched('customer')
      .withGraphFetched('entries.invoice')
      .throwIfNotFound()) as PaymentReceivedWithCustomer;

    const message = await this.formatPaymentMessage(paymentReceive);

    return {
      customerName: paymentReceive.customer.displayName,
      customerPhoneNumber: paymentReceive.customer.personalPhone,
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
   * Formats the payment received SMS message.
   */
  private async formatPaymentMessage(
    paymentReceive: PaymentReceivedWithCustomer,
  ): Promise<string> {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const template = await this.smsNotificationSettings.getSmsMessage(
      'payment-receive-details',
    );

    const amount = formatNumber(paymentReceive.amount, {
      currencyCode: paymentReceive.currencyCode,
    });

    const invoiceNumbers = paymentReceive.entries
      .map((entry) => entry.invoice?.invoiceNo)
      .filter(Boolean)
      .join(', ');

    return formatMessage(template, {
      Amount: amount,
      ReferenceNumber: paymentReceive.referenceNo,
      CustomerName: paymentReceive.customer.displayName,
      PaymentNumber: paymentReceive.paymentReceiveNo,
      InvoiceNumber: invoiceNumbers,
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
