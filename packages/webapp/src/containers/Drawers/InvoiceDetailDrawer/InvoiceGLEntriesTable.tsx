import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import {
  AmountDisplayedBaseCurrencyMessage,
  JournalEntriesTable,
} from '../../JournalEntriesTable/JournalEntriesTable';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';
import { Card, SegmentedControl } from '@/components';
import {
  useCurrentOrganizationAccountingBasis,
  useTransactionsByReference,
  type AccountingBasis,
} from '@/hooks/query';

/**
 * Invoice GL entries table.
 * @returns {React.JSX}
 */
export function InvoiceGLEntriesTable() {
  const { invoiceId } = useInvoiceDetailDrawerContext();

  // Retrieves the organization accounting basis to use it as the default.
  const organizationBasis = useCurrentOrganizationAccountingBasis();
  const [selectedBasis, setSelectedBasis] =
    React.useState<AccountingBasis | null>(null);

  const basis: AccountingBasis = selectedBasis ?? organizationBasis;

  // Handle fetch transaction by reference.
  const { data, isLoading: isTransactionLoading } = useTransactionsByReference(
    {
      referenceId: invoiceId as number,
      referenceType: 'SaleInvoice',
      basis,
    },
    { enabled: !!invoiceId },
  );
  const transactions = data?.transactions ?? [];

  return (
    <InvoiceGLEntriesRoot>
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
      <InvoiceGLEntriesDatatable
        loading={isTransactionLoading}
        transactions={transactions}
        noResults={
          basis === 'cash'
            ? intl.get('no_cash_basis_journal_entries')
            : undefined
        }
      />
    </InvoiceGLEntriesRoot>
  );
}

const InvoiceGLEntriesDatatable = styled(JournalEntriesTable)``;

const TableHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const InvoiceGLEntriesRoot = styled(Card)``;
