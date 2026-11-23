import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetNotificationsService } from './queries/GetNotifications.service';
import { CreateNotificationService } from './commands/CreateNotification.service';
import { GetNotificationsQueryDto } from './dtos/GetNotificationsQuery.dto';
import {
  DeleteNotificationResponseDto,
  MarkAllNotificationsAsReadResponseDto,
  MarkNotificationAsReadResponseDto,
  NotificationsListResponseDto,
  UnreadNotificationsCountResponseDto,
} from './dtos/NotificationResponse.dto';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

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
  @ApiOkResponse({
    description: 'The notifications list has been successfully retrieved.',
    type: NotificationsListResponseDto,
  })
  async getNotifications(@Query() query: GetNotificationsQueryDto) {
    const user = await this.tenancyContext.getSystemUser();
    const options = {
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
      unreadOnly: query.unreadOnly ?? false,
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
    summary: 'Gets the count of unread notifications for the current user.',
  })
  @ApiOkResponse({
    description:
      'The unread notifications count has been successfully retrieved.',
    type: UnreadNotificationsCountResponseDto,
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
  @ApiOkResponse({
    description: 'The notification has been successfully marked as read.',
    type: MarkNotificationAsReadResponseDto,
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
    summary: 'Marks all notifications as read for the current user.',
  })
  @ApiOkResponse({
    description: 'All notifications have been successfully marked as read.',
    type: MarkAllNotificationsAsReadResponseDto,
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
  @ApiOkResponse({
    description: 'The notification has been successfully deleted.',
    type: DeleteNotificationResponseDto,
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
