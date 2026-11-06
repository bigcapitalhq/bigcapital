import { Checkbox, Spinner, Tag } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { filterTransactions } from './utils';
import type { ReconciliationTransactionFilter } from './utils';
import type { BankReconciliationTransactionResponse } from '@bigcapital/sdk-ts';

interface ReconciliationTransactionsTableProps {
  transactions: BankReconciliationTransactionResponse[];
  selectedKeys: string[];
  filter: ReconciliationTransactionFilter;
  readOnly?: boolean;
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
  isLoading,
  onToggle,
  onToggleAll,
}: ReconciliationTransactionsTableProps) {
  const rows = filterTransactions(transactions, filter);
  const selectedSet = new Set(selectedKeys);
  const selectedCount = rows.filter((row) => selectedSet.has(row.key)).length;
  const allChecked = rows.length > 0 && selectedCount === rows.length;
  const someChecked = selectedCount > 0 && !allChecked;

  if (isLoading) {
    return (
      <LoadingWrap>
        <Spinner size={24} />
      </LoadingWrap>
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyWrap>No transactions found for this reconciliation.</EmptyWrap>
    );
  }

  return (
    <TableWrap data-testId="reconciliation-transactions-table">
      <Table>
        <thead>
          <tr>
            {!readOnly && (
              <th className="selection">
                <Checkbox
                  checked={allChecked}
                  indeterminate={someChecked}
                  onChange={(event) =>
                    onToggleAll?.(
                      rows.map((row) => row.key),
                      event.currentTarget.checked,
                    )
                  }
                />
              </th>
            )}
            <th>Date</th>
            <th>Type</th>
            <th>Reference</th>
            <th>Description</th>
            <th className="money">Payment</th>
            <th className="money">Deposit</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((transaction) => {
            const checked = selectedSet.has(transaction.key);

            return (
              <tr
                key={transaction.key}
                className={checked ? 'is-checked' : undefined}
                data-testId="reconciliation-transaction-row"
              >
                {!readOnly && (
                  <td className="selection">
                    <Checkbox
                      checked={checked}
                      onChange={() => onToggle?.(transaction.key)}
                    />
                  </td>
                )}
                <td>{transaction.formattedDate}</td>
                <td>
                  <TypeCell>
                    {transaction.transactionType || '—'}
                    {transaction.isPreviousOutstanding && (
                      <Tag minimal intent="warning">
                        Previous period
                      </Tag>
                    )}
                  </TypeCell>
                </td>
                <td>
                  {transaction.referenceNumber ||
                    transaction.transactionNumber ||
                    '—'}
                </td>
                <td className="description">{transaction.note || '—'}</td>
                <td className="money">
                  {transaction.credit ? transaction.formattedCredit : '—'}
                </td>
                <td className="money">
                  {transaction.debit ? transaction.formattedDebit : '—'}
                </td>
                <td>
                  <Tag
                    minimal
                    intent={statusIntent[transaction.status] ?? 'none'}
                  >
                    {transaction.status}
                  </Tag>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrap>
  );
}

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

const EmptyWrap = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: var(--x-text-color-muted, #738091);
`;

const TableWrap = styled.div`
  margin: 12px 15px 0;
  overflow-x: auto;
  border: 1px solid var(--x-border-color, #e1e8ed);
  border-radius: 4px;
  background: var(--color-white, #fff);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 8px 10px;
    font-size: 13px;
    border-bottom: 1px solid var(--x-border-color-light, #eef1f4);
    text-align: left;
    vertical-align: middle;
  }

  th {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--x-text-color-muted, #738091);
    font-weight: 600;
    background: var(--x-table-header-background, #f6f7f9);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tbody tr:hover {
    background: var(--x-table-row-hover-background, #f6f8fa);
  }

  tbody tr.is-checked {
    background: var(--x-table-row-selected-background, #f1f8ff);
  }

  td.selection,
  th.selection {
    width: 42px;
    text-align: center;
  }

  td.money,
  th.money {
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  td.description {
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const TypeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
`;
