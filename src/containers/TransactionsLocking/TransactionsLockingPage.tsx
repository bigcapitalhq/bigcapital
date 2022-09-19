// @ts-nocheck
import React from 'react';

import { TransactionsLockingProvider } from './TransactionsLockingProvider';
import TransactionsLockingList from './TransactionsLockingList';

export default function TransactionsLockingPage() {
  return (
    <TransactionsLockingProvider>
      <TransactionsLockingList />
    </TransactionsLockingProvider>
  );
}
