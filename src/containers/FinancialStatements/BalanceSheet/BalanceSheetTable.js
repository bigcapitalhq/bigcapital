import React from 'react';
import styled from 'styled-components';
import intl from 'react-intl-universal';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import { useBalanceSheetContext } from './BalanceSheetProvider';

import { defaultExpanderReducer, tableRowTypesToClassnames } from 'utils';
import { TableStyle } from 'common';
import { useBalanceSheetColumns } from './components';

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
    () => defaultExpanderReducer(table?.rows || [], 3),
    [table],
  );

  return (
    <FinancialSheet
      name="balance-sheet"
      companyName={companyName}
      sheetType={intl.get('balance_sheet')}
      // fromDate={query.from_date}
      // toDate={query.to_date}
      // basis={query.basis}
      // loading={isLoading}
    >
      <BalanceSheetDataTable
        columns={tableColumns}
        data={table?.rows || []}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const BalanceSheetDataTable = styled(DataTable)`
  .table {
    .tbody .tr {
      .td {
        border-bottom: 0;
        padding-top: 0.36rem;
        padding-bottom: 0.36rem;
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

      &:last-of-type .td{
        border-bottom: 1px solid #bbb;
      }
    }
  }
`;
