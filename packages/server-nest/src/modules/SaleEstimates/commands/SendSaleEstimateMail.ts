import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContactMailNotification } from '@/modules/MailNotification/ContactMailNotification';
import {
  DEFAULT_ESTIMATE_REMINDER_MAIL_CONTENT,
  DEFAULT_ESTIMATE_REMINDER_MAIL_SUBJECT,
} from '../constants';
import { GetSaleEstimate } from '../queries/GetSaleEstimate.service';
import { transformEstimateToMailDataArgs } from '../utils';
import { GetSaleEstimatePdf } from '../queries/GetSaleEstimatePdf';
import { events } from '@/common/events/events';
import { SaleEstimate } from '../models/SaleEstimate';
import { mergeAndValidateMailOptions } from '@/modules/MailNotification/utils';
import {
  ISaleEstimateMailPresendEvent,
  SaleEstimateMailOptionsDTO,
} from '../types/SaleEstimates.types';
import { SaleEstimateMailOptions } from '../types/SaleEstimates.types';
import { Mail } from '@/modules/Mail/Mail';
import { MailTransporter } from '@/modules/Mail/MailTransporter.service';

@Injectable()
export class SendSaleEstimateMail {
  /**
   * @param {GetSaleEstimatePdf} estimatePdf - Estimate pdf service.
   * @param {GetSaleEstimate} getSaleEstimateService - Get sale estimate service.
   * @param {ContactMailNotification} contactMailNotification - Contact mail notification service.
   * @param {EventEmitter2} eventPublisher - Event emitter.
   * @param {MailTransporter} mailTransporter - Mail transporter service.
   * @param {typeof SaleEstimate} saleEstimateModel - Sale estimate model.
   */
  constructor(
    private readonly estimatePdf: GetSaleEstimatePdf,
    private readonly getSaleEstimateService: GetSaleEstimate,
    private readonly contactMailNotification: ContactMailNotification,
    private readonly eventPublisher: EventEmitter2,
    private readonly mailTransporter: MailTransporter,

    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: typeof SaleEstimate,
  ) {}

  /**
   * Triggers the reminder mail of the given sale estimate.
   * @param {number} saleEstimateId - Sale estimate id.
   * @param {SaleEstimateMailOptionsDTO} messageOptions - Sale estimate mail options.
   * @returns {Promise<void>}
   */
  public async triggerMail(
    saleEstimateId: number,
    messageOptions: SaleEstimateMailOptionsDTO,
  ): Promise<void> {
    const payload = {
      saleEstimateId,
      messageOptions,
    };
    // await this.agenda.now('sale-estimate-mail-send', payload);

    // Triggers `onSaleEstimatePreMailSend` event.
    await this.eventPublisher.emitAsync(events.saleEstimate.onPreMailSend, {
      saleEstimateId,
      messageOptions,
    } as ISaleEstimateMailPresendEvent);
  }

  /**
   * Formate the text of the mail.
   * @param {number} estimateId - Estimate id.
   * @returns {Promise<Record<string, any>>}
   */
  public formatterArgs = async (estimateId: number) => {
    const estimate = await this.getSaleEstimateService.getEstimate(estimateId);
    return transformEstimateToMailDataArgs(estimate);
  };

  /**
   * Retrieves the mail options.
   * @param {number} saleEstimateId - Sale estimate id.
   * @param {string} defaultSubject - Default subject.
   * @param {string} defaultMessage - Default message.
   * @returns {Promise<SaleEstimateMailOptions>}
   */
  public getMailOptions = async (
    saleEstimateId: number,
    defaultSubject: string = DEFAULT_ESTIMATE_REMINDER_MAIL_SUBJECT,
    defaultMessage: string = DEFAULT_ESTIMATE_REMINDER_MAIL_CONTENT,
  ): Promise<SaleEstimateMailOptions> => {
    const saleEstimate = await this.saleEstimateModel
      .query()
      .findById(saleEstimateId)
      .throwIfNotFound();

    const formatArgs = await this.formatterArgs(saleEstimateId);

    const mailOptions =
      await this.contactMailNotification.getDefaultMailOptions(
        saleEstimate.customerId,
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
   * @param {number} saleEstimateId - Sale estimate id.
   * @param {SaleEstimateMailOptions} mailOptions - Sale estimate mail options.
   * @returns {Promise<SaleEstimateMailOptions>}
   */
  public formatMailOptions = async (
    saleEstimateId: number,
    mailOptions: SaleEstimateMailOptions,
  ): Promise<SaleEstimateMailOptions> => {
    const formatterArgs = await this.formatterArgs(saleEstimateId);
    const formattedOptions =
      await this.contactMailNotification.formatMailOptions(
        mailOptions,
        formatterArgs,
      );
    return { ...formattedOptions };
  };

  /**
   * Sends the mail notification of the given sale estimate.
   * @param {number} saleEstimateId - Sale estimate id.
   * @param {SaleEstimateMailOptions} messageOptions - Sale estimate mail options.
   * @returns {Promise<void>}
   */
  public async sendMail(
    saleEstimateId: number,
    messageOptions: SaleEstimateMailOptionsDTO,
  ): Promise<void> {
    const localMessageOpts = await this.getMailOptions(saleEstimateId);
    // Overrides and validates the given mail options.
    const parsedMessageOptions = mergeAndValidateMailOptions(
      localMessageOpts,
      messageOptions,
    ) as SaleEstimateMailOptions;

    const formattedOptions = await this.formatMailOptions(
      saleEstimateId,
      parsedMessageOptions,
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
        await this.estimatePdf.getSaleEstimatePdf(saleEstimateId);

      mail.setAttachments([
        {
          filename: `${estimateFilename}.pdf`,
          content: estimatePdfBuffer,
        },
      ]);
    }

    const eventPayload = {
      saleEstimateId,
      messageOptions,
      formattedOptions,
    };
    // Triggers `onSaleEstimateMailSend` event.
    await this.eventPublisher.emitAsync(
      events.saleEstimate.onMailSend,
      eventPayload as ISaleEstimateMailPresendEvent,
    );
    await this.mailTransporter.send(mail);

    // Triggers `onSaleEstimateMailSent` event.
    await this.eventPublisher.emitAsync(
      events.saleEstimate.onMailSent,
      eventPayload as ISaleEstimateMailPresendEvent,
    );
  }
}
