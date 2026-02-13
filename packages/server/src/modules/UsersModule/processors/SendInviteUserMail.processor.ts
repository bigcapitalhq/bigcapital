import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Scope } from '@nestjs/common';
import { ClsService, UseCls } from 'nestjs-cls';
import {
  SendInviteUserMailJob,
  SendInviteUserMailQueue,
} from '../Users.constants';
import { SendInviteUserMailJobPayload } from '../Users.types';
import { SendInviteUsersMailMessage } from '../commands/SendInviteUsersMailMessage.service';

@Processor({
  name: SendInviteUserMailQueue,
  scope: Scope.REQUEST,
})
export class SendInviteUserMailProcessor extends WorkerHost {
  constructor(
    private readonly sendInviteUsersMailService: SendInviteUsersMailMessage,
    private readonly clsService: ClsService,
  ) {
    super();
  }

  @UseCls()
  async process(job: Job<SendInviteUserMailJobPayload>) {
    const { fromUser, invite, organizationId, userId } = job.data;

    this.clsService.set('organizationId', organizationId);
    this.clsService.set('userId', userId);

    try {
      await this.sendInviteUsersMailService.sendInviteMail(fromUser, invite);
    } catch (error) {
      console.error('Failed to process invite user mail job:', error);
      throw error;
    }
  }
}
