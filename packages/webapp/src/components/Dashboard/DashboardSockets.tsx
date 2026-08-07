import { Intent } from '@blueprintjs/core';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { AppToaster } from '@/components';
import { AccountsQueryKeys } from '@/hooks/query/accounts';
import { CashflowAccountsQueryKeys } from '@/hooks/query/cashflow-accounts';

export function DashboardSockets() {
  const socket = useRef<any>();
  const client = useQueryClient();

  useEffect(() => {
    socket.current = io('/', { path: '/socket' });

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
      client.invalidateQueries({ queryKey: ['workspaces'] });
    });
    return () => {
      socket.current.removeAllListeners();
      socket.current.close();
    };
  }, []);
  return null;
}
