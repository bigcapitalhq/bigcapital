import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useGLEntriesTableColumns } from './utils';
import type { GLTransactionRow } from './utils';
import type { DataTableColumn } from '@/components/Datatable/types';
import { DataTable, CurrencyTag, TableSkeletonRows } from '@/components';
import { TableStyle } from '@/constants';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

interface JournalEntriesTableProps {
  transactions: GLTransactionRow[];
  columns?: DataTableColumn<GLTransactionRow>[];
  loading?: boolean;
  className?: string;
}

/**
 * Journal entries table.
 */
export function JournalEntriesTable({
  transactions,
  columns: columnsProp,
  ...restProps
}: JournalEntriesTableProps) {
  const defaultColumns = useGLEntriesTableColumns();

  return (
    <DataTable
      columns={columnsProp ?? defaultColumns}
      data={transactions}
      styleName={TableStyle.Constrant}
      TableLoadingRenderer={TableSkeletonRows}
      {...restProps}
    />
  );
}

/**
 *
 * @returns {React.JSX}
 */
export function AmountDisplayedBaseCurrencyMessageJSX() {
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  return (
    <Message>
      {intl.get('journal_entries.amount_displayed_base_currency')}
      <CurrencyTag>{baseCurrency}</CurrencyTag>
    </Message>
  );
}

export const AmountDisplayedBaseCurrencyMessage =
  AmountDisplayedBaseCurrencyMessageJSX;

const Message = styled.div`
  font-size: 10px;
  margin-bottom: 12px;
`;
