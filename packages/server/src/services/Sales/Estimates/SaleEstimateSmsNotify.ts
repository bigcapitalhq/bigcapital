import { Service, Inject } from 'typedi';
import moment from 'moment';
import events from '@/subscribers/events';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import SaleNotifyBySms from '../SaleNotifyBySms';
import SmsNotificationsSettingsService from '@/services/Settings/SmsNotificationsSettings';
import {
  ICustomer,
  IPaymentReceivedSmsDetails,
  ISaleEstimate,
  SMS_NOTIFICATION_KEY,
} from '@/interfaces';
import { Tenant, TenantMetadata } from '@/system/models';
import { formatNumber, formatSmsMessage } from 'utils';
import { ServiceError } from '@/exceptions';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';

const ERRORS = {
  SALE_ESTIMATE_NOT_FOUND: 'SALE_ESTIMATE_NOT_FOUND',
};

@Service()
export class SaleEstimateNotifyBySms {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private saleSmsNotification: SaleNotifyBySms;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private smsNotificationsSettings: SmsNotificationsSettingsService;

  /**
   *
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @returns {Promise<ISaleEstimate>}
   */
  public notifyBySms = async (
    tenantId: number,
    saleEstimateId: number
  ): Promise<ISaleEstimate> => {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Retrieve the sale invoice or throw not found service error.
    const saleEstimate = await SaleEstimate.query()
      .findById(saleEstimateId)
      .withGraphFetched('customer');

    // Validates the estimate transaction existance.
    this.validateEstimateExistance(saleEstimate);

    // Validate the customer phone number existance and number validation.
    this.saleSmsNotification.validateCustomerPhoneNumber(
      saleEstimate.customer.personalPhone
    );
    // Triggers `onSaleEstimateNotifySms` event.
    await this.eventPublisher.emitAsync(events.saleEstimate.onNotifySms, {
      tenantId,
      saleEstimate,
    });
    await this.sendSmsNotification(tenantId, saleEstimate);

    // Triggers `onSaleEstimateNotifySms` event.
    await this.eventPublisher.emitAsync(events.saleEstimate.onNotifiedSms, {
      tenantId,
      saleEstimate,
    });
    return saleEstimate;
  };

  /**
   *
   * @param {number} tenantId
   * @param {ISaleEstimate} saleEstimate
   * @returns
   */
  private sendSmsNotification = async (
    tenantId: number,
    saleEstimate: ISaleEstimate & { customer: ICustomer }
  ) => {
    const smsClient = this.tenancy.smsClient(tenantId);
    const tenantMetadata = await TenantMetadata.query().findOne({ tenantId });

    // Retrieve the formatted sms notification message for estimate details.
    const formattedSmsMessage = this.formattedEstimateDetailsMessage(
      tenantId,
      saleEstimate,
      tenantMetadata
    );
    const phoneNumber = saleEstimate.customer.personalPhone;

    // Runs the send message job.
    return smsClient.sendMessageJob(phoneNumber, formattedSmsMessage);
  };

  /**
   * Notify via SMS message after estimate creation.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @returns {Promise<void>}
   */
  public notifyViaSmsNotificationAfterCreation = async (
    tenantId: number,
    saleEstimateId: number
  ): Promise<void> => {
    const notification = this.smsNotificationsSettings.getSmsNotificationMeta(
      tenantId,
      SMS_NOTIFICATION_KEY.SALE_ESTIMATE_DETAILS
    );
    // Can't continue if the sms auto-notification is not enabled.
    if (!notification.isNotificationEnabled) return;

    await this.notifyBySms(tenantId, saleEstimateId);
  };

  /**
   *
   * @param {number} tenantId
   * @param {ISaleEstimate} saleEstimate
   * @param {TenantMetadata} tenantMetadata
   * @returns {string}
   */
  private formattedEstimateDetailsMessage = (
    tenantId: number,
    saleEstimate: ISaleEstimate,
    tenantMetadata: TenantMetadata
  ): string => {
    const notification = this.smsNotificationsSettings.getSmsNotificationMeta(
      tenantId,
      SMS_NOTIFICATION_KEY.SALE_ESTIMATE_DETAILS
    );
    return this.formateEstimateDetailsMessage(
      notification.smsMessage,
      saleEstimate,
      tenantMetadata
    );
  };

  /**
   * Formattes the estimate sms notification details message.
   * @param {string} smsMessage
   * @param {ISaleEstimate} saleEstimate
   * @param {TenantMetadata} tenantMetadata
   * @returns {string}
   */
  private formateEstimateDetailsMessage = (
    smsMessage: string,
    saleEstimate: ISaleEstimate & { customer: ICustomer },
    tenantMetadata: TenantMetadata
  ) => {
    const formattedAmount = formatNumber(saleEstimate.amount, {
      currencyCode: saleEstimate.currencyCode,
    });

    return formatSmsMessage(smsMessage, {
      EstimateNumber: saleEstimate.estimateNumber,
      ReferenceNumber: saleEstimate.reference,
      EstimateDate: moment(saleEstimate.estimateDate).format('YYYY/MM/DD'),
      ExpirationDate: saleEstimate.expirationDate
        ? moment(saleEstimate.expirationDate).format('YYYY/MM/DD')
        : '',
      CustomerName: saleEstimate.customer.displayName,
      Amount: formattedAmount,
      CompanyName: tenantMetadata.name,
    });
  };

  /**
   * Retrieve the SMS details of the given payment receive transaction.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @returns {Promise<IPaymentReceivedSmsDetails>}
   */
  public smsDetails = async (
    tenantId: number,
    saleEstimateId: number
  ): Promise<IPaymentReceivedSmsDetails> => {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Retrieve the sale invoice or throw not found service error.
    const saleEstimate = await SaleEstimate.query()
      .findById(saleEstimateId)
      .withGraphFetched('customer');

    // Validates the estimate existance.
    this.validateEstimateExistance(saleEstimate);

    // Retrieve the current tenant metadata.
    const tenantMetadata = await TenantMetadata.query().findOne({ tenantId });

    // Retrieve the formatted sms message from the given estimate model.
    const formattedSmsMessage = this.formattedEstimateDetailsMessage(
      tenantId,
      saleEstimate,
      tenantMetadata
    );
    return {
      customerName: saleEstimate.customer.displayName,
      customerPhoneNumber: saleEstimate.customer.personalPhone,
      smsMessage: formattedSmsMessage,
    };
  };

  /**
   * Validates the sale estimate existance.
   * @param {ISaleEstimate} saleEstimate -
   */
  private validateEstimateExistance(saleEstimate: ISaleEstimate) {
    if (!saleEstimate) {
      throw new ServiceError(ERRORS.SALE_ESTIMATE_NOT_FOUND);
    }
  }
}
