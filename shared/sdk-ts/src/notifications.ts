import type { ApiFetcher } from './fetch-utils';
import { rawRequest } from './fetch-utils';

export const NOTIFICATIONS_ROUTES = {
  LIST: '/api/notifications',
  UNREAD_COUNT: '/api/notifications/unread-count',
  MARK_AS_READ: '/api/notifications/{id}/read',
  MARK_ALL_AS_READ: '/api/notifications/read-all',
  DELETE: '/api/notifications/{id}/delete',
} as const;

export interface GetNotificationsQuery {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
  category?: string;
}

export async function fetchNotifications(
  fetcher: ApiFetcher,
  query?: GetNotificationsQuery
): Promise<unknown> {
  const params = new URLSearchParams();
  if (query?.limit !== undefined) params.set('limit', String(query.limit));
  if (query?.offset !== undefined) params.set('offset', String(query.offset));
  if (query?.unreadOnly !== undefined) params.set('unreadOnly', String(query.unreadOnly));
  if (query?.category) params.set('category', query.category);

  const qs = params.toString();
  const path = qs ? `${NOTIFICATIONS_ROUTES.LIST}?${qs}` : NOTIFICATIONS_ROUTES.LIST;
  return rawRequest(fetcher, 'GET', path);
}

export async function fetchUnreadNotificationsCount(
  fetcher: ApiFetcher
): Promise<unknown> {
  return rawRequest(fetcher, 'GET', NOTIFICATIONS_ROUTES.UNREAD_COUNT);
}

export async function markNotificationAsRead(
  fetcher: ApiFetcher,
  id: number
): Promise<unknown> {
  return rawRequest(fetcher, 'POST', `/api/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(
  fetcher: ApiFetcher
): Promise<unknown> {
  return rawRequest(fetcher, 'POST', NOTIFICATIONS_ROUTES.MARK_ALL_AS_READ);
}

export async function deleteNotification(
  fetcher: ApiFetcher,
  id: number
): Promise<unknown> {
  return rawRequest(fetcher, 'POST', `/api/notifications/${id}/delete`);
}
