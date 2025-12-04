import { JOB_REF, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendSaleInvoiceMailJob, SendSaleInvoiceQueue } from '../constants';
import { SendSaleInvoiceMail } from '../commands/SendSaleInvoiceMail';
import { Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { ClsService, UseCls } from 'nestjs-cls';
import { SendSaleInvoiceMailJobPayload } from '../SaleInvoice.types';

@Processor({
  name: SendSaleInvoiceQueue,
  scope: Scope.REQUEST,
})
export class SendSaleInvoiceMailProcessor {
  constructor(
    private readonly sendSaleInvoiceMail: SendSaleInvoiceMail,
    @Inject(REQUEST) private readonly request: Request,
    @Inject(JOB_REF)
    private readonly jobRef: Job<SendSaleInvoiceMailJobPayload>,
    private readonly clsService: ClsService,
  ) { }

  @Process(SendSaleInvoiceMailJob)
  @UseCls()
  async handleSendInvoice() {
    const { messageOptions, saleInvoiceId, organizationId, userId } =
      this.jobRef.data;

    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    try {
      await this.sendSaleInvoiceMail.sendMail(saleInvoiceId, messageOptions);
    } catch (error) {
      console.error('Failed to process invoice mail job:', error);
      throw error;
    }
  }
}
