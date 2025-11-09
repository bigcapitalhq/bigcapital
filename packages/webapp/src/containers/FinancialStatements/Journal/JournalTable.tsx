// @ts-nocheck
import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import {
  ReportDataTable,
  FinancialSheet,
  TableFastCell,
  TableVirtualizedListRows,
} from '@/components';

import { useJournalSheetContext } from './JournalProvider';

import { defaultExpanderReducer, tableRowTypesToClassnames } from '@/utils';
import { useJournalSheetColumns } from './dynamicColumns';

/**
 * Journal sheet table.
 * @returns {JSX.Element}
 */
export function JournalTable({ companyName }) {
  // Journal sheet context.
  const {
    journalSheet: { table, query },
    isLoading,
  } = useJournalSheetContext();

  // Retrieves the journal table columns.
  const columns = useJournalSheetColumns();

  // Default expanded rows of general journal table.
  const expandedRows = useMemo(() => defaultExpanderReducer([], 1), []);

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('journal_sheet')}
      fromDate={query.from_date}
      toDate={query.to_date}
      loading={isLoading}
      fullWidth={true}
      name="journal"
    >
      <JournalDataTable
        columns={columns}
        data={table.rows}
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

const JournalDataTable = styled(ReportDataTable)`
  --color-table-text-color: var(--color-light-gray1);
  --color-table-total-text-color: var(--color-light-gray4);
  --color-table-border-color: var(--color-dark-gray4);
  --color-table-total-border-color: #dbdbdb;
  --color-table-total-border-color: var(--color-table-border-color);

  .table {
    .tbody {
      .tr:not(.no-results) .td {
        padding: 0.3rem 0.4rem;
        color: var(--color-table-text-color);
        border-bottom-color: transparent;
        border-left: 1px solid var(--color-table-border-color);
        min-height: 28px;

        &:first-of-type {
          border-left: 0;
        }
      }
      .tr:not(.no-results):last-child {
        .td {
          border-bottom: 1px solid var(--color-table-total-border-color);
        }
      }
      .tr.row_type--TOTAL{
        font-weight: 600;
        color: var(--color-table-total-text-color);
      }
      .tr:not(.no-results) {
        height: 28px;
      }
    }
  }
`;
