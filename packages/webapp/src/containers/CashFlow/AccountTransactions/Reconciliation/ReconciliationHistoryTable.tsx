import { Button, Tag } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import { getStatusIntent } from './utils';
import type { BankReconciliationResponse } from '@bigcapital/sdk-ts';

interface ReconciliationHistoryTableProps {
  reconciliations: BankReconciliationResponse[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onResume: (id: number) => void;
}

export function ReconciliationHistoryTable({
  reconciliations,
  selectedId,
  onSelect,
  onResume,
}: ReconciliationHistoryTableProps) {
  if (!reconciliations.length) {
    return null;
  }

  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <th>Period</th>
            <th>Status</th>
            <th className="money">Beginning</th>
            <th className="money">Cleared</th>
            <th className="money">Ending</th>
            <th className="money">Difference</th>
            <th>Transactions</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {reconciliations.map((reconciliation) => (
            <tr
              key={reconciliation.id}
              className={
                reconciliation.id === selectedId ? 'is-selected' : undefined
              }
              onClick={() => onSelect(reconciliation.id)}
              data-testId="reconciliation-history-row"
            >
              <td>
                {reconciliation.formattedStartDate} –{' '}
                {reconciliation.formattedEndDate}
              </td>
              <td>
                <Tag minimal intent={getStatusIntent(reconciliation.status)}>
                  {reconciliation.statusLabel}
                </Tag>
              </td>
              <td className="money">
                {reconciliation.formattedBeginningBalance}
              </td>
              <td className="money">
                {reconciliation.formattedClearedBalance}
              </td>
              <td className="money">
                {reconciliation.formattedEndingBalance || '—'}
              </td>
              <td className="money">{reconciliation.formattedDifference}</td>
              <td>{reconciliation.transactionsCount}</td>
              <td className="actions">
                {reconciliation.isInProgress ? (
                  <Button
                    small
                    minimal
                    intent="primary"
                    text="Resume"
                    onClick={(event) => {
                      event.stopPropagation();
                      onResume(reconciliation.id);
                    }}
                  />
                ) : (
                  <Button
                    small
                    minimal
                    text="View"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect(reconciliation.id);
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrap>
  );
}

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
  }

  tbody tr {
    cursor: pointer;
  }

  tbody tr:hover {
    background: var(--x-table-row-hover-background, #f6f8fa);
  }

  tbody tr.is-selected {
    background: var(--x-table-row-selected-background, #f1f8ff);
  }

  td.money,
  th.money {
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  td.actions {
    text-align: right;
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;
