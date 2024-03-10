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
import { parseAndValidateMailOptions } from '@/services/MailNotification/utils';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';

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

    const formattedData = await this.textFormatter(tenantId, saleReceiptId);

    const mailOpts = await this.contactMailNotification.getMailOptions(
      tenantId,
      saleReceipt.customerId,
      DEFAULT_RECEIPT_MAIL_SUBJECT,
      DEFAULT_RECEIPT_MAIL_CONTENT,
      formattedData
    );
    return {
      ...mailOpts,
      attachReceipt: true,
    };
  }

  /**
   * Retrieves the formatted text of the given sale receipt.
   * @param {number} tenantId - Tenant id.
   * @param {number} receiptId - Sale receipt id.
   * @param {string} text - The given text.
   * @returns {Promise<string>}
   */
  public textFormatter = async (
    tenantId: number,
    receiptId: number
  ): Promise<Record<string, string>> => {
    const receipt = await this.getSaleReceiptService.getSaleReceipt(
      tenantId,
      receiptId
    );
    return {
      CustomerName: receipt.customer.displayName,
      ReceiptNumber: receipt.receiptNumber,
      ReceiptDate: receipt.formattedReceiptDate,
      ReceiptAmount: receipt.formattedAmount,
    };
  };

  /**
   * Triggers the mail notification of the given sale receipt.
   * @param {number} tenantId - Tenant id.
   * @param {number} saleReceiptId - Sale receipt id.
   * @param {SaleReceiptMailOpts} messageDTO - Overrided message options.
   * @returns {Promise<void>}
   */
  public async sendMail(
    tenantId: number,
    saleReceiptId: number,
    messageOpts: SaleReceiptMailOptsDTO
  ) {
    const defaultMessageOpts = await this.getMailOptions(
      tenantId,
      saleReceiptId
    );
    // Merges message opts with default options.
    const parsedMessageOpts = parseAndValidateMailOptions(
      defaultMessageOpts,
      messageOpts
    );
    const mail = new Mail()
      .setSubject(parsedMessageOpts.subject)
      .setTo(parsedMessageOpts.to)
      .setContent(parsedMessageOpts.body);

    if (parsedMessageOpts.attachReceipt) {
      // Retrieves document buffer of the receipt pdf document.
      const receiptPdfBuffer = await this.receiptPdfService.saleReceiptPdf(
        tenantId,
        saleReceiptId
      );
      mail.setAttachments([
        { filename: 'receipt.pdf', content: receiptPdfBuffer },
      ]);
    }
    await mail.send();
  }
}
