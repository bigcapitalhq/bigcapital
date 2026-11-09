import React from 'react';
import { RecognizedTransactionsTable } from '../RecognizedTransactions/RecognizedTransactionsTable';
import { RecognizedTransactionsTableBoot } from '../RecognizedTransactions/RecognizedTransactionsTableBoot';
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
