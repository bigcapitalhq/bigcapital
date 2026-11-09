import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useCreditNoteDetailDrawerContext } from '../CreditNoteDetailDrawerProvider';
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
 * Journal entries table.
 */
export function CreditNoteGLEntriesTable() {
  const { creditNoteId } = useCreditNoteDetailDrawerContext();

  // Credit note GL entries table columns.
  const columns = useJournalEntriesTransactionsColumns();

  // Retrieves the organization accounting basis to use it as the default.
  const organizationBasis = useCurrentOrganizationAccountingBasis();
  const [selectedBasis, setSelectedBasis] =
    React.useState<AccountingBasis | null>(null);

  const basis: AccountingBasis = selectedBasis ?? organizationBasis;

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionLoading } = useTransactionsByReference(
    {
      referenceId: creditNoteId ?? 0,
      referenceType: 'CreditNote',
      basis,
    },
    { enabled: !!creditNoteId },
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
