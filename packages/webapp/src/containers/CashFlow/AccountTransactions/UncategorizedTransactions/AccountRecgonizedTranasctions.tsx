import React from 'react';
import { RecognizedTransactionsTableBoot } from '../RecognizedTransactions/RecognizedTransactionsTableBoot';
import { RecognizedTransactionsTable } from '../RecognizedTransactions/RecognizedTransactionsTable';
import { AccountTransactionsCard } from './AccountTransactionsCard';

export function AccountRecognizedTransactions() {
  return (
    <RecognizedTransactionsTableBoot>
      <AccountTransactionsCard>
        <RecognizedTransactionsTable />
      </AccountTransactionsCard>
    </RecognizedTransactionsTableBoot>
  );
}
