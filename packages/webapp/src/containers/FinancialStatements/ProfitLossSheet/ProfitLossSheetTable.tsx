import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useProfitLossSheetColumns } from './hooks';
import { useProfitLossSheetContext } from './ProfitLossProvider';
import { ReportDataTable, FinancialSheet } from '@/components';
import { TableStyle } from '@/constants';
import { tableRowTypesToClassnames, defaultExpanderReducer } from '@/utils';

interface ProfitLossSheetTableProps {
  companyName: string;
}

export function ProfitLossSheetTable({
  companyName,
}: ProfitLossSheetTableProps) {
  const { profitLossSheet } = useProfitLossSheetContext();
  const table = profitLossSheet?.table;
  const query = profitLossSheet?.query;
  const meta = profitLossSheet?.meta;

  const columns = useProfitLossSheetColumns();

  const expandedRows = React.useMemo(
    () => defaultExpanderReducer(table?.rows ?? [], 3),
    [table],
  );

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('profit_loss_sheet')}
      dateText={meta?.formattedDateRange}
      basis={query?.basis}
    >
      <ProfitLossDataTable
        columns={columns}
        data={table?.rows ?? []}
        noInitialFetch={true}
        expanded={expandedRows}
        rowClassNames={tableRowTypesToClassnames}
        expandable={true}
        expandToggleColumn={1}
        sticky={true}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const ProfitLossDataTable = styled(ReportDataTable)`
  --color-table-text-color: #252a31;
  --color-table-total-text-color: #000;

  .bp4-dark & {
    --color-table-text-color: var(--color-light-gray1);
    --color-table-total-text-color: var(--color-light-gray4);
  }
  .table {
    .tbody .tr {
      .td {
        border-bottom-width: 0;
        padding-top: 0.32rem;
        padding-bottom: 0.32rem;
        color: var(--color-table-text-color);
      }
      &.is-expanded {
        .td:not(.name) .cell-inner {
          opacity: 0;
        }
      }
      &.row_type--TOTAL {
        .td {
          font-weight: 500;
          border-top-width: 1px;
          border-top-style: solid;
          color: var(--color-table-total-text-color);
        }
      }
      &:last-of-type .td {
        border-bottom-width: 3px;
        border-bottom-style: double;
      }
    }
  }
`;
