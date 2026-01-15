import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersApplication } from './Users.application';
import { InviteUserDto, SendInviteUserDto } from './dtos/InviteUser.dto';

@Controller('invite')
@ApiTags('Users')
export class UsersInviteController {
  constructor(private readonly usersApplication: UsersApplication) {}

  /**
   * Accept a user invitation.
   */
  @Post('accept/:token')
  @ApiOperation({ summary: 'Accept a user invitation.' })
  async acceptInvite(
    @Param('token') token: string,
    @Body() inviteUserDTO: InviteUserDto,
  ) {
    await this.usersApplication.acceptInvite(token, inviteUserDTO);

    return {
      message: 'The invitation has been accepted successfully.',
    };
  }

  /**
   * Check if an invitation token is valid.
   */
  @Get('check/:token')
  @ApiOperation({ summary: 'Check if an invitation token is valid.' })
  async checkInvite(@Param('token') token: string) {
    const inviteDetails = await this.usersApplication.checkInvite(token);

    return inviteDetails;
  }

  /**
   * Send an invitation to a new user.
   */
  @Patch()
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
  @ApiOperation({ summary: 'Resend an invitation to an existing user.' })
  async resendInvite(@Param('id') userId: number) {
    const result = await this.usersApplication.resendInvite(userId);

    return {
      user: result.user,
      message: 'The invitation has been resent successfully.',
    };
  }
}
