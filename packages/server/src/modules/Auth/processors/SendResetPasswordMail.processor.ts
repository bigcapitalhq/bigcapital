import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Scope } from '@nestjs/common';
import { SendResetPasswordMailQueue } from '../Auth.constants';
import { Job } from 'bullmq';
import { AuthenticationMailMesssages } from '../AuthMailMessages.esrvice';
import { MailTransporter } from '@/modules/Mail/MailTransporter.service';
import { ModelObject } from 'objection';
import { SystemUser } from '@/modules/System/models/SystemUser';

@Processor({
  name: SendResetPasswordMailQueue,
  scope: Scope.REQUEST,
})
export class SendResetPasswordMailProcessor extends WorkerHost {
  constructor(
    private readonly authMailMesssages: AuthenticationMailMesssages,
    private readonly mailTransporter: MailTransporter,
  ) {
    super();
  }

  async process(job: Job<SendResetPasswordMailJobPayload>) {
    try {
      await this.authMailMesssages.sendResetPasswordMail(
        job.data.user,
        job.data.token,
      );
    } catch (error) {
      console.log('Error occured during send reset password mail', error);
    }
  }
}

export interface SendResetPasswordMailJobPayload {
  user: ModelObject<SystemUser>;
  token: string;
}
