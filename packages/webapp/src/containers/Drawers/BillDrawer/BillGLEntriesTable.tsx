import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  AmountDisplayedBaseCurrencyMessage,
  JournalEntriesTable,
} from '../../JournalEntriesTable/JournalEntriesTable';
import { useBillDrawerContext } from './BillDrawerProvider';
import type { GLTransactionRow } from '@/containers/JournalEntriesTable/utils';
import { Card, SegmentedControl } from '@/components';
import {
  useSettingsOrganization,
  useTransactionsByReference,
} from '@/hooks/query';

type AccountingBasis = 'accrual' | 'cash';

/**
 * Determines whether the given journal entry leg is within the given
 * accounting basis. The general (unflagged) legs are included in both.
 */
function isLegWithinBasis(leg: GLTransactionRow, basis: AccountingBasis) {
  const legBasis = leg.basis ?? 'general';

  if (basis === 'cash') {
    return legBasis === 'cash' || legBasis === 'general';
  }
  return legBasis === 'accrual' || legBasis === 'general';
}

/**
 * Bill GL entries table.
 * @returns {React.JSX}
 */
export function BillGLEntriesTable() {
  const { billId } = useBillDrawerContext();

  // Retrieves the organization accounting basis to use it as the default.
  const { data: organizationSettings } = useSettingsOrganization();
  const [selectedBasis, setSelectedBasis] =
    React.useState<AccountingBasis | null>(null);

  const organizationBasis = organizationSettings?.accountingBasis as
    | string
    | undefined;
  const basis: AccountingBasis =
    selectedBasis ?? (organizationBasis === 'cash' ? 'cash' : 'accrual');

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionLoading } = useTransactionsByReference(
    {
      referenceId: billId as number,
      referenceType: 'Bill',
    },
    { enabled: !!billId },
  );
  const transactions = React.useMemo(
    () =>
      (data?.transactions ?? []).filter((leg) => isLegWithinBasis(leg, basis)),
    [data, basis],
  );

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
