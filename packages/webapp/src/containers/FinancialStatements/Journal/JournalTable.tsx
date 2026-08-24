import React, { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { getReportRowTestId } from '../reportTestIds';
import { useJournalSheetColumns } from './dynamicColumns';
import { useJournalSheetContext } from './JournalProvider';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import {
  ReportDataTable,
  FinancialSheet,
  TableFastCell,
  TableVirtualizedListRows,
} from '@/components';
import { TableStyle } from '@/constants';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { handleViewTransactionDetail } from '@/containers/FinancialStatements/utils/transactionDrawer';
import {
  compose,
  defaultExpanderReducer,
  tableRowTypesToClassnames,
} from '@/utils';

interface JournalTableProps extends WithDrawerActionsProps {
  companyName: string;
}

/**
 * Journal sheet table.
 * @returns {JSX.Element}
 */
function JournalTableInner({
  companyName,

  // #withDrawerActions
  openDrawer,
}: JournalTableProps) {
  // Journal sheet context.
  const { journalSheet } = useJournalSheetContext();

  const table = (journalSheet as any)?.table;
  const meta = (journalSheet as any)?.meta;

  // Opens the detail drawer of the given transaction reference.
  const handleViewDetail = (referenceType: string, referenceId: number) => {
    handleViewTransactionDetail({ referenceType, referenceId }, openDrawer);
  };

  // Retrieves the journal table columns.
  const columns = useJournalSheetColumns(handleViewDetail);

  // Default expanded rows of general journal table.
  const expandedRows = useMemo(() => defaultExpanderReducer([], 1), []);

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('journal_sheet')}
      dateText={meta?.formattedDateRange ?? meta?.formattedAsDate}
      fullWidth={true}
    >
      <JournalDataTable
        columns={columns}
        data={table?.rows}
        rowClassNames={tableRowTypesToClassnames}
        rowTestId={getReportRowTestId('journal')}
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

export const JournalTable = compose(withDrawerActions)(JournalTableInner);

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
      .tr.row_type--TOTAL {
        font-weight: 600;
        color: var(--color-table-total-text-color);
      }
      .tr:not(.no-results) {
        height: 28px;
      }
    }
  }
`;
