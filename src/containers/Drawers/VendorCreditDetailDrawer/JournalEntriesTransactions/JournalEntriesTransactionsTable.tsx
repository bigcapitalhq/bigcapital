import React from 'react';
import { DataTable, Card } from 'components';

import { useVendorCreditDetailDrawerContext } from '../VendorCreditDetailDrawerProvider';
import { useTransactionsByReference } from 'hooks/query';
import { useJournalEntriesTransactionsColumns } from './components';

import JournalEntriesTable, {
  AmountDisplayedBaseCurrencyMessage,
} from '../../../JournalEntriesTable/JournalEntriesTable';

/**
 * Journal entries vendor credit transactions table.
 */
export function VendorCreditGLEntriesTable() {
  const { vendorCreditId } = useVendorCreditDetailDrawerContext();

  const columns = useJournalEntriesTransactionsColumns();

  // Handle fetch transaction by reference.
  const {
    data: { transactions },
    isLoading: isTransactionLoading,
  } = useTransactionsByReference(
    {
      reference_id: vendorCreditId,
      reference_type: 'vendorCredit',
    },
    { enabled: !!vendorCreditId },
  );

  return (
    <Card>
      <AmountDisplayedBaseCurrencyMessage />
      <JournalEntriesTable
        columns={columns}
        data={transactions}
        loading={isTransactionLoading}
      />
    </Card>
  );
}
