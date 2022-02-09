import React, { useMemo } from 'react';

import { defaultExpanderReducer } from 'utils';
import intl from 'react-intl-universal';

import { FinancialSheet } from 'components';
import DataTable from 'components/DataTable';
import TableVirtualizedListRows from 'components/Datatable/TableVirtualizedRows';
import TableFastCell from 'components/Datatable/TableFastCell';

import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import { useGeneralLedgerTableColumns } from './components';

/**
 * General ledger table.
 */
export default function GeneralLedgerTable({ companyName }) {
  // General ledger context.
  const {
    generalLedger: { tableRows, query },
    isLoading,
  } = useGeneralLedgerContext();

  // General ledger table columns.
  const columns = useGeneralLedgerTableColumns();

  // Default expanded rows of general ledger table.
  const expandedRows = useMemo(() => defaultExpanderReducer(tableRows, 1), [
    tableRows,
  ]);

  const rowClassNames = (row) => [`row-type--${row.original.rowType}`];

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('general_ledger_sheet')}
      fromDate={query.from_date}
      toDate={query.to_date}
      loading={isLoading}
      fullWidth={true}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        noResults={intl.get('this_report_does_not_contain_any_data_between_date_period')}
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        expanded={expandedRows}
        virtualizedRows={true}
        fixedItemSize={30}
        fixedSizeHeight={1000}
        expandable={true}
        expandToggleColumn={1}
        sticky={true}
        TableRowsRenderer={TableVirtualizedListRows}
        // #TableVirtualizedListRows props.
        vListrowHeight={28}
        vListOverscanRowCount={0}
        TableCellRenderer={TableFastCell}
      />
    </FinancialSheet>
  );
}
