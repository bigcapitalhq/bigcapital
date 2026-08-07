import React from 'react';
import { AccountTransactionsCard } from '../UncategorizedTransactions/AccountTransactionsCard';
import { PendingTransactionsDataTable } from './PendingTransactionsTable';
import { PendingTransactionsBoot } from './PendingTransactionsTableBoot';

export function PendingTransactions() {
  return (
    <PendingTransactionsBoot>
      <AccountTransactionsCard>
        <PendingTransactionsDataTable />
      </AccountTransactionsCard>
    </PendingTransactionsBoot>
  );
}
