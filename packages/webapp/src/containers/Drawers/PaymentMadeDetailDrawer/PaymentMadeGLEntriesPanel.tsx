import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  AmountDisplayedBaseCurrencyMessage,
  JournalEntriesTable,
} from '../../JournalEntriesTable/JournalEntriesTable';
import { usePaymentMadeDetailContext } from './PaymentMadeDetailProvider';
import { Card, SegmentedControl } from '@/components';
import {
  useCurrentOrganizationAccountingBasis,
  useTransactionsByReference,
  type AccountingBasis,
} from '@/hooks/query';

/**
 * Payment made GL entries table panel.
 */
export function PaymentMadeGLEntriesPanel() {
  const { paymentMadeId } = usePaymentMadeDetailContext();

  // Retrieves the organization accounting basis to use it as the default.
  const organizationBasis = useCurrentOrganizationAccountingBasis();
  const [selectedBasis, setSelectedBasis] =
    React.useState<AccountingBasis | null>(null);

  const basis: AccountingBasis = selectedBasis ?? organizationBasis;

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionsLoading } = useTransactionsByReference(
    {
      referenceId: paymentMadeId as number,
      referenceType: 'BillPayment',
      basis,
    },
    { enabled: !!paymentMadeId },
  );
  const transactions = data?.transactions ?? [];

  return (
    <PaymentMadeGLEntriesRoot>
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
        noResults={
          basis === 'cash'
            ? intl.get('no_cash_basis_journal_entries')
            : undefined
        }
      />
    </PaymentMadeGLEntriesRoot>
  );
}

const TableHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const PaymentMadeGLEntriesRoot = styled(Card)``;
