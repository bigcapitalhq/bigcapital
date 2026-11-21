import intl from 'react-intl-universal';
import { Button, Tag } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';
import {
  getStatusIntent,
  formatReconciliationPeriod,
  getReconciliationStatusLabel,
} from './utils';
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
            <th>{intl.get('banking.reconciliation.period')}</th>
            <th>{intl.get('status')}</th>
            <th className="money">
              {intl.get('banking.reconciliation.beginning')}
            </th>
            <th className="money">
              {intl.get('banking.reconciliation.cleared')}
            </th>
            <th className="money">
              {intl.get('banking.reconciliation.ending')}
            </th>
            <th className="money">
              {intl.get('banking.reconciliation.difference')}
            </th>
            <th>{intl.get('transactions')}</th>
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
                {formatReconciliationPeriod(
                  reconciliation.startDate,
                  reconciliation.endDate,
                )}
              </td>
              <td>
                <Tag minimal intent={getStatusIntent(reconciliation.status)}>
                  {getReconciliationStatusLabel(reconciliation.status)}
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
              <td>
                {intl.get('banking.reconciliation.number', {
                  count: reconciliation.transactionsCount,
                })}
              </td>
              <td className="actions">
                {reconciliation.isInProgress ? (
                  <Button
                    small
                    minimal
                    intent="primary"
                    text={intl.get('banking.reconciliation.resume_short')}
                    onClick={(event) => {
                      event.stopPropagation();
                      onResume(reconciliation.id);
                    }}
                  />
                ) : (
                  <Button
                    small
                    minimal
                    text={intl.get('banking.reconciliation.view')}
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
  border: 1px solid var(--x-recon-border);
  border-radius: 4px;
  background: var(--x-recon-surface);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: var(--x-recon-text);

  th,
  td {
    padding: 8px 10px;
    font-size: 13px;
    border-bottom: 1px solid var(--x-recon-border-light);
    text-align: left;
    vertical-align: middle;
  }

  th {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--x-recon-text-muted);
    font-weight: 600;
    background: var(--x-recon-table-header-background);
  }

  tbody tr {
    cursor: pointer;
  }

  tbody tr:hover {
    background: var(--x-recon-table-row-hover);
  }

  tbody tr.is-selected {
    background: var(--x-recon-table-row-selected);
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
