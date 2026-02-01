import { Scope } from '@nestjs/common';
import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SendSignupVerificationMailQueue } from '../Auth.constants';
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

  async process(job: Job<SendSignupVerificationMailJobPayload>) {
    try {
      await this.authMailMesssages.sendSignupVerificationMail(
        job.data.email,
        job.data.fullName,
        job.data.token,
      );
    } catch (error) {
      console.log('Error occured during send signup verification mail', error);
    }
  }
}

export interface SendSignupVerificationMailJobPayload {
  email: string;
  fullName: string;
  token: string;
}
