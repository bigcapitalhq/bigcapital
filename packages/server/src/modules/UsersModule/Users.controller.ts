import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersApplication } from './Users.application';
import { EditUserDto } from './dtos/EditUser.dto';
import { InviteUserDto } from './dtos/InviteUser.dto';
import { IUserSendInviteDTO } from './Users.types';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersApplication: UsersApplication) {}

  /**
   * Edit details of the given user.
   */
  @Post(':id')
  @ApiOperation({ summary: 'Edit details of the given user.' })
  async editUser(
    @Param('id') userId: number,
    @Body() editUserDTO: EditUserDto,
  ) {
    await this.usersApplication.editUser(userId, editUserDTO);

    return {
      id: userId,
      message: 'The user has been edited successfully.',
    };
  }

  /**
   * Soft deleting the given user.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Soft deleting the given user.' })
  async deleteUser(@Param('id') userId: number) {
    await this.usersApplication.deleteUser(userId);

    return {
      id: userId,
      message: 'The user has been deleted successfully.',
    };
  }

  /**
   * Retrieve user details of the given user id.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve user details of the given user id.' })
  async getUser(@Param('id') userId: number) {
    const user = await this.usersApplication.getUser(userId);

    return { user };
  }

  /**
   * Retrieve the list of users.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve the list of users.' })
  async listUsers(
    @Query('page_size') pageSize?: number,
    @Query('page') page?: number,
  ) {
    const users = await this.usersApplication.getUsers();

    return { users };
  }

  /**
   * Activate the given user.
   */
  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate the given user.' })
  async activateUser(@Param('id') userId: number) {
    await this.usersApplication.activateUser(userId);

    return {
      id: userId,
      message: 'The user has been activated successfully.',
    };
  }

  /**
   * Inactivate the given user.
   */
  @Put(':id/inactivate')
  @ApiOperation({ summary: 'Inactivate the given user.' })
  async inactivateUser(@Param('id') userId: number) {
    await this.usersApplication.inactivateUser(userId);

    return {
      id: userId,
      message: 'The user has been inactivated successfully.',
    };
  }

  /**
   * Accept a user invitation.
   */
  @Post('invite/accept/:token')
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
  @Get('invite/check/:token')
  @ApiOperation({ summary: 'Check if an invitation token is valid.' })
  async checkInvite(@Param('token') token: string) {
    const inviteDetails = await this.usersApplication.checkInvite(token);

    return inviteDetails;
  }

  /**
   * Send an invitation to a new user.
   */
  @Post('invite')
  @ApiOperation({ summary: 'Send an invitation to a new user.' })
  async sendInvite(@Body() sendInviteDTO: IUserSendInviteDTO) {
    const result = await this.usersApplication.sendInvite(sendInviteDTO);

    return {
      invitedUser: result.invitedUser,
      message: 'The invitation has been sent successfully.',
    };
  }

  /**
   * Resend an invitation to an existing user.
   */
  @Post(':id/invite/resend')
  @ApiOperation({ summary: 'Resend an invitation to an existing user.' })
  async resendInvite(@Param('id') userId: number) {
    const result = await this.usersApplication.resendInvite(userId);

    return {
      user: result.user,
      message: 'The invitation has been resent successfully.',
    };
  }
}
