import React from 'react';
import { AccountTransactionsCard } from '../UncategorizedTransactions/AccountTransactionsCard';
import { PendingTransactionsBoot } from './PendingTransactionsTableBoot';
import { PendingTransactionsDataTable } from './PendingTransactionsTable';

export function PendingTransactions() {
  return (
    <PendingTransactionsBoot>
      <AccountTransactionsCard>
        <PendingTransactionsDataTable />
      </AccountTransactionsCard>
    </PendingTransactionsBoot>
  );
}
