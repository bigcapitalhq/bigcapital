import { JOB_REF, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject, Scope } from '@nestjs/common';
import { ClsService, UseCls } from 'nestjs-cls';
import {
  SEND_PAYMENT_RECEIVED_MAIL_JOB,
  SEND_PAYMENT_RECEIVED_MAIL_QUEUE,
} from '../constants';
import { SendPaymentReceiveMailNotification } from '../commands/PaymentReceivedMailNotification';
import { SendPaymentReceivedMailPayload } from '../types/PaymentReceived.types';

@Processor({
  name: SEND_PAYMENT_RECEIVED_MAIL_QUEUE,
  scope: Scope.REQUEST,
})
export class SendPaymentReceivedMailProcessor {
  constructor(
    private readonly sendPaymentReceivedMail: SendPaymentReceiveMailNotification,
    private readonly clsService: ClsService,

    @Inject(JOB_REF)
    private readonly jobRef: Job<SendPaymentReceivedMailPayload>,
  ) { }

  @Process(SEND_PAYMENT_RECEIVED_MAIL_JOB)
  @UseCls()
  async handleSendMail() {
    const { messageOptions, paymentReceivedId, organizationId, userId } =
      this.jobRef.data;

    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    try {
      await this.sendPaymentReceivedMail.sendMail(
        paymentReceivedId,
        messageOptions,
      );
    } catch (error) {
      console.error('Failed to process payment received mail job:', error);
      throw error;
    }
  }
}
