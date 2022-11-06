// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { Card } from '@/components';
import { useTransactionsByReference } from '@/hooks/query';
import { useInvoiceDetailDrawerContext } from './InvoiceDetailDrawerProvider';

import JournalEntriesTable, {
  AmountDisplayedBaseCurrencyMessage,
} from '../../JournalEntriesTable/JournalEntriesTable';

/**
 * Invoice GL entries table.
 * @returns {React.JSX}
 */
export default function InvoiceGLEntriesTable() {
  const { invoiceId } = useInvoiceDetailDrawerContext();

  // Handle fetch transaction by reference.
  const {
    data: { transactions },
    isLoading: isTransactionLoading,
  } = useTransactionsByReference(
    {
      reference_id: invoiceId,
      reference_type: 'SaleInvoice',
    },
    { enabled: !!invoiceId },
  );

  return (
    <InvoiceGLEntriesRoot>
      <AmountDisplayedBaseCurrencyMessage />
      <InvoiceGLEntriesDatatable
        loading={isTransactionLoading}
        transactions={transactions}
      />
    </InvoiceGLEntriesRoot>
  );
}

const InvoiceGLEntriesDatatable = styled(JournalEntriesTable)``;

const InvoiceGLEntriesRoot = styled(Card)``;
