import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenantNotification } from '../models/Notification.model';

interface GetNotificationsOptions {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  category?: string;
}

@Injectable()
export class GetNotificationsService {
  constructor(
    @Inject(TenantNotification.name)
    private readonly notificationModel: TenantModelProxy<typeof TenantNotification>,
  ) {}

  /**
   * Retrieves notifications for a user with pagination and filtering.
   * @param {number} userId - The user ID
   * @param {GetNotificationsOptions} options - Query options
   * @returns {Promise<{ notifications: TenantNotification[]; total: number; unreadCount: number }>}
   */
  async getNotifications(
    userId: number,
    options: GetNotificationsOptions = {},
  ): Promise<{ notifications: TenantNotification[]; total: number; unreadCount: number }> {
    const { limit = 20, offset = 0, unreadOnly = false, category } = options;

    // Build base query for user's notifications
    let query = this.notificationModel()
      .query()
      .modify('forUser', userId)
      .modify('newestFirst');

    // Apply category filter if specified
    if (category) {
      query = query.modify('byCategory', category);
    }

    // Apply unread filter if specified
    if (unreadOnly) {
      query = query.modify('unread');
    }

    // Get total count for pagination
    const countQuery = this.notificationModel()
      .query()
      .modify('forUser', userId)
      .modify(unreadOnly ? 'unread' : 'newestFirst');

    if (category && !unreadOnly) {
      countQuery.modify('byCategory', category);
    }

    const [notifications, totalResult, unreadCountResult] = await Promise.all([
      query.limit(limit).offset(offset),
      countQuery.resultSize(),
      this.getUnreadCount(userId),
    ]);

    return {
      notifications,
      total: unreadOnly ? notifications.length : totalResult,
      unreadCount: unreadCountResult,
    };
  }

  /**
   * Gets the count of unread notifications for a user.
   * @param {number} userId - The user ID
   * @returns {Promise<number>}
   */
  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationModel()
      .query()
      .modify('forUser', userId)
      .modify('unread')
      .resultSize();
  }
}
