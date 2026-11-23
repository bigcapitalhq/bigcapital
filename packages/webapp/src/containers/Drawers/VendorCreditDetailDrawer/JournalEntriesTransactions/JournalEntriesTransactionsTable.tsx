import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useVendorCreditDetailDrawerContext } from '../VendorCreditDetailDrawerProvider';
import { useJournalEntriesTransactionsColumns } from './components';
import { Card, SegmentedControl } from '@/components';
import {
  AmountDisplayedBaseCurrencyMessage,
  JournalEntriesTable,
} from '@/containers/JournalEntriesTable/JournalEntriesTable';
import {
  useCurrentOrganizationAccountingBasis,
  useTransactionsByReference,
  type AccountingBasis,
} from '@/hooks/query';

/**
 * Journal entries vendor credit transactions table.
 */
export function VendorCreditGLEntriesTable() {
  const { vendorCreditId } = useVendorCreditDetailDrawerContext();

  // Journal entries transactions columns.
  const columns = useJournalEntriesTransactionsColumns();

  // Retrieves the organization accounting basis to use it as the default.
  const organizationBasis = useCurrentOrganizationAccountingBasis();
  const [selectedBasis, setSelectedBasis] =
    React.useState<AccountingBasis | null>(null);

  const basis: AccountingBasis = selectedBasis ?? organizationBasis;

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionLoading } = useTransactionsByReference(
    {
      referenceId: vendorCreditId ?? 0,
      referenceType: 'VendorCredit',
      basis,
    },
    { enabled: !!vendorCreditId },
  );
  const transactions = data?.transactions ?? [];

  return (
    <Card>
      <TableHeader>
        <AmountDisplayedBaseCurrencyMessage />
        <SegmentedControl<AccountingBasis>
          value={basis}
          onChange={setSelectedBasis}
          items={[
            { label: intl.get('accrual'), value: 'accrual' },
            { label: intl.get('cash'), value: 'cash' },
          ]}
        />
      </TableHeader>

      <JournalEntriesTable
        columns={columns}
        transactions={transactions}
        loading={isTransactionLoading}
        noResults={
          basis === 'cash'
            ? intl.get('no_cash_basis_journal_entries')
            : undefined
        }
      />
    </Card>
  );
}

const TableHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;
