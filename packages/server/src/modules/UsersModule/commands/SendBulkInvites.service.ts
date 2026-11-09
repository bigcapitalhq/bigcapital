import { Injectable } from '@nestjs/common';
import { TenantUser } from '@/modules/Tenancy/TenancyModels/models/TenantUser.model';
import { BulkSendInviteUserDto } from '../dtos/InviteUser.dto';
import { InviteTenantUserService } from './InviteUser.service';

type FailedInvite = {
  email: string;
  error: string;
};

type SendBulkInvitesResult = {
  invitedUsers: TenantUser[];
  failedInvites: FailedInvite[];
};

@Injectable()
export class SendBulkInvitesService {
  constructor(
    private readonly inviteTenantUserService: InviteTenantUserService,
  ) {}

  async sendBulkInvites(
    bulkSendInviteDTO: BulkSendInviteUserDto,
  ): Promise<SendBulkInvitesResult> {
    const invitedUsers: TenantUser[] = [];
    const failedInvites: FailedInvite[] = [];

    for (const invite of bulkSendInviteDTO.invites) {
      try {
        const result = await this.inviteTenantUserService.sendInvite(invite);
        invitedUsers.push(result.invitedUser);
      } catch (error) {
        failedInvites.push({
          email: invite.email,
          error: this.getErrorMessage(error),
        });
      }
    }

    return { invitedUsers, failedInvites };
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'Failed to send invitation';
  }
}
