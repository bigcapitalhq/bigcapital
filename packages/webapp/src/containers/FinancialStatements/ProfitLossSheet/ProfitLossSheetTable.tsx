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
  const tableColumns = useProfitLossSheetColumns();

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
        columns={tableColumns}
        data={table.rows}
        noInitialFetch={true}
        expanded={expandedRows}
        rowClassNames={tableRowTypesToClassnames}
        expandable={true}
        expandToggleColumn={1}
        sticky={true}
        styleName={TableStyle.Constraint}
      />
    </FinancialSheet>
  );
}

const ProfitLossDataTable = styled(ReportDataTable)`
  .table {
    .tbody .tr {
      .td {
        border-bottom: 0;
        padding-top: 0.32rem;
        padding-bottom: 0.32rem;
      }
      &.is-expanded {
        .td:not(.name) .cell-inner {
          opacity: 0;
        }
      }
      &.row_type--TOTAL {
        .td {
          font-weight: 500;
          border-top: 1px solid #bbb;
        }
      }
      &:last-of-type .td {
        border-bottom: 3px double #000;
      }
    }
  }
`;
