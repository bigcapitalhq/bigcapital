import { Tag } from '@blueprintjs/core';
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { getReportRowTestId } from '../reportTestIds';
import type { DataTableColumn } from '@/components/Datatable/types';
import type { ReconciliationStatusTableResponse } from '@bigcapital/sdk-ts';
import type { CellProps } from 'react-table';
import {
  FormattedMessage as T,
  ReportDataTable,
  TableVirtualizedListRows,
} from '@/components';
import { Align, TableStyle } from '@/constants';
import { tableRowTypesToClassnames } from '@/utils';

type ReportTable = ReconciliationStatusTableResponse['table'];
type ReconciliationStatusRow = ReportTable['rows'][number];

const COLUMN_WIDTHS: Record<string, number> = {
  date: 145,
  reference: 160,
  type: 170,
  deposit: 120,
  withdrawal: 120,
  status: 80,
};

function StatusCell({ value }: CellProps<ReconciliationStatusRow, string>) {
  if (value !== 'R' && value !== 'U') return null;

  const isReconciled = value === 'R';
  const label = intl.get(
    isReconciled
      ? 'report.reconciliation_status.reconciled'
      : 'report.reconciliation_status.unreconciled',
  );

  return (
    <Tag
      minimal
      intent={isReconciled ? 'success' : 'warning'}
      title={label}
      aria-label={label}
    >
      {value}
    </Tag>
  );
}

export function ReconciliationStatusTable({ table }: { table: ReportTable }) {
  const columns = useMemo<DataTableColumn<ReconciliationStatusRow>[]>(
    () =>
      table.columns.map((column, index) => {
        const isAmount =
          column.key === 'deposit' || column.key === 'withdrawal';

        return {
          id: column.key,
          Header: column.label,
          accessor: (row) => row.cells[column.cellIndex ?? index]?.value,
          width: COLUMN_WIDTHS[column.key],
          align: isAmount ? Align.Right : undefined,
          money: isAmount,
          textOverview: !isAmount && column.key !== 'status',
          ...(column.key === 'status' ? { Cell: StatusCell } : {}),
        };
      }),
    [table.columns],
  );

  return (
    <>
      {table.rows.length > 0 && (
        <p className="bp4-text-muted">
          <T id="report.reconciliation_status.balance_description" />
        </p>
      )}
      <ReconciliationDataTable
        columns={columns}
        data={table.rows}
        rowClassNames={tableRowTypesToClassnames}
        rowTestId={getReportRowTestId('reconciliation-status')}
        noResults={intl.get('report.reconciliation_status.no_accounts')}
        disableSortBy
        sticky
        virtualizedRows
        TableRowsRenderer={TableVirtualizedListRows}
        vListrowHeight={28}
        vListOverscanRowCount={2}
        styleName={TableStyle.Constrant}
      />
    </>
  );
}

const ReconciliationDataTable = styled(ReportDataTable)`
  --color-reconciliation-cell-border: #ececec;

  .bp4-dark & {
    --color-reconciliation-cell-border: var(--color-dark-gray4);
  }

  .table .tbody .tr .td {
    padding-block: 0.2rem;
  }

  .tbody {
    .tr:not(.no-results) .td + .td {
      border-inline-start: 1px solid var(--color-reconciliation-cell-border);
    }

    .row_type--ACCOUNT,
    .row_type--NO_TRANSACTIONS {
      .td-date .cell-inner {
        position: absolute;
        max-width: calc(100% - 1rem);
      }
    }

    .row_type--ACCOUNT .td,
    .row_type--OPENING_BALANCE .td,
    .row_type--CLOSING_BALANCE .td {
      font-weight: 500;
    }

    .row_type--ACCOUNT .td,
    .row_type--CLOSING_BALANCE .td {
      border-top: 1px solid var(--color-reconciliation-cell-border);
    }

    .row_type--NO_TRANSACTIONS .td {
      color: var(--color-muted-text);
    }

    .tr:last-child .td {
      border-bottom: 1px solid var(--color-reconciliation-cell-border);
    }
  }
`;
