import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TenantNotification } from '../models/Notification.model';

export interface CreateNotificationPayload {
  userId?: number | null;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  category?: 'inventory' | 'billing' | 'system' | 'export' | 'report';
  metadata?: Record<string, any>;
}

@Injectable()
export class CreateNotificationService {
  constructor(
    @Inject(TenantNotification.name)
    private readonly notificationModel: TenantModelProxy<typeof TenantNotification>,
  ) {}

  /**
   * Creates a new notification.
   * @param {CreateNotificationPayload} payload - Notification data
   * @returns {Promise<TenantNotification>}
   */
  async createNotification(payload: CreateNotificationPayload): Promise<TenantNotification> {
    const notification = await this.notificationModel().query().insert({
      userId: payload.userId ?? null,
      title: payload.title,
      message: payload.message,
      type: payload.type ?? 'info',
      category: payload.category ?? 'system',
      metadata: payload.metadata ?? null,
      readAt: null,
    });

    return notification;
  }

  /**
   * Marks a notification as read.
   * @param {number} notificationId - The notification ID
   * @param {number} userId - The user ID (for authorization)
   * @returns {Promise<TenantNotification | null>}
   */
  async markAsRead(notificationId: number, userId: number): Promise<TenantNotification | null> {
    const notification = await this.notificationModel()
      .query()
      .findById(notificationId)
      .modify('forUser', userId);

    if (!notification) {
      return null;
    }

    await this.notificationModel()
      .query()
      .findById(notificationId)
      .patch({ readAt: new Date() });

    return this.notificationModel().query().findById(notificationId);
  }

  /**
   * Marks all notifications as read for a user.
   * @param {number} userId - The user ID
   * @returns {Promise<number>} - Number of notifications marked as read
   */
  async markAllAsRead(userId: number): Promise<number> {
    const result = await this.notificationModel()
      .query()
      .modify('forUser', userId)
      .modify('unread')
      .patch({ readAt: new Date() });

    return Array.isArray(result) ? result.length : 0;
  }

  /**
   * Deletes a notification.
   * @param {number} notificationId - The notification ID
   * @param {number} userId - The user ID (for authorization)
   * @returns {Promise<boolean>}
   */
  async deleteNotification(notificationId: number, userId: number): Promise<boolean> {
    const notification = await this.notificationModel()
      .query()
      .findById(notificationId)
      .modify('forUser', userId);

    if (!notification) {
      return false;
    }

    await this.notificationModel().query().deleteById(notificationId);
    return true;
  }
}
