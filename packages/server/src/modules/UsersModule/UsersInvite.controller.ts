import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersApplication } from './Users.application';
import {
  SendInviteUserDto,
  BulkSendInviteUserDto,
} from './dtos/InviteUser.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { AuthorizationGuard } from '../Roles/Authorization.guard';
import { PermissionGuard } from '../Roles/Permission.guard';
import { RequirePermission } from '../Roles/RequirePermission.decorator';
import { AbilitySubject, UserAction } from '../Roles/Roles.types';

@Controller('invite')
@ApiTags('Users')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class UsersInviteController {
  constructor(private readonly usersApplication: UsersApplication) {}

  /**
   * Send an invitation to a new user.
   */
  @Patch()
  @RequirePermission(UserAction.Invite, AbilitySubject.User)
  @ApiOperation({ summary: 'Send an invitation to a new user.' })
  async sendInvite(@Body() sendInviteDTO: SendInviteUserDto) {
    const result = await this.usersApplication.sendInvite(sendInviteDTO);

    return {
      invitedUser: result.invitedUser,
      message: 'The invitation has been sent successfully.',
    };
  }

  /**
   * Resend an invitation to an existing user.
   */
  @Post('users/:id/resend')
  @RequirePermission(UserAction.Invite, AbilitySubject.User)
  @ApiOperation({ summary: 'Resend an invitation to an existing user.' })
  async resendInvite(@Param('id') userId: number) {
    const result = await this.usersApplication.resendInvite(userId);

    return {
      user: result.user,
      message: 'The invitation has been resent successfully.',
    };
  }

  /**
   * Send invitations to multiple users.
   */
  @Post('bulk')
  @RequirePermission(UserAction.Invite, AbilitySubject.User)
  @ApiOperation({ summary: 'Send invitations to multiple users.' })
  async sendBulkInvites(@Body() bulkSendInviteDTO: BulkSendInviteUserDto) {
    const result =
      await this.usersApplication.sendBulkInvites(bulkSendInviteDTO);

    return {
      invitedUsers: result.invitedUsers,
      failedInvites: result.failedInvites,
      message: 'Bulk invitations processed.',
    };
  }
}
