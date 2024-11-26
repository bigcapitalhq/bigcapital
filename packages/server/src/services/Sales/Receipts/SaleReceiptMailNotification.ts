import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import Mail from '@/lib/Mail';
import { GetSaleReceipt } from './GetSaleReceipt';
import { SaleReceiptsPdf } from './SaleReceiptsPdfService';
import {
  DEFAULT_RECEIPT_MAIL_CONTENT,
  DEFAULT_RECEIPT_MAIL_SUBJECT,
} from './constants';
import {
  ISaleReceiptMailPresend,
  SaleReceiptMailOpts,
  SaleReceiptMailOptsDTO,
} from '@/interfaces';
import { ContactMailNotification } from '@/services/MailNotification/ContactMailNotification';
import { mergeAndValidateMailOptions } from '@/services/MailNotification/utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import { transformReceiptToMailDataArgs } from './utils';
import { GetSaleReceiptMailTemplate } from './GetSaleReceiptMailTemplate';

@Service()
export class SaleReceiptMailNotification {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private getSaleReceiptService: GetSaleReceipt;

  @Inject()
  private receiptPdfService: SaleReceiptsPdf;

  @Inject()
  private contactMailNotification: ContactMailNotification;

  @Inject()
  private getReceiptMailTemplate: GetSaleReceiptMailTemplate;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject('agenda')
  private agenda: any;

  /**
   * Sends the receipt mail of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @param {SaleReceiptMailOptsDTO} messageDTO
   */
  public async triggerMail(
    tenantId: number,
    saleReceiptId: number,
    messageOptions: SaleReceiptMailOptsDTO
  ) {
    const payload = {
      tenantId,
      saleReceiptId,
      messageOpts: messageOptions,
    };
    await this.agenda.now('sale-receipt-mail-send', payload);

    // Triggers the event `onSaleReceiptPreMailSend`.
    await this.eventPublisher.emitAsync(events.saleReceipt.onPreMailSend, {
      tenantId,
      saleReceiptId,
      messageOptions,
    } as ISaleReceiptMailPresend);
  }

  /**
   * Retrieves the mail options of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @returns {Promise<SaleReceiptMailOptsDTO>}
   */
  public async getMailOptions(
    tenantId: number,
    saleReceiptId: number
  ): Promise<SaleReceiptMailOpts> {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    const saleReceipt = await SaleReceipt.query()
      .findById(saleReceiptId)
      .throwIfNotFound();

    const formatArgs = await this.textFormatterArgs(tenantId, saleReceiptId);

    const mailOptions =
      await this.contactMailNotification.getDefaultMailOptions(
        tenantId,
        saleReceipt.customerId
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
   * @param {number} tenantId - Tenant id.
   * @param {number} receiptId - Sale receipt id.
   * @param {string} text - The given text.
   * @returns {Promise<string>}
   */
  public textFormatterArgs = async (
    tenantId: number,
    receiptId: number
  ): Promise<Record<string, string>> => {
    const receipt = await this.getSaleReceiptService.getSaleReceipt(
      tenantId,
      receiptId
    );
    const commonArgs = await this.contactMailNotification.getCommonFormatArgs(
      tenantId
    );
    return {
      ...commonArgs,
      ...transformReceiptToMailDataArgs(receipt),
    };
  };

  /**
   * Formats the mail options of the given sale receipt.
   * @param {number} tenantId
   * @param {number} receiptId
   * @param {SaleReceiptMailOpts} mailOptions
   * @returns {Promise<SaleReceiptMailOpts>}
   */
  public async formatEstimateMailOptions(
    tenantId: number,
    receiptId: number,
    mailOptions: SaleReceiptMailOpts
  ): Promise<SaleReceiptMailOpts> {
    const formatterArgs = await this.textFormatterArgs(tenantId, receiptId);
    const formattedOptions =
      (await this.contactMailNotification.formatMailOptions(
        tenantId,
        mailOptions,
        formatterArgs
      )) as SaleReceiptMailOpts;

    const message = await this.getReceiptMailTemplate.getMailTemplate(
      tenantId,
      receiptId,
      {
        message: formattedOptions.message,
      }
    );
    return { ...formattedOptions, message };
  }

  /**
   * Retrieves the formatted mail options of the given sale receipt.
   * @param {number} tenantId
   * @param {number} saleReceiptId
   * @param {SaleReceiptMailOptsDTO} messageOpts
   * @returns {Promise<SaleReceiptMailOpts>}
   */
  public getFormatMailOptions = async (
    tenantId: number,
    saleReceiptId: number,
    messageOpts: SaleReceiptMailOptsDTO
  ): Promise<SaleReceiptMailOpts> => {
    const defaultMessageOptions = await this.getMailOptions(
      tenantId,
      saleReceiptId
    );
    // Merges message opts with default options.
    const parsedMessageOpts = mergeAndValidateMailOptions(
      defaultMessageOptions,
      messageOpts
    ) as SaleReceiptMailOpts;

    // Formats the message options.
    return this.formatEstimateMailOptions(
      tenantId,
      saleReceiptId,
      parsedMessageOpts
    );
  };

  /**
   * Triggers the mail notification of the given sale receipt.
   * @param {number} tenantId - Tenant id.
   * @param {number} saleReceiptId - Sale receipt id.
   * @param {SaleReceiptMailOpts} messageDTO - message options.
   * @returns {Promise<void>}
   */
  public async sendMail(
    tenantId: number,
    saleReceiptId: number,
    messageOpts: SaleReceiptMailOptsDTO
  ) {
    // Formats the message options.
    const formattedMessageOptions = await this.getFormatMailOptions(
      tenantId,
      saleReceiptId,
      messageOpts
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
        await this.receiptPdfService.saleReceiptPdf(tenantId, saleReceiptId);

      mail.setAttachments([
        { filename: `${filename}.pdf`, content: receiptPdfBuffer },
      ]);
    }
    const eventPayload = {
      tenantId,
      saleReceiptId,
      messageOptions: {},
    };
    await this.eventPublisher.emitAsync(
      events.saleReceipt.onMailSend,
      eventPayload
    );
    await mail.send();

    await this.eventPublisher.emitAsync(
      events.saleReceipt.onMailSent,
      eventPayload
    );
  }
}
