import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersApplication } from './Users.application';
import { EditUserDto } from './dtos/EditUser.dto';

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
    return this.usersApplication.getUser(userId);
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
    return this.usersApplication.getUsers();
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

}
