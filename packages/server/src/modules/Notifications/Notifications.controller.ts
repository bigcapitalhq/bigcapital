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
} from '@nestjs/common';
import { IsIn, IsInt, IsString, Min } from 'class-validator';
import { ToNumber, IsOptional } from '@/common/decorators/Validators';
import { GetNotificationsService } from './queries/GetNotifications.service';
import { CreateNotificationService } from './commands/CreateNotification.service';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

class MarkAsReadDto {
  notificationId: number;
}

class GetNotificationsQueryDto {
  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @ToNumber()
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsIn(['true', 'false'])
  unreadOnly?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

@Controller('notifications')
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
  async deleteNotification(@Param('id', ParseIntPipe) notificationId: number) {
    const user = await this.tenancyContext.getSystemUser();
    const deleted = await this.createNotificationService.deleteNotification(
      notificationId,
      user.id,
    );
    return { deleted };
  }
}
