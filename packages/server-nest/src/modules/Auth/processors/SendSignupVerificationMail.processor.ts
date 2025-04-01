import { Scope } from '@nestjs/common';
import { Job } from 'bullmq';
import { Process } from '@nestjs/bull';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
  SendSignupVerificationMailJob,
  SendSignupVerificationMailQueue,
} from '../Auth.constants';
import { MailTransporter } from '@/modules/Mail/MailTransporter.service';
import { AuthenticationMailMesssages } from '../AuthMailMessages.esrvice';

@Processor({
  name: SendSignupVerificationMailQueue,
  scope: Scope.REQUEST,
})
export class SendSignupVerificationMailProcessor extends WorkerHost {
  constructor(
    private readonly authMailMesssages: AuthenticationMailMesssages,
    private readonly mailTransporter: MailTransporter,
  ) {
    super();
  }

  @Process(SendSignupVerificationMailJob)
  async process(job: Job<SendSignupVerificationMailJobPayload>) {
    console.log('triggerd');
    const mail = this.authMailMesssages.sendSignupVerificationMail(
      job.data.email,
      job.data.fullName,
      job.data.token,
    );
    await this.mailTransporter.send(mail);
  }
}

export interface SendSignupVerificationMailJobPayload {
  email: string;
  fullName: string;
  token: string;
}
