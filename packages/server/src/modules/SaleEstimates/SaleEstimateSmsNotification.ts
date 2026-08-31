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
import { SaleEstimate } from './models/SaleEstimate';
import { events } from '@/common/events/events';

type SaleEstimateWithCustomer = SaleEstimate & {
  customer: { displayName: string; personalPhone: string };
};

@Injectable()
export class SaleEstimateSmsNotification {
  constructor(
    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: TenantModelProxy<typeof SaleEstimate>,

    private readonly tenancyContext: TenancyContext,
    private readonly eventEmitter: EventEmitter2,
    private readonly smsNotificationSettings: SmsNotificationSettingsService,

    @InjectQueue(SMS_QUEUE)
    private readonly smsQueue: Queue,
  ) {}

  /**
   * Notify customer via SMS about the given sale estimate.
   * @param {number} saleEstimateId - Sale estimate id.
   * @returns {Promise<SaleEstimate>}
   */
  public async triggerSms(saleEstimateId: number): Promise<SaleEstimate> {
    const saleEstimate = (await this.saleEstimateModel()
      .query()
      .findById(saleEstimateId)
      .withGraphFetched('customer')
      .throwIfNotFound()) as SaleEstimateWithCustomer;

    this.validateCustomerPhoneNumber(saleEstimate.customer?.personalPhone);

    await this.eventEmitter.emitAsync(events.saleEstimate.onNotifySms, {
      saleEstimateId,
      saleEstimate,
    });

    const message = await this.formatEstimateMessage(saleEstimate);
    await this.enqueueSms(saleEstimate.customer.personalPhone, message);

    await this.eventEmitter.emitAsync(events.saleEstimate.onNotifiedSms, {
      saleEstimateId,
      saleEstimate,
    });

    return saleEstimate;
  }

  /**
   * Notify estimate details by SMS after estimate creation.
   * @param {number} saleEstimateId - Sale estimate id.
   * @returns {Promise<void>}
   */
  public async notifyDetailsBySmsAfterCreation(
    saleEstimateId: number,
  ): Promise<void> {
    const isEnabled = await this.smsNotificationSettings.isNotificationEnabled(
      'sale-estimate-details',
    );
    if (!isEnabled) return;

    await this.triggerSms(saleEstimateId);
  }

  /**
   * Retrieve the SMS details of the given sale estimate.
   * @param {number} saleEstimateId - Sale estimate id.
   * @returns {Promise<Record<string, string>>}
   */
  public async getSmsDetails(
    saleEstimateId: number,
  ): Promise<Record<string, string>> {
    const saleEstimate = (await this.saleEstimateModel()
      .query()
      .findById(saleEstimateId)
      .withGraphFetched('customer')
      .throwIfNotFound()) as SaleEstimateWithCustomer;

    const message = await this.formatEstimateMessage(saleEstimate);

    return {
      customerName: saleEstimate.customer.displayName,
      customerPhoneNumber: saleEstimate.customer.personalPhone,
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
   * Formats the estimate SMS message.
   */
  private async formatEstimateMessage(
    saleEstimate: SaleEstimateWithCustomer,
  ): Promise<string> {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();
    const template = await this.smsNotificationSettings.getSmsMessage(
      'sale-estimate-details',
    );

    const amount = formatNumber(saleEstimate.amount, {
      currencyCode: saleEstimate.currencyCode,
    });

    return formatMessage(template, {
      EstimateNumber: saleEstimate.estimateNumber,
      ReferenceNumber: saleEstimate.reference,
      EstimateDate: moment(saleEstimate.estimateDate).format('YYYY/MM/DD'),
      ExpirationDate: saleEstimate.expirationDate
        ? moment(saleEstimate.expirationDate).format('YYYY/MM/DD')
        : '',
      CustomerName: saleEstimate.customer.displayName,
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
