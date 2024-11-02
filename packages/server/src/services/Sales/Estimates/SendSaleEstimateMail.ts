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
import { mergeAndValidateMailOptions } from '@/services/MailNotification/utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { transformEstimateToMailDataArgs } from './utils';

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
   * Formate the text of the mail.
   * @param {number} tenantId - Tenant id.
   * @param {number} estimateId - Estimate id.
   * @returns {Promise<Record<string, any>>}
   */
  public formatterArgs = async (tenantId: number, estimateId: number) => {
    const estimate = await this.getSaleEstimateService.getEstimate(
      tenantId,
      estimateId
    );
    return transformEstimateToMailDataArgs(estimate);
  };

  /**
   * Retrieves the mail options.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @returns {Promise<SaleEstimateMailOptions>}
   */
  public getMailOptions = async (
    tenantId: number,
    saleEstimateId: number,
    defaultSubject: string = DEFAULT_ESTIMATE_REMINDER_MAIL_SUBJECT,
    defaultMessage: string = DEFAULT_ESTIMATE_REMINDER_MAIL_CONTENT
  ): Promise<SaleEstimateMailOptions> => {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    const saleEstimate = await SaleEstimate.query()
      .findById(saleEstimateId)
      .throwIfNotFound();

    const formatArgs = await this.formatterArgs(tenantId, saleEstimateId);

    const mailOptions =
      await this.contactMailNotification.getDefaultMailOptions(
        tenantId,
        saleEstimate.customerId
      );
    return {
      ...mailOptions,
      message: defaultMessage,
      subject: defaultSubject,
      attachEstimate: true,
      formatArgs,
    };
  };

  /**
   * Formats the given mail options.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @param {SaleEstimateMailOptions} mailOptions
   * @returns {Promise<SaleEstimateMailOptions>}
   */
  public formatMailOptions = async (
    tenantId: number,
    saleEstimateId: number,
    mailOptions: SaleEstimateMailOptions
  ): Promise<SaleEstimateMailOptions> => {
    const formatterArgs = await this.formatterArgs(tenantId, saleEstimateId);
    const formattedOptions =
      await this.contactMailNotification.formatMailOptions(
        tenantId,
        mailOptions,
        formatterArgs
      );
    return { ...formattedOptions };
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
    const parsedMessageOptions = mergeAndValidateMailOptions(
      localMessageOpts,
      messageOptions
    ) as SaleEstimateMailOptions;

    const formattedOptions = await this.formatMailOptions(
      tenantId,
      saleEstimateId,
      parsedMessageOptions
    );
    const mail = new Mail()
      .setSubject(formattedOptions.subject)
      .setTo(formattedOptions.to)
      .setCC(formattedOptions.cc)
      .setBCC(formattedOptions.bcc)
      .setContent(formattedOptions.message);

    // Attaches the estimate pdf to the mail.
    if (formattedOptions.attachEstimate) {
      // Retrieves the estimate pdf and attaches it to the mail.
      const [estimatePdfBuffer, estimateFilename] =
        await this.estimatePdf.getSaleEstimatePdf(tenantId, saleEstimateId);

      mail.setAttachments([
        {
          filename: `${estimateFilename}.pdf`,
          content: estimatePdfBuffer,
        },
      ]);
    }

    const eventPayload = {
      tenantId,
      saleEstimateId,
      messageOptions,
      formattedOptions,
    };
    // Triggers `onSaleEstimateMailSend` event.
    await this.eventPublisher.emitAsync(
      events.saleEstimate.onMailSend,
      eventPayload as ISaleEstimateMailPresendEvent
    );
    await mail.send();

    // Triggers `onSaleEstimateMailSent` event.
    await this.eventPublisher.emitAsync(
      events.saleEstimate.onMailSent,
      eventPayload as ISaleEstimateMailPresendEvent
    );
  }
}
