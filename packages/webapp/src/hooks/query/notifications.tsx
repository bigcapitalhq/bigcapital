// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import { transformToCamelCase } from '@/utils';
import t from './types';

/**
 * Interface for notification response from API.
 */
export interface Notification {
  id: number;
  userId: number | null;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  category: 'inventory' | 'billing' | 'system' | 'export' | 'report';
  metadata: Record<string, any> | null;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

/**
 * Interface for notifications list response.
 */
export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
}

/**
 * Options for fetching notifications.
 */
interface UseNotificationsOptions {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  category?: string;
}

/**
 * Retrieves the list of notifications for the authenticated user.
 * @param {UseNotificationsOptions} options - Query options
 * @returns {UseQueryResult<NotificationsResponse>}
 */
export function useNotifications(options: UseNotificationsOptions = {}) {
  const { limit = 20, offset = 0, unreadOnly = false, category, ...props } = options;

  return useRequestQuery<NotificationsResponse>(
    [t.NOTIFICATIONS, { limit, offset, unreadOnly, category }],
    {
      method: 'get',
      url: 'notifications',
      params: {
        limit,
        offset,
        unreadOnly,
        category,
      },
    },
    {
      select: (res) => transformToCamelCase(res.data),
      initialData: { notifications: [], total: 0, unreadCount: 0 },
      ...props,
    },
  );
}

/**
 * Retrieves the unread notifications count.
 * @returns {UseQueryResult<number>}
 */
export function useNotificationsUnreadCount(props = {}) {
  return useRequestQuery<{ count: number }>(
    t.NOTIFICATIONS_UNREAD_COUNT,
    {
      method: 'get',
      url: 'notifications/unread-count',
    },
    {
      select: (res) => res.data.count,
      initialData: 0,
      refetchInterval: 30000, // Refetch every 30 seconds
      ...props,
    },
  );
}

/**
 * Marks a notification as read.
 * @returns {UseMutationResult<Notification, unknown, number>}
 */
export function useMarkNotificationAsRead(props?: any) {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation(
    async (notificationId: number) => {
      const response = await apiRequest.post(`notifications/${notificationId}/read`);
      return transformToCamelCase(response.data.notification);
    },
    {
      onSuccess: () => {
        // Invalidate both queries to refresh the data
        queryClient.invalidateQueries(t.NOTIFICATIONS);
        queryClient.invalidateQueries(t.NOTIFICATIONS_UNREAD_COUNT);
      },
      ...props,
    },
  );
}

/**
 * Marks all notifications as read.
 * @returns {UseMutationResult<number, unknown, void>}
 */
export function useMarkAllNotificationsAsRead(props?: any) {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      const response = await apiRequest.post('notifications/read-all');
      return response.data.markedAsRead;
    },
    {
      onSuccess: () => {
        // Invalidate both queries to refresh the data
        queryClient.invalidateQueries(t.NOTIFICATIONS);
        queryClient.invalidateQueries(t.NOTIFICATIONS_UNREAD_COUNT);
      },
      ...props,
    },
  );
}

/**
 * Deletes a notification.
 * @returns {UseMutationResult<boolean, unknown, number>}
 */
export function useDeleteNotification(props?: any) {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation(
    async (notificationId: number) => {
      const response = await apiRequest.post(`notifications/${notificationId}/delete`);
      return response.data.deleted;
    },
    {
      onSuccess: () => {
        // Invalidate both queries to refresh the data
        queryClient.invalidateQueries(t.NOTIFICATIONS);
        queryClient.invalidateQueries(t.NOTIFICATIONS_UNREAD_COUNT);
      },
      ...props,
    },
  );
}
