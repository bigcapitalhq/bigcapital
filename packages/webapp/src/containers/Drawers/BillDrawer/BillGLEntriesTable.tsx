import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  AmountDisplayedBaseCurrencyMessage,
  JournalEntriesTable,
} from '../../JournalEntriesTable/JournalEntriesTable';
import { useBillDrawerContext } from './BillDrawerProvider';
import { Card, SegmentedControl } from '@/components';
import {
  useCurrentOrganizationAccountingBasis,
  useTransactionsByReference,
  type AccountingBasis,
} from '@/hooks/query';

/**
 * Bill GL entries table.
 * @returns {React.JSX}
 */
export function BillGLEntriesTable() {
  const { billId } = useBillDrawerContext();

  // Retrieves the organization accounting basis to use it as the default.
  const organizationBasis = useCurrentOrganizationAccountingBasis();
  const [selectedBasis, setSelectedBasis] =
    React.useState<AccountingBasis | null>(null);

  const basis = selectedBasis ?? organizationBasis;

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionLoading } = useTransactionsByReference(
    {
      referenceId: billId as number,
      referenceType: 'Bill',
      basis,
    },
    { enabled: !!billId },
  );
  const transactions = data?.transactions ?? [];

  return (
    <BilleGLEntriesRoot>
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
      <BillGLEntriesDatatable
        loading={isTransactionLoading}
        transactions={transactions}
        noResults={
          basis === 'cash'
            ? intl.get('no_cash_basis_journal_entries')
            : undefined
        }
      />
    </BilleGLEntriesRoot>
  );
}

const TableHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const BilleGLEntriesRoot = styled(Card)``;

const BillGLEntriesDatatable = styled(JournalEntriesTable)`
  .table .tbody .tr:last-child .td {
    border-bottom: 0;
  }
`;
