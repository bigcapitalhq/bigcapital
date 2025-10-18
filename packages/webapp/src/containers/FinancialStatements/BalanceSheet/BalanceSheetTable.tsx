// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';

import { TableStyle } from '@/constants';
import { ReportDataTable, FinancialSheet } from '@/components';
import { useBalanceSheetContext } from './BalanceSheetProvider';
import { useBalanceSheetColumns } from './components';
import { defaultExpanderReducer, tableRowTypesToClassnames } from '@/utils';

/**
 * Balance sheet table.
 */
export default function BalanceSheetTable({
  // #ownProps
  companyName,
}) {
  // Balance sheet context.
  const {
    balanceSheet: { table, query },
  } = useBalanceSheetContext();

  // Retrieve the database columns.
  const tableColumns = useBalanceSheetColumns();

  // Retrieve default expanded rows of balance sheet.
  const expandedRows = React.useMemo(
    () => defaultExpanderReducer(table.rows, 3),
    [table],
  );

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('balance_sheet')}
      asDate={query.to_date}
      basis={query.basis}
    >
      <BalanceSheetDataTable
        columns={tableColumns}
        data={table.rows}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
        headerLoading={true}
        sticky={true}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const BalanceSheetDataTable = styled(ReportDataTable)`
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
          color: var(--color-table-total-text-color);
          font-weight: 500;
          border-top-width: 1px;
          border-top-style: solid;
        }
      }
      &:last-of-type .td {
        border-bottom-width: 1px;
        border-bottom-style: solid;
      }
      &.row_type--TOTAL.row-id--ASSETS,
      &.row_type--TOTAL.row-id--LIABILITY_EQUITY {
        .td {
          color: var(--color-table-total-text-color);
          border-bottom-width: 3px;
          border-bottom-style: double;
        }
      }
    }
  }
`;
