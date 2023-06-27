// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { DataTable, FinancialSheet } from '@/components';
import { defaultExpanderReducer, tableRowTypesToClassnames } from '@/utils';

import { useCashFlowStatementColumns } from './components';
import { useCashFlowStatementContext } from './CashFlowStatementProvider';

/**
 * Cash flow statement table.
 */
export default function CashFlowStatementTable({
  // #ownProps
  companyName,
}) {
  const {
    cashFlowStatement: { tableRows },
    query,
  } = useCashFlowStatementContext();

  const columns = useCashFlowStatementColumns();

  const expandedRows = useMemo(
    () => defaultExpanderReducer(tableRows, 4),
    [tableRows],
  );
  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('statement_of_cash_flow')}
      fromDate={query.from_date}
      toDate={query.to_date}
      basis={query.basis}
    >
      <CashflowStatementDataTable
        columns={columns}
        data={tableRows}
        rowClassNames={tableRowTypesToClassnames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
        styleName={TableStyle.Constraint}
      />
    </FinancialSheet>
  );
}

const CashflowStatementDataTable = styled(DataTable)`
  .table {
    .tbody {
      .tr:not(.no-results) {
        .td {
          border-bottom: 0;
          padding-top: 0.32rem;
          padding-bottom: 0.32rem;
        }

        // &.row-type--AGGREGATE,
        &.row_type--ACCOUNTS {
          border-top: 1px solid #bbb;
        }
        &.row-id--CASH_END_PERIOD {
          border-bottom: 3px double #333;
        }
        &.row_type--TOTAL {
          font-weight: 500;

          &:not(:first-child) .td {
            border-top: 1px solid #bbb;
          }
        }
      }

      .tr.is-expanded {
        .td.total,
        .td.date-period {
          .cell-inner {
            display: none;
          }
        }
      }
    }
  }
`;
