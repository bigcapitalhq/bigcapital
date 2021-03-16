import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import DataTable from 'components/DataTable';
import { useJournalSheetContext } from './JournalProvider';
import TableVirtualizedListRows from 'components/Datatable/TableVirtualizedRows';
import TableFastCell from 'components/Datatable/TableFastCell';
import { defaultExpanderReducer } from 'utils';
import { useJournalTableColumns } from './components';

export default function JournalSheetTable({
  // #ownProps
  onFetchData,
  companyName,
}) {
  const { formatMessage } = useIntl();

  // Journal sheet context.
  const {
    journalSheet: { tableRows, query },
    isLoading
  } = useJournalSheetContext();

  // Retreive the journal table columns.
  const columns = useJournalTableColumns();

  // Default expanded rows of general journal table.
  const expandedRows = useMemo(() => defaultExpanderReducer([], 1), []);

  const rowClassNames = useCallback((row) => {
    const { original } = row;
    const rowTypes = Array.isArray(original.rowType)
      ? original.rowType
      : [original.rowType];

    return {
      ...rowTypes.reduce((acc, rowType) => {
        acc[`row_type--${rowType}`] = rowType;
        return acc;
      }, {}),
    };
  }, []);


  
  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={formatMessage({ id: 'journal_sheet' })}
      fromDate={query.from_date}
      toDate={query.to_date}
      name="journal"
      loading={isLoading}
      // minimal={true}
      fullWidth={true}
      >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        noResults={formatMessage({
          id: 'this_report_does_not_contain_any_data_between_date_period',
        })}
        expanded={expandedRows}
        sticky={true}
        TableRowsRenderer={TableVirtualizedListRows}
        // #TableVirtualizedListRows props.
        vListrowHeight={28}
        vListOverscanRowCount={2}

        TableCellRenderer={TableFastCell}
        id={'journal'}
      />
    </FinancialSheet>
  );
}