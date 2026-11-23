import type { ApiFetcher } from './fetch-utils';
import { paths } from './schema';
import { OpForPath, OpQueryParams, OpResponseBody } from './utils';

export const NOTIFICATIONS_ROUTES = {
  LIST: '/api/notifications',
  UNREAD_COUNT: '/api/notifications/unread-count',
  MARK_AS_READ: '/api/notifications/{id}/read',
  MARK_ALL_AS_READ: '/api/notifications/read-all',
  DELETE: '/api/notifications/{id}/delete',
} as const satisfies Record<string, keyof paths>;

type ListOp = OpForPath<typeof NOTIFICATIONS_ROUTES.LIST, 'get'>;
type UnreadCountOp = OpForPath<typeof NOTIFICATIONS_ROUTES.UNREAD_COUNT, 'get'>;
type MarkAsReadOp = OpForPath<typeof NOTIFICATIONS_ROUTES.MARK_AS_READ, 'post'>;
type MarkAllAsReadOp = OpForPath<
  typeof NOTIFICATIONS_ROUTES.MARK_ALL_AS_READ,
  'post'
>;
type DeleteOp = OpForPath<typeof NOTIFICATIONS_ROUTES.DELETE, 'post'>;

export type NotificationsListResponse = OpResponseBody<ListOp>;
export type Notification = NotificationsListResponse['notifications'][number];
export type GetNotificationsQuery = OpQueryParams<ListOp>;
export type UnreadNotificationsCountResponse = OpResponseBody<UnreadCountOp>;
export type MarkNotificationAsReadResponse = OpResponseBody<MarkAsReadOp>;
export type MarkAllNotificationsAsReadResponse = OpResponseBody<MarkAllAsReadOp>;
export type DeleteNotificationResponse = OpResponseBody<DeleteOp>;

export async function fetchNotifications(
  fetcher: ApiFetcher,
  query?: GetNotificationsQuery,
): Promise<NotificationsListResponse> {
  const get = fetcher.path(NOTIFICATIONS_ROUTES.LIST).method('get').create();
  const { data } = await get((query ?? {}) as never);
  return data;
}

export async function fetchUnreadNotificationsCount(
  fetcher: ApiFetcher,
): Promise<UnreadNotificationsCountResponse> {
  const get = fetcher
    .path(NOTIFICATIONS_ROUTES.UNREAD_COUNT)
    .method('get')
    .create();
  const { data } = await get({} as never);
  return data;
}

export async function markNotificationAsRead(
  fetcher: ApiFetcher,
  id: number,
): Promise<MarkNotificationAsReadResponse> {
  const post = fetcher
    .path(NOTIFICATIONS_ROUTES.MARK_AS_READ)
    .method('post')
    .create();
  const { data } = await post({ id });
  return data;
}

export async function markAllNotificationsAsRead(
  fetcher: ApiFetcher,
): Promise<MarkAllNotificationsAsReadResponse> {
  const post = fetcher
    .path(NOTIFICATIONS_ROUTES.MARK_ALL_AS_READ)
    .method('post')
    .create();
  const { data } = await post({});
  return data;
}

export async function deleteNotification(
  fetcher: ApiFetcher,
  id: number,
): Promise<DeleteNotificationResponse> {
  const post = fetcher
    .path(NOTIFICATIONS_ROUTES.DELETE)
    .method('post')
    .create();
  const { data } = await post({ id });
  return data;
}
