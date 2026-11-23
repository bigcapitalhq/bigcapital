import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  AmountDisplayedBaseCurrencyMessage,
  JournalEntriesTable,
} from '../../JournalEntriesTable/JournalEntriesTable';
import { useRefundVendorCreditNoteDrawerContext } from './RefundVendorCreditDrawerProvider';
import { Card, SegmentedControl } from '@/components';
import {
  useCurrentOrganizationAccountingBasis,
  useTransactionsByReference,
  type AccountingBasis,
} from '@/hooks/query';

/**
 * Refund vendor credit GL entries panel.
 */
export function RefundVendorCreditGLEntriesPanel() {
  const { refundTransactionId } = useRefundVendorCreditNoteDrawerContext();

  // Retrieves the organization accounting basis to use it as the default.
  const organizationBasis = useCurrentOrganizationAccountingBasis();
  const [selectedBasis, setSelectedBasis] =
    React.useState<AccountingBasis | null>(null);

  const basis: AccountingBasis = selectedBasis ?? organizationBasis;

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionsLoading } = useTransactionsByReference(
    {
      referenceId: refundTransactionId as number,
      referenceType: 'RefundVendorCredit',
      basis,
    },
    { enabled: !!refundTransactionId },
  );
  const transactions = data?.transactions ?? [];

  return (
    <RefundVendorCreditGLEntriesRoot>
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
        loading={isTransactionsLoading}
        transactions={transactions}
      />
    </RefundVendorCreditGLEntriesRoot>
  );
}

const TableHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const RefundVendorCreditGLEntriesRoot = styled(Card)``;
