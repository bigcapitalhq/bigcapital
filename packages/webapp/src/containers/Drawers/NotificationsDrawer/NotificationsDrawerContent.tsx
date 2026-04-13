// @ts-nocheck
import React, { useState } from 'react';
import { Button, NonIdealState, Spinner, Intent, Tab, Tabs } from '@blueprintjs/core';
import { NotificationItem } from './NotificationItem';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
  Notification,
} from '@/hooks/query/notifications';
import styles from './NotificationsDrawer.module.scss';

/**
 * Notifications drawer content.
 */
export default function NotificationsDrawerContent() {
  const [activeTab, setActiveTab] = useState('all');
  const unreadOnly = activeTab === 'unread';

  const { data, isLoading, error } = useNotifications({ unreadOnly });
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.readAt) {
      markAsRead.mutate(notification.id);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const handleDelete = (notificationId: number) => {
    deleteNotification.mutate(notificationId);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <NonIdealState
        icon="error"
        title="Error loading notifications"
        description={error.message || 'Something went wrong'}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Tabs selectedTabId={activeTab} onChange={(tabId) => setActiveTab(tabId)}>
          <Tab id="all" title={`All (${data?.total || 0})`} />
          <Tab id="unread" title={`Unread (${unreadCount})`} />
        </Tabs>
        {unreadCount > 0 && (
          <Button
            minimal
            small
            intent={Intent.PRIMARY}
            onClick={handleMarkAllAsRead}
            loading={markAllAsRead.isLoading}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className={styles.notificationsList}>
        {notifications.length === 0 ? (
          <NonIdealState
            icon="notifications"
            title="No notifications"
            description={
              unreadOnly
                ? "You don't have any unread notifications."
                : "You don't have any notifications yet."
            }
          />
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={handleNotificationClick}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
