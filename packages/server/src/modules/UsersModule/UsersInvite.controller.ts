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
import { SkipSubscriptionCheck } from '@/modules/Subscription/decorators/SkipSubscriptionCheck.decorator';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { AbilitySubject, UserAction } from '@/modules/Roles/Roles.types';

@Controller('invite')
@ApiTags('Users')
@SkipSubscriptionCheck()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class UsersInviteController {
  constructor(private readonly usersApplication: UsersApplication) {}

  /**
   * Send an invitation to a new user.
   */
  @Patch()
  @RequirePermission(UserAction.Create, AbilitySubject.User)
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
  @RequirePermission(UserAction.Create, AbilitySubject.User)
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
  @RequirePermission(UserAction.Create, AbilitySubject.User)
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
