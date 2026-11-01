import {
  deleteNotification,
  fetchNotifications,
  fetchUnreadNotificationsCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@bigcapital/sdk-ts';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { useApiFetcher } from '../../useRequest';
import { notificationsKeys } from './query-keys';
import type {
  DeleteNotificationResponse,
  GetNotificationsQuery,
  MarkAllNotificationsAsReadResponse,
  MarkNotificationAsReadResponse,
  NotificationsListResponse,
  UnreadNotificationsCountResponse,
} from '@bigcapital/sdk-ts';

export type { Notification } from '@bigcapital/sdk-ts';

const commonInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: notificationsKeys.all() });
  queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount() });
};

/**
 * Retrieves the list of notifications for the authenticated user.
 */
export function useNotifications(
  query: GetNotificationsQuery = {},
  props?: Omit<
    UseQueryOptions<NotificationsListResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery({
    ...props,
    queryKey: notificationsKeys.list(query),
    queryFn: () => fetchNotifications(fetcher, query),
  });
}

/**
 * Retrieves the unread notifications count.
 */
export function useNotificationsUnreadCount(
  props?: Omit<
    UseQueryOptions<UnreadNotificationsCountResponse, Error, number>,
    'queryKey' | 'queryFn' | 'select'
  >,
) {
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useQuery<UnreadNotificationsCountResponse, Error, number>({
    ...props,
    queryKey: notificationsKeys.unreadCount(),
    queryFn: () => fetchUnreadNotificationsCount(fetcher),
    select: (data) => data.count,
    refetchInterval: 30000,
  });
}

/**
 * Marks a notification as read.
 */
export function useMarkNotificationAsRead(
  props?: UseMutationOptions<MarkNotificationAsReadResponse, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (notificationId: number) =>
      markNotificationAsRead(fetcher, notificationId),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

/**
 * Marks all notifications as read.
 */
export function useMarkAllNotificationsAsRead(
  props?: UseMutationOptions<MarkAllNotificationsAsReadResponse, Error, void>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: () => markAllNotificationsAsRead(fetcher),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}

/**
 * Deletes a notification.
 */
export function useDeleteNotification(
  props?: UseMutationOptions<DeleteNotificationResponse, Error, number>,
) {
  const queryClient = useQueryClient();
  const fetcher = useApiFetcher({ enableCamelCaseTransform: true });

  return useMutation({
    ...props,
    mutationFn: (notificationId: number) =>
      deleteNotification(fetcher, notificationId),
    onSuccess: () => commonInvalidateQueries(queryClient),
  });
}
