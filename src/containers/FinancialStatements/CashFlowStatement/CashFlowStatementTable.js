import React, { useMemo } from 'react';
import intl from 'react-intl-universal';

import { DataTable } from 'components';
import FinancialSheet from 'components/FinancialSheet';
import { useCashFlowStatementColumns } from './components';
import { useCashFlowStatementContext } from './CashFlowStatementProvider';

import { defaultExpanderReducer } from 'utils';

/**
 * Cash flow statement table.
 */
export default function CashFlowStatementTable({
  // #ownProps
  companyName,
}) {
  

  const {
    cashFlowStatement: { tableRows },
    isCashFlowLoading,
    query,
  } = useCashFlowStatementContext();

  const columns = useCashFlowStatementColumns();

  const expandedRows = useMemo(
    () => defaultExpanderReducer(tableRows, 4),
    [tableRows],
  );

  const rowClassNames = (row) => {
    return [
      `row-type--${row.original.rowTypes}`,
      `row-type--${row.original.id}`,
    ];
  };

  return (
    <FinancialSheet
      name="cash-flow-statement"
      companyName={companyName}
      sheetType={intl.get('statement_of_cash_flow')}
      loading={isCashFlowLoading}
      fromDate={query.from_date}
      toDate={query.to_date}
      basis={query.basis}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
      />
    </FinancialSheet>
  );
}
