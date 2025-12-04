import { JOB_REF, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
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
export class SendInviteUserMailProcessor {
  constructor(
    private readonly sendInviteUsersMailService: SendInviteUsersMailMessage,
    @Inject(REQUEST) private readonly request: Request,
    @Inject(JOB_REF)
    private readonly jobRef: Job<SendInviteUserMailJobPayload>,
    private readonly clsService: ClsService,
  ) { }

  @Process(SendInviteUserMailJob)
  @UseCls()
  async handleSendInviteMail() {
    const { fromUser, invite, organizationId, userId } = this.jobRef.data;

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
