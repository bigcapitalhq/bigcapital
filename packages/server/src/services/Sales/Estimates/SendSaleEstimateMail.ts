import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import Mail from '@/lib/Mail';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  DEFAULT_ESTIMATE_REMINDER_MAIL_CONTENT,
  DEFAULT_ESTIMATE_REMINDER_MAIL_SUBJECT,
} from './constants';
import { SaleEstimatesPdf } from './SaleEstimatesPdf';
import { GetSaleEstimate } from './GetSaleEstimate';
import { formatSmsMessage } from '@/utils';
import { SaleEstimateMailOptions } from '@/interfaces';

@Service()
export class SendSaleEstimateMail {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject('agenda')
  private agenda: any;

  @Inject()
  private estimatePdf: SaleEstimatesPdf;

  @Inject()
  private getSaleEstimateService: GetSaleEstimate;

  /**
   * Triggers the reminder mail of the given sale estimate.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @param {SaleEstimateMailOptions} messageOptions
   */
  public async triggerMail(
    tenantId: number,
    saleEstimateId: number,
    messageOptions: SaleEstimateMailOptions
  ) {
    const payload = {
      tenantId,
      saleEstimateId,
      messageOptions,
    };
    await this.agenda.now('sale-estimate-mail-send', payload);
  }

  /**
   * Formates the text of the mail.
   * @param {number} tenantId
   * @param {number} estimateId
   * @param {string} text
   */
  public formatText = async (
    tenantId: number,
    estimateId: number,
    text: string
  ) => {
    const estimate = await this.getSaleEstimateService.getEstimate(
      tenantId,
      estimateId
    );
    return formatSmsMessage(text, {
      CustomerName: estimate.customer.displayName,
      EstimateNumber: estimate.estimateNo,
      EstimateDate: estimate.estimateDateFormatted,
      EstimateAmount: estimate.totalFormatted,
      EstimateDueDate: estimate.dueDateFormatted,
      EstimateDueAmount: estimate.dueAmountFormatted,
    });
  };

  /**
   * Retrieves the default mail options.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @returns {Promise<any>}
   */
  public getDefaultMailOpts = async (
    tenantId: number,
    saleEstimateId: number
  ) => {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    const saleEstimate = await SaleEstimate.query()
      .findById(saleEstimateId)
      .withGraphFetched('customer')
      .throwIfNotFound();

    return {
      attachPdf: true,
      subject: DEFAULT_ESTIMATE_REMINDER_MAIL_SUBJECT,
      body: DEFAULT_ESTIMATE_REMINDER_MAIL_CONTENT,
      to: saleEstimate.customer.email,
    };
  };

  /**
   * Sends the mail.
   * @param {number} tenantId
   * @param {number} saleEstimateId
   * @param {SaleEstimateMailOptions} messageOptions
   */
  public async sendMail(
    tenantId: number,
    saleEstimateId: number,
    messageOptions: SaleEstimateMailOptions
  ) {
    const defaultMessageOpts = await this.getDefaultMailOpts(
      tenantId,
      saleEstimateId
    );
    const parsedMessageOpts = {
      ...defaultMessageOpts,
      ...messageOptions,
    };
    const formatter = R.curry(this.formatText)(tenantId, saleEstimateId);
    const subject = await formatter(parsedMessageOpts.subject);
    const body = await formatter(parsedMessageOpts.body);
    const attachments = [];

    if (parsedMessageOpts.to) {
      const estimatePdfBuffer = await this.estimatePdf.getSaleEstimatePdf(
        tenantId,
        saleEstimateId
      );
      attachments.push({
        filename: 'estimate.pdf',
        content: estimatePdfBuffer,
      });
    }
    await new Mail()
      .setSubject(subject)
      .setTo(parsedMessageOpts.to)
      .setContent(body)
      .setAttachments(attachments)
      .send();
  }
}
