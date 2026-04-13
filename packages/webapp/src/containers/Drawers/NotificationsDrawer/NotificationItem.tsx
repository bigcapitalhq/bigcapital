// @ts-nocheck
import React from 'react';
import { Icon, Intent, Tooltip, Position } from '@blueprintjs/core';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '@/hooks/query/notifications';
import styles from './NotificationsDrawer.module.scss';

interface NotificationItemProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
  onDelete?: (notificationId: number) => void;
}

/**
 * Gets the icon based on notification type.
 * @param {string} type - Notification type
 * @returns {{ icon: string; intent: Intent }}
 */
function getTypeIcon(type: string): { icon: string; intent: Intent } {
  switch (type) {
    case 'success':
      return { icon: 'tick-circle', intent: Intent.SUCCESS };
    case 'warning':
      return { icon: 'warning-sign', intent: Intent.WARNING };
    case 'error':
      return { icon: 'error', intent: Intent.DANGER };
    case 'info':
    default:
      return { icon: 'info-sign', intent: Intent.PRIMARY };
  }
}

/**
 * Notification item component.
 */
export function NotificationItem({ notification, onClick, onDelete }: NotificationItemProps) {
  const { icon, intent } = getTypeIcon(notification.type);
  const isUnread = !notification.readAt;

  const handleClick = () => {
    if (onClick && isUnread) {
      onClick(notification);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  return (
    <div
      className={`${styles.notificationItem} ${isUnread ? styles.unread : ''}`}
      onClick={handleClick}
    >
      <div className={styles.iconContainer}>
        <Icon icon={icon} intent={intent} iconSize={20} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.title}>{notification.title}</h4>
          <Tooltip
            content={new Date(notification.createdAt).toLocaleString()}
            position={Position.TOP}
          >
            <span className={styles.timestamp}>
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
          </Tooltip>
        </div>
        <p className={styles.message}>{notification.message}</p>
        {notification.category && (
          <span className={styles.category}>{notification.category}</span>
        )}
      </div>
      <div className={styles.actions}>
        <Tooltip content="Delete" position={Position.TOP}>
          <button className={styles.deleteButton} onClick={handleDelete}>
            <Icon icon="cross" iconSize={14} />
          </button>
        </Tooltip>
        {isUnread && <div className={styles.unreadIndicator} />}
      </div>
    </div>
  );
}
