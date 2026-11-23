import type { GetNotificationsQuery } from '@bigcapital/sdk-ts';

// Query key constants
export const NOTIFICATIONS = 'NOTIFICATIONS';
export const NOTIFICATIONS_UNREAD_COUNT = 'NOTIFICATIONS_UNREAD_COUNT';

// Query key factory
export const notificationsKeys = {
  all: () => [NOTIFICATIONS] as const,
  list: (query?: GetNotificationsQuery) => [NOTIFICATIONS, query] as const,
  unreadCount: () => [NOTIFICATIONS_UNREAD_COUNT] as const,
};

// Grouped object for use in components/hooks
export const NotificationsQueryKeys = {
  NOTIFICATIONS,
  NOTIFICATIONS_UNREAD_COUNT,
} as const;
