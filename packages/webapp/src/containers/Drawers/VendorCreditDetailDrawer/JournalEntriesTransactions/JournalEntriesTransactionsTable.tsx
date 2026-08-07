import React from 'react';
import { useVendorCreditDetailDrawerContext } from '../VendorCreditDetailDrawerProvider';
import { useJournalEntriesTransactionsColumns } from './components';
import { Card } from '@/components';
import {
  AmountDisplayedBaseCurrencyMessage,
  JournalEntriesTable,
} from '@/containers/JournalEntriesTable/JournalEntriesTable';
import { useTransactionsByReference } from '@/hooks/query';

/**
 * Journal entries vendor credit transactions table.
 */
export function VendorCreditGLEntriesTable() {
  const { vendorCreditId } = useVendorCreditDetailDrawerContext();
  const columns = useJournalEntriesTransactionsColumns();

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionLoading } = useTransactionsByReference(
    {
      referenceId: vendorCreditId ?? 0,
      referenceType: 'vendorCredit',
    },
    { enabled: !!vendorCreditId },
  );
  const transactions = data?.transactions ?? [];

  return (
    <Card>
      <AmountDisplayedBaseCurrencyMessage />
      <JournalEntriesTable
        columns={columns}
        transactions={transactions}
        loading={isTransactionLoading}
      />
    </Card>
  );
}
