// @ts-nocheck
import React from 'react';
import { TransactionsLockingListPage as TransactionsLockingList } from './TransactionsLockingList';
import { TransactionsLockingProvider } from './TransactionsLockingProvider';

export function TransactionsLockingPage() {
  return (
    <TransactionsLockingProvider>
      <TransactionsLockingList />
    </TransactionsLockingProvider>
  );
}
