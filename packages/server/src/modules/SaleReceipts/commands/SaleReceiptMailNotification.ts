import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  DEFAULT_RECEIPT_MAIL_CONTENT,
  DEFAULT_RECEIPT_MAIL_SUBJECT,
  SendSaleReceiptMailJob,
  SendSaleReceiptMailQueue,
} from '../constants';
import { mergeAndValidateMailOptions } from '@/modules/MailNotification/utils';
import { transformReceiptToMailDataArgs } from '../utils';
import { Inject, Injectable } from '@nestjs/common';
import { GetSaleReceipt } from '../queries/GetSaleReceipt.service';
import { SaleReceiptsPdfService } from '../queries/SaleReceiptsPdf.service';
import { ContactMailNotification } from '@/modules/MailNotification/ContactMailNotification';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
  ISaleReceiptMailPresend,
  SaleReceiptMailOpts,
  SaleReceiptMailOptsDTO,
  SaleReceiptSendMailPayload,
} from '../types/SaleReceipts.types';
import { SaleReceipt } from '../models/SaleReceipt';
import { MailTransporter } from '@/modules/Mail/MailTransporter.service';
import { Mail } from '@/modules/Mail/Mail';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { GetSaleReceiptMailTemplateService } from '../queries/GetSaleReceiptMailTemplate.service';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class SaleReceiptMailNotification {
  /**
   * @param {GetSaleReceipt} getSaleReceiptService - Get sale receipt service.
   * @param {SaleReceiptsPdfService} receiptPdfService - Sale receipt pdf service.
   * @param {ContactMailNotification} contactMailNotification - Contact mail notification service.
   * @param {EventEmitter2} eventEmitter - Event emitter.
   * @param {MailTransporter} mailTransporter - Mail transporter service.
   */
  constructor(
    private readonly getSaleReceiptService: GetSaleReceipt,
    private readonly receiptPdfService: SaleReceiptsPdfService,
    private readonly contactMailNotification: ContactMailNotification,
    private readonly eventEmitter: EventEmitter2,
    private readonly mailTransporter: MailTransporter,
    private readonly tenancyContext: TenancyContext,
    private readonly getReceiptMailTemplateService: GetSaleReceiptMailTemplateService,

    @Inject(SaleReceipt.name)
    private readonly saleReceiptModel: TenantModelProxy<typeof SaleReceipt>,

    @InjectQueue(SendSaleReceiptMailQueue)
    private readonly sendSaleReceiptMailProcess: Queue,
  ) {}

  /**
   * Sends the receipt mail of the given sale receipt.
   * @param {number} saleReceiptId - Sale receipt id.
   * @param {SaleReceiptMailOptsDTO} messageDTO - Message DTOs.
   */
  public async triggerMail(
    saleReceiptId: number,
    messageOptions: SaleReceiptMailOptsDTO,
  ) {
    const tenant = await this.tenancyContext.getTenant();
    const user = await this.tenancyContext.getSystemUser();

    const organizationId = tenant.organizationId;
    const userId = user.id;

    const payload = {
      saleReceiptId,
      messageOpts: messageOptions,
      userId,
      organizationId,
    } as SaleReceiptSendMailPayload;

    await this.sendSaleReceiptMailProcess.add(SendSaleReceiptMailJob, {
      ...payload,
    });
    // Triggers the event `onSaleReceiptPreMailSend`.
    await this.eventEmitter.emitAsync(events.saleReceipt.onPreMailSend, {
      saleReceiptId,
      messageOptions,
    } as ISaleReceiptMailPresend);
  }

  /**
   * Retrieves the mail options of the given sale receipt.
   * @param {number} saleReceiptId - Sale receipt id.
   * @returns {Promise<SaleReceiptMailOptsDTO>}
   */
  public async getMailOptions(
    saleReceiptId: number,
  ): Promise<SaleReceiptMailOpts> {
    const saleReceipt = await this.saleReceiptModel()
      .query()
      .findById(saleReceiptId)
      .throwIfNotFound();

    const formatArgs = await this.textFormatterArgs(saleReceiptId);
    const mailOptions =
      await this.contactMailNotification.getDefaultMailOptions(
        saleReceipt.customerId,
      );
    return {
      ...mailOptions,
      message: DEFAULT_RECEIPT_MAIL_CONTENT,
      subject: DEFAULT_RECEIPT_MAIL_SUBJECT,
      attachReceipt: true,
      formatArgs,
    };
  }

  /**
   * Retrieves the formatted text of the given sale receipt.
   * @param {number} receiptId - Sale receipt id.
   * @param {string} text - The given text.
   * @returns {Promise<string>}
   */
  public textFormatterArgs = async (
    receiptId: number,
  ): Promise<Record<string, string>> => {
    const receipt = await this.getSaleReceiptService.getSaleReceipt(receiptId);
    const commonArgs = await this.contactMailNotification.getCommonFormatArgs();

    return {
      ...commonArgs,
      ...transformReceiptToMailDataArgs(receipt),
    };
  };

  /**
   * Formats the mail options of the given sale receipt.
   * @param {number} receiptId
   * @param {SaleReceiptMailOpts} mailOptions
   * @returns {Promise<SaleReceiptMailOpts>}
   */
  public async formatEstimateMailOptions(
    receiptId: number,
    mailOptions: SaleReceiptMailOpts,
  ): Promise<SaleReceiptMailOpts> {
    const formatterArgs = await this.textFormatterArgs(receiptId);
    const formattedOptions =
      (await this.contactMailNotification.formatMailOptions(
        mailOptions,
        formatterArgs,
      )) as SaleReceiptMailOpts;

    const message = await this.getReceiptMailTemplateService.getMailTemplate(
      receiptId,
      {
        message: formattedOptions.message,
      },
    );
    return { ...formattedOptions, message };
  }

  /**
   * Retrieves the formatted mail options of the given sale receipt.
   * @param {number} saleReceiptId
   * @param {SaleReceiptMailOptsDTO} messageOpts
   * @returns {Promise<SaleReceiptMailOpts>}
   */
  public getFormatMailOptions = async (
    saleReceiptId: number,
    messageOpts: SaleReceiptMailOptsDTO,
  ): Promise<SaleReceiptMailOpts> => {
    const defaultMessageOptions = await this.getMailOptions(saleReceiptId);
    // Merges message opts with default options.
    const parsedMessageOpts = mergeAndValidateMailOptions(
      defaultMessageOptions,
      messageOpts,
    ) as SaleReceiptMailOpts;

    // Formats the message options.
    return this.formatEstimateMailOptions(saleReceiptId, parsedMessageOpts);
  };

  /**
   * Triggers the mail notification of the given sale receipt.
   * @param {number} saleReceiptId - Sale receipt id.
   * @param {SaleReceiptMailOpts} messageDTO - message options.
   * @returns {Promise<void>}
   */
  public async sendMail(
    saleReceiptId: number,
    messageOpts: SaleReceiptMailOptsDTO,
  ) {
    // Formats the message options.
    const formattedMessageOptions = await this.getFormatMailOptions(
      saleReceiptId,
      messageOpts,
    );
    const mail = new Mail()
      .setSubject(formattedMessageOptions.subject)
      .setTo(formattedMessageOptions.to)
      .setCC(formattedMessageOptions.cc)
      .setBCC(formattedMessageOptions.bcc)
      .setContent(formattedMessageOptions.message);

    // Attaches the receipt pdf document.
    if (formattedMessageOptions.attachReceipt) {
      // Retrieves document buffer of the receipt pdf document.
      const [receiptPdfBuffer, filename] =
        await this.receiptPdfService.saleReceiptPdf(saleReceiptId);

      mail.setAttachments([
        { filename: `${filename}.pdf`, content: receiptPdfBuffer },
      ]);
    }
    const eventPayload = {
      saleReceiptId,
      messageOptions: {},
    };
    await this.eventEmitter.emitAsync(
      events.saleReceipt.onMailSend,
      eventPayload,
    );
    await this.mailTransporter.send(mail);

    await this.eventEmitter.emitAsync(
      events.saleReceipt.onMailSent,
      eventPayload,
    );
  }
}
