import { Intent } from '@blueprintjs/core';
import { useAuthUserId } from '@/hooks/state';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { AppToaster, FormattedMessage as T } from '@/components';
import { workspacesKeys } from '@/ee/workspaces/hooks/query';
import { AccountsQueryKeys } from '@/hooks/query/accounts';
import { CashflowAccountsQueryKeys } from '@/hooks/query/cashflow-accounts';

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
      client.invalidateQueries({ queryKey: [AccountsQueryKeys.ACCOUNTS] });
      client.invalidateQueries({
        queryKey: [AccountsQueryKeys.ACCOUNT_TRANSACTION],
      });
      client.invalidateQueries({
        queryKey: [CashflowAccountsQueryKeys.CASH_FLOW_ACCOUNTS],
      });
      client.invalidateQueries({
        queryKey: [CashflowAccountsQueryKeys.CASH_FLOW_TRANSACTIONS],
      });

      AppToaster.show({
        message: 'The Plaid connected accounts have been updated.',
        intent: Intent.SUCCESS,
      });
    });

    socket.current.on('SUBSCRIPTION_CHANGED', () => {
      client.invalidateQueries({ queryKey: ['GetSubscriptions'] });
    });
    socket.current.on('WORKSPACES_CHANGED', () => {
      client.invalidateQueries({ queryKey: workspacesKeys.all() });
      AppToaster.show({
        message: <T id={'workspaces.workspace_ready_to_switch'} />,
        intent: Intent.SUCCESS,
      });
    });

    // Listen for real-time notifications
    socket.current.on('NOTIFICATION', (notification: any) => {
      // Invalidate notification queries to refresh counts and lists
      client.invalidateQueries(t.NOTIFICATIONS);
      client.invalidateQueries(t.NOTIFICATIONS_UNREAD_COUNT);

      // Show toast notification
      AppToaster.show({
        message: notification.title,
        intent:
          notification.type === 'error'
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
  return null;
}
