import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { DataTable, FinancialSheet } from 'components';
import TableVirtualizedListRows from 'components/Datatable/TableVirtualizedRows';
import TableFastCell from 'components/Datatable/TableFastCell';

import { useJournalTableColumns } from './components';
import { useJournalSheetContext } from './JournalProvider';

import { defaultExpanderReducer, tableRowTypesToClassnames } from 'utils';
import { TableStyle } from 'common';

/**
 * Journal sheet table.
 * @returns {JSX.Element}
 */
export function JournalTable({ companyName }) {
  // Journal sheet context.
  const {
    journalSheet: { tableRows, query },
    isLoading,
  } = useJournalSheetContext();

  // Retreive the journal table columns.
  const columns = useJournalTableColumns();

  // Default expanded rows of general journal table.
  const expandedRows = useMemo(() => defaultExpanderReducer([], 1), []);

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('journal_sheet')}
      fromDate={query.from_date}
      toDate={query.to_date}
      name="journal"
      loading={isLoading}
      fullWidth={true}
    >
      <JournalDataTable
        columns={columns}
        data={tableRows}
        rowClassNames={tableRowTypesToClassnames}
        noResults={intl.get(
          'this_report_does_not_contain_any_data_between_date_period',
        )}
        expanded={expandedRows}
        sticky={true}
        TableRowsRenderer={TableVirtualizedListRows}
        // #TableVirtualizedListRows props.
        vListrowHeight={28}
        vListOverscanRowCount={2}
        TableCellRenderer={TableFastCell}
        id={'journal'}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const JournalDataTable = styled(DataTable)`
  .table {
    .tbody {
      .tr:not(.no-results) .td {
        padding: 0.3rem 0.4rem;
        color: #000;
        border-bottom-color: transparent;
        min-height: 28px;
        border-left: 1px solid #ececec;

        &:first-of-type {
          border-left: 0;
        }
      }
      .tr:not(.no-results):last-child {
        .td {
          border-bottom: 1px solid #dbdbdb;
        }
      }
      .tr.row_type--TOTAL_ENTRIES {
        font-weight: 600;
      }

      .tr:not(.no-results) {
        height: 28px;
      }
    }
  }
`;
