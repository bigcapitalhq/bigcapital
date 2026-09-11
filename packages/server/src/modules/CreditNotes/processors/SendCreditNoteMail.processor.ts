import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Scope } from '@nestjs/common';
import { SendCreditNoteMailQueue } from '../types/CreditNotes.types';
import { SendCreditNoteMail } from '../commands/SendCreditNoteMail';
import { ClsService, UseCls } from 'nestjs-cls';

@Processor({
  name: SendCreditNoteMailQueue,
  scope: Scope.REQUEST,
})
export class SendCreditNoteMailProcessor extends WorkerHost {
  constructor(
    private readonly sendCreditNoteMailService: SendCreditNoteMail,
    private readonly clsService: ClsService,
  ) {
    super();
  }

  @UseCls()
  async process(job: Job) {
    const { creditNoteId, messageOptions, organizationId, userId } = job.data;

    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    try {
      await this.sendCreditNoteMailService.sendMail(
        creditNoteId,
        messageOptions,
      );
    } catch (error) {
      console.error('Failed to process credit note mail job:', error);
      throw error;
    }
  }
}
