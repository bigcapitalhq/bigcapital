// @ts-nocheck
import React from 'react';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import {
  ReportDataTable,
  FinancialSheet,
  FormattedMessage as T,
} from '@/components';

import { useProfitLossSheetColumns } from './hooks';
import { useProfitLossSheetContext } from './ProfitLossProvider';
import { tableRowTypesToClassnames, defaultExpanderReducer } from '@/utils';

export default function ProfitLossSheetTable({
  // #ownProps
  companyName,
}) {
  // Profit/Loss sheet context.
  const {
    profitLossSheet: { table, query },
  } = useProfitLossSheetContext();

  // Retrieves the profit/loss table columns.
  const columns = useProfitLossSheetColumns();

  // Retrieve default expanded rows of balance sheet.
  const expandedRows = React.useMemo(
    () => defaultExpanderReducer(table?.rows || [], 3),
    [table],
  );

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={<T id={'profit_loss_sheet'} />}
      fromDate={query.from_date}
      toDate={query.to_date}
      basis={query.basis}
    >
      <ProfitLossDataTable
        columns={columns}
        data={table.rows}
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
