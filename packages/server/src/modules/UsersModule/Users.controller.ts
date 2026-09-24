import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { UsersApplication } from './Users.application';
import { EditUserDto } from './dtos/EditUser.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { UserDto } from './dtos/UserResponse.dto';
import { AuthorizationGuard } from '../Roles/Authorization.guard';
import { PermissionGuard } from '../Roles/Permission.guard';
import { RequirePermission } from '../Roles/RequirePermission.decorator';
import { AbilitySubject, UserAction } from '../Roles/Roles.types';

@Controller('users')
@ApiTags('Users')
@ApiExtraModels(UserDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class UsersController {
  constructor(private readonly usersApplication: UsersApplication) {}

  /**
   * Edit details of the given user.
   */
  @Put(':id')
  @RequirePermission(UserAction.Edit, AbilitySubject.User)
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
  @RequirePermission(UserAction.Delete, AbilitySubject.User)
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
  @RequirePermission(UserAction.View, AbilitySubject.User)
  @ApiOperation({ summary: 'Retrieve user details of the given user id.' })
  @ApiResponse({
    status: 200,
    description: 'User details retrieved successfully.',
    schema: { $ref: getSchemaPath(UserDto) },
  })
  async getUser(@Param('id') userId: number) {
    return this.usersApplication.getUser(userId);
  }

  /**
   * Retrieve the list of users.
   */
  @Get()
  @RequirePermission(UserAction.View, AbilitySubject.User)
  @ApiOperation({ summary: 'Retrieve the list of users.' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(UserDto) },
    },
  })
  async listUsers(
    @Query('page_size') _pageSize?: number,
    @Query('page') _page?: number,
  ) {
    return this.usersApplication.getUsers();
  }

  /**
   * Activate the given user.
   */
  @Put(':id/activate')
  @RequirePermission(UserAction.Activate, AbilitySubject.User)
  @ApiOperation({ summary: 'Activate the given user.' })
  @ApiResponse({
    status: 200,
    description: 'The user has been activated successfully.',
    schema: {
      example: { id: 1, message: 'The user has been activated successfully.' },
    },
  })
  async activateUser(@Param('id', ParseIntPipe) userId: number) {
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
  @RequirePermission(UserAction.Activate, AbilitySubject.User)
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
  async inactivateUser(@Param('id', ParseIntPipe) userId: number) {
    await this.usersApplication.inactivateUser(userId);

    return {
      id: userId,
      message: 'The user has been inactivated successfully.',
    };
  }
}
