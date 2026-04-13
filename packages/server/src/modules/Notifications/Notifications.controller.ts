import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { IsNumber, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { GetNotificationsService } from './queries/GetNotifications.service';
import { CreateNotificationService } from './commands/CreateNotification.service';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { IsOptional } from '@/common/decorators/Validators';

class MarkAsReadDto {
  notificationId: number;
}

class GetNotificationsQueryDto {
  @ApiPropertyOptional({ description: 'Number of notifications per page', example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Offset for pagination', example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;

  @ApiPropertyOptional({ description: 'Filter to only unread notifications' })
  @IsOptional()
  @IsString()
  @IsIn(['true', 'false'])
  unreadOnly?: string;

  @ApiPropertyOptional({ description: 'Filter by notification category' })
  @IsOptional()
  @IsString()
  category?: string;
}

@Controller('notifications')
@ApiTags('Notifications')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class NotificationsController {
  constructor(
    private readonly getNotificationsService: GetNotificationsService,
    private readonly createNotificationService: CreateNotificationService,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Retrieves the list of notifications for the current user.
   * @param {GetNotificationsQueryDto} query - Query parameters
   * @returns {Promise<{ notifications: Notification[]; total: number; unreadCount: number }>}
   */
  @Get()
  @ApiOperation({
    summary: 'Retrieves the list of notifications for the current user.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of notifications per page',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset for pagination',
  })
  @ApiQuery({
    name: 'unreadOnly',
    required: false,
    type: Boolean,
    description: 'Filter to only unread notifications',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by notification category',
  })
  @ApiResponse({
    status: 200,
    description:
      'The notifications list has been successfully retrieved.',
  })
  async getNotifications(@Query() query: GetNotificationsQueryDto) {
    const user = await this.tenancyContext.getSystemUser();
    const options = {
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
      unreadOnly: query.unreadOnly === 'true',
      category: query.category,
    };

    return this.getNotificationsService.getNotifications(user.id, options);
  }

  /**
   * Gets the count of unread notifications for the current user.
   * @returns {Promise<{ count: number }>}
   */
  @Get('unread-count')
  @ApiOperation({
    summary:
      'Gets the count of unread notifications for the current user.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The unread notifications count has been successfully retrieved.',
  })
  async getUnreadCount() {
    const user = await this.tenancyContext.getSystemUser();
    const count = await this.getNotificationsService.getUnreadCount(user.id);
    return { count };
  }

  /**
   * Marks a notification as read.
   * @param {number} notificationId - Notification ID
   * @returns {Promise<{ notification: Notification | null }>}
   */
  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marks a notification as read.' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The notification id',
  })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully marked as read.',
  })
  async markAsRead(@Param('id', ParseIntPipe) notificationId: number) {
    const user = await this.tenancyContext.getSystemUser();
    const notification = await this.createNotificationService.markAsRead(
      notificationId,
      user.id,
    );
    return { notification };
  }

  /**
   * Marks all notifications as read for the current user.
   * @returns {Promise<{ markedAsRead: number }>}
   */
  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Marks all notifications as read for the current user.',
  })
  @ApiResponse({
    status: 200,
    description:
      'All notifications have been successfully marked as read.',
  })
  async markAllAsRead() {
    const user = await this.tenancyContext.getSystemUser();
    const markedAsRead = await this.createNotificationService.markAllAsRead(
      user.id,
    );
    return { markedAsRead };
  }

  /**
   * Deletes a notification.
   * @param {number} notificationId - Notification ID
   * @returns {Promise<{ deleted: boolean }>}
   */
  @Post(':id/delete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deletes a notification.' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The notification id',
  })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully deleted.',
  })
  async deleteNotification(@Param('id', ParseIntPipe) notificationId: number) {
    const user = await this.tenancyContext.getSystemUser();
    const deleted = await this.createNotificationService.deleteNotification(
      notificationId,
      user.id,
    );
    return { deleted };
  }
}
