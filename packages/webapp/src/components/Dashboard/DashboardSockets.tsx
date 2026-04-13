import { useEffect, useRef } from 'react';
import { useQueryClient } from 'react-query';
import { io } from 'socket.io-client';
import t from '@/hooks/query/types';
import { AppToaster } from '@/components';
import { Intent } from '@blueprintjs/core';
import { useAuthUserId } from '@/hooks/state';

export function DashboardSockets() {
  const socket = useRef<any>();
  const client = useQueryClient();
  const userId = useAuthUserId();

  useEffect(() => {
    socket.current = io('/', { path: '/socket' });

    // Join user-specific room for targeted notifications
    if (userId) {
      socket.current.emit('join-user-room', { userId: Number(userId) });
    }

    socket.current.on('NEW_TRANSACTIONS_DATA', () => {
      client.invalidateQueries(t.ACCOUNTS);
      client.invalidateQueries(t.ACCOUNT_TRANSACTION);
      client.invalidateQueries(t.CASH_FLOW_ACCOUNTS);
      client.invalidateQueries(t.CASH_FLOW_TRANSACTIONS);

      AppToaster.show({
        message: 'The Plaid connected accounts have been updated.',
        intent: Intent.SUCCESS,
      });
    });

    socket.current.on('SUBSCRIPTION_CHANGED', () => {
      client.invalidateQueries('GetSubscriptions');
    });

    // Listen for real-time notifications
    socket.current.on('NOTIFICATION', (notification: any) => {
      // Invalidate notification queries to refresh counts and lists
      client.invalidateQueries(t.NOTIFICATIONS);
      client.invalidateQueries(t.NOTIFICATIONS_UNREAD_COUNT);

      // Show toast notification
      AppToaster.show({
        message: notification.title,
        intent: notification.type === 'error'
          ? Intent.DANGER
          : notification.type === 'warning'
            ? Intent.WARNING
            : notification.type === 'success'
              ? Intent.SUCCESS
              : Intent.PRIMARY,
        timeout: 5000,
      });
    });

    return () => {
      // Leave user room before disconnecting
      if (userId) {
        socket.current?.emit('leave-user-room', { userId: Number(userId) });
      }
      socket.current.removeAllListeners();
      socket.current.close();
    };
  }, [userId]);
}
