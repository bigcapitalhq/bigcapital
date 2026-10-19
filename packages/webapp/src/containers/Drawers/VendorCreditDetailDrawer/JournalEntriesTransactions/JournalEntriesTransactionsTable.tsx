import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useVendorCreditDetailDrawerContext } from '../VendorCreditDetailDrawerProvider';
import { useJournalEntriesTransactionsColumns } from './components';
import type { GLTransactionRow } from '@/containers/JournalEntriesTable/utils';
import { Card, SegmentedControl } from '@/components';
import {
  AmountDisplayedBaseCurrencyMessage,
  JournalEntriesTable,
} from '@/containers/JournalEntriesTable/JournalEntriesTable';
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
 * Journal entries vendor credit transactions table.
 */
export function VendorCreditGLEntriesTable() {
  const { vendorCreditId } = useVendorCreditDetailDrawerContext();

  // Journal entries transactions columns.
  const columns = useJournalEntriesTransactionsColumns();

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
      referenceId: vendorCreditId ?? 0,
      referenceType: 'VendorCredit',
    },
    { enabled: !!vendorCreditId },
  );
  const transactions = React.useMemo(
    () =>
      (data?.transactions ?? []).filter((leg) => isLegWithinBasis(leg, basis)),
    [data, basis],
  );

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
