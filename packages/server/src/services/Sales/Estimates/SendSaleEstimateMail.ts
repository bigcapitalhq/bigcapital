import { Inject, Service } from 'typedi';
import Mail from '@/lib/Mail';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  DEFAULT_ESTIMATE_REMINDER_MAIL_CONTENT,
  DEFAULT_ESTIMATE_REMINDER_MAIL_SUBJECT,
} from './constants';
import { SaleEstimatesPdf } from './SaleEstimatesPdf';
import { GetSaleEstimate } from './GetSaleEstimate';
import {
  ISaleEstimateMailPresendEvent,
  SaleEstimateMailOptions,
  SaleEstimateMailOptionsDTO,
} from '@/interfaces';
import { ContactMailNotification } from '@/services/MailNotification/ContactMailNotification';
import { parseAndValidateMailOptions } from '@/services/MailNotification/utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

@Service()
export class SendSaleEstimateMail {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private estimatePdf: SaleEstimatesPdf;

  @Inject()
  private getSaleEstimateService: GetSaleEstimate;

  @Inject()
  private contactMailNotification: ContactMailNotification;

  @Inject('agenda')
  private agenda: any;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Triggers the reminder mail of the given sale estimate.
   * @param {number} tenantId -
   * @param {number} saleEstimateId -
   * @param {SaleEstimateMailOptionsDTO} messageOptions -
   * @returns {Promise<void>}
   */
  public async triggerMail(
    tenantId: number,
    saleEstimateId: number,
    messageOptions: SaleEstimateMailOptionsDTO
  ): Promise<void> {
    const payload = {
      tenantId,
      saleEstimateId,
      messageOptions,
    };
    await this.agenda.now('sale-estimate-mail-send', payload);

    // Triggers `onSaleEstimatePreMailSend` event.
    await this.eventPublisher.emitAsync(events.saleEstimate.onPreMailSend, {
      tenantId,
      saleEstimateId,
      messageOptions,
    } as ISaleEstimateMailPresendEvent);
  }

  /**
   * Formates the text of the mail.
   * @param {number} tenantId - Tenant id.
   * @param {number} estimateId - Estimate id.
   * @returns {Promise<Record<string, any>>}
   */
  public formatterData = async (tenantId: number, estimateId: number) => {
    const estimate = await this.getSaleEstimateService.getEstimate(
      tenantId,
      estimateId
    );
    return {
      CustomerName: estimate.customer.displayName,
      EstimateNumber: estimate.estimateNumber,
      EstimateDate: estimate.formattedEstimateDate,
      EstimateAmount: estimate.formattedAmount,
      EstimateExpirationDate: estimate.formattedExpirationDate,
    };
  };

  /**
   * Retrieves the mail options.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @returns {Promise<SaleEstimateMailOptions>}
   */
  public getMailOptions = async (
    tenantId: number,
    saleEstimateId: number
  ): Promise<SaleEstimateMailOptions> => {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    const saleEstimate = await SaleEstimate.query()
      .findById(saleEstimateId)
      .throwIfNotFound();

    const formatterData = await this.formatterData(tenantId, saleEstimateId);

    const mailOptions = await this.contactMailNotification.getMailOptions(
      tenantId,
      saleEstimate.customerId,
      DEFAULT_ESTIMATE_REMINDER_MAIL_SUBJECT,
      DEFAULT_ESTIMATE_REMINDER_MAIL_CONTENT,
      formatterData
    );
    return {
      ...mailOptions,
      data: formatterData,
      attachEstimate: true,
    };
  };

  /**
   * Sends the mail notification of the given sale estimate.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @param {SaleEstimateMailOptions} messageOptions
   * @returns {Promise<void>}
   */
  public async sendMail(
    tenantId: number,
    saleEstimateId: number,
    messageOptions: SaleEstimateMailOptionsDTO
  ): Promise<void> {
    const localMessageOpts = await this.getMailOptions(
      tenantId,
      saleEstimateId
    );
    // Overrides and validates the given mail options.
    const messageOpts = parseAndValidateMailOptions(
      localMessageOpts,
      messageOptions
    );
    const mail = new Mail()
      .setSubject(messageOpts.subject)
      .setTo(messageOpts.to)
      .setContent(messageOpts.body);

    if (messageOpts.attachEstimate) {
      const estimatePdfBuffer = await this.estimatePdf.getSaleEstimatePdf(
        tenantId,
        saleEstimateId
      );
      mail.setAttachments([
        {
          filename: messageOpts.data?.EstimateNumber || 'estimate.pdf',
          content: estimatePdfBuffer,
        },
      ]);
    }
    await mail.send();
  }
}
