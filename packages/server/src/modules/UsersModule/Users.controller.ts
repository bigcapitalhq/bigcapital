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
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { UsersApplication } from './Users.application';
import { EditUserDto } from './dtos/EditUser.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('users')
@ApiTags('Users')
@ApiCommonHeaders()
export class UsersController {
  constructor(private readonly usersApplication: UsersApplication) {}

  /**
   * Edit details of the given user.
   */
  @Post(':id')
  @ApiOperation({ summary: 'Edit details of the given user.' })
  @ApiResponse({
    status: 200,
    description: 'The user has been edited successfully.',
    schema: {
      example: { id: 1, message: 'The user has been edited successfully.' },
    },
  })
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
  @ApiResponse({
    status: 200,
    description: 'The user has been deleted successfully.',
    schema: {
      example: { id: 1, message: 'The user has been deleted successfully.' },
    },
  })
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
  @ApiResponse({
    status: 200,
    description: 'User details retrieved successfully.',
  })
  async getUser(@Param('id') userId: number) {
    return this.usersApplication.getUser(userId);
  }

  /**
   * Retrieve the list of users.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve the list of users.' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
  })
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
  @ApiResponse({
    status: 200,
    description: 'The user has been activated successfully.',
    schema: {
      example: { id: 1, message: 'The user has been activated successfully.' },
    },
  })
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
  @ApiResponse({
    status: 200,
    description: 'The user has been inactivated successfully.',
    schema: {
      example: {
        id: 1,
        message: 'The user has been inactivated successfully.',
      },
    },
  })
  async inactivateUser(@Param('id') userId: number) {
    await this.usersApplication.inactivateUser(userId);

    return {
      id: userId,
      message: 'The user has been inactivated successfully.',
    };
  }
}
