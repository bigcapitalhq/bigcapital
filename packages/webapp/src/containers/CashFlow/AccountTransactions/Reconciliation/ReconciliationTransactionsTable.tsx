import { Checkbox, Tag } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import styled, { css } from 'styled-components';
import {
  filterTransactions,
  getReconciliationTransactionStatusLabel,
} from './utils';
import type { ReconciliationTransactionFilter } from './utils';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { BankReconciliationTransactionResponse } from '@bigcapital/sdk-ts';
import { DataTable } from '@/components';
import { TableStyle } from '@/constants';

interface ReconciliationTransactionsTableProps {
  transactions: BankReconciliationTransactionResponse[];
  selectedKeys: string[];
  filter: ReconciliationTransactionFilter;
  readOnly?: boolean;
  showStatus?: boolean;
  flush?: boolean;
  card?: boolean;
  isLoading?: boolean;
  onToggle?: (key: string) => void;
  onToggleAll?: (keys: string[], checked: boolean) => void;
}

const statusIntent: Record<string, 'none' | 'primary' | 'success' | 'warning'> =
  {
    categorized: 'success',
    matched: 'primary',
    manual: 'none',
  };

export function ReconciliationTransactionsTable({
  transactions,
  selectedKeys,
  filter,
  readOnly,
  showStatus = true,
  flush,
  card = true,
  isLoading,
  onToggle,
  onToggleAll,
}: ReconciliationTransactionsTableProps) {
  const rows = React.useMemo(
    () => filterTransactions(transactions, filter),
    [transactions, filter],
  );

  const selectedSet = React.useMemo(
    () => new Set(selectedKeys),
    [selectedKeys],
  );

  const selectedCount = React.useMemo(
    () => rows.filter((row) => selectedSet.has(row.key)).length,
    [rows, selectedSet],
  );

  const allChecked = rows.length > 0 && selectedCount === rows.length;
  const someChecked = selectedCount > 0 && !allChecked;

  const columns = React.useMemo<
    DataTableColumn<BankReconciliationTransactionResponse>[]
  >(() => {
    const cols: DataTableColumn<BankReconciliationTransactionResponse>[] = [
      {
        id: 'date',
        Header: intl.get('date'),
        accessor: 'formattedDate',
        width: 110,
        textOverview: true,
      },
      {
        id: 'type',
        Header: intl.get('type'),
        width: 150,
        textOverview: true,
        Cell: ({ row }) => (
          <TypeCell>
            {row.original.transactionTypeLabel ||
              intl.get('banking.reconciliation.unknown_type')}
            {row.original.isPreviousOutstanding && (
              <Tag minimal intent="warning">
                {intl.get('banking.reconciliation.previous_period')}
              </Tag>
            )}
          </TypeCell>
        ),
      },
      {
        id: 'reference',
        Header: intl.get('banking.reconciliation.reference'),
        accessor: (transaction) =>
          transaction.referenceNumber || transaction.transactionNumber || '—',
        width: 160,
        textOverview: true,
      },
      {
        id: 'description',
        Header: intl.get('description'),
        accessor: (transaction) => transaction.note || '—',
        width: 220,
        textOverview: true,
      },
      {
        id: 'payment',
        Header: intl.get('banking.reconciliation.payment'),
        accessor: (transaction) =>
          transaction.credit ? transaction.formattedCredit : '—',
        width: 120,
        textOverview: true,
        align: 'right',
        money: true,
      },
      {
        id: 'deposit',
        Header: intl.get('banking.label.deposit'),
        accessor: (transaction) =>
          transaction.debit ? transaction.formattedDebit : '—',
        width: 120,
        textOverview: true,
        align: 'right',
        money: true,
      },
    ];

    if (showStatus) {
      cols.push({
        id: 'status',
        Header: intl.get('status'),
        width: 110,
        Cell: ({ row }) => (
          <Tag minimal intent={statusIntent[row.original.status] ?? 'none'}>
            {getReconciliationTransactionStatusLabel(row.original.status)}
          </Tag>
        ),
      });
    }

    if (!readOnly) {
      cols.push({
        id: 'selection',
        Header: () => (
          <div
            className="selection-checkbox"
            onClick={(event) => event.stopPropagation()}
          >
            <Checkbox
              aria-label={intl.get('banking.reconciliation.select_all')}
              checked={allChecked}
              indeterminate={someChecked}
              onChange={(event) =>
                onToggleAll?.(
                  rows.map((row) => row.key),
                  event.currentTarget.checked,
                )
              }
            />
          </div>
        ),
        Cell: ({ row }) => (
          <div className="selection-checkbox">
            <Checkbox
              aria-label={intl.get('banking.reconciliation.select_transaction')}
              checked={selectedSet.has(row.original.key)}
              onChange={() => onToggle?.(row.original.key)}
            />
          </div>
        ),
        width: 42,
        minWidth: 42,
        maxWidth: 42,
        className: 'selection',
      });
    }

    return cols;
  }, [
    allChecked,
    onToggle,
    onToggleAll,
    readOnly,
    rows,
    selectedSet,
    showStatus,
    someChecked,
  ]);

  return (
    <TableWrap
      $flush={flush}
      $card={card}
      data-testId="reconciliation-transactions-table"
    >
      <DataTable
        columns={columns}
        data={rows}
        styleName={TableStyle.Constrant}
        selectionColumn={false}
        loading={isLoading}
        rowTestId="reconciliation-transaction-row"
        noResults={intl.get('banking.reconciliation.empty_transactions')}
      />
    </TableWrap>
  );
}

const TableWrap = styled.div<{ $flush?: boolean; $card?: boolean }>`
  margin: ${({ $flush, $card }) => ($flush || !$card ? '0' : '12px 15px 0')};
  overflow-x: auto;

  ${({ $card }) =>
    $card &&
    css`
      background: var(--color-bank-transactions-content-background);
      border: 2px solid var(--color-bank-transactions-content-border);
      border-radius: 10px;
      padding: 30px 18px;
    `}

  .bigcapital-datatable .table {
    .thead .th,
    .tbody .tr .td {
      padding-top: 0.45rem;
      padding-bottom: 0.45rem;
    }
  }
`;

const TypeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
`;
