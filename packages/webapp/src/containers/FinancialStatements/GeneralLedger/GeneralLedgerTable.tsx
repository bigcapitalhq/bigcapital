// @ts-nocheck
import { useMemo } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { defaultExpanderReducer, tableRowTypesToClassnames } from '@/utils';
import {
  FinancialSheet,
  ReportDataTable,
  TableFastCell,
  TableVirtualizedListRows,
} from '@/components';

import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import { useGeneralLedgerTableColumns } from './dynamicColumns';

/**
 * General ledger table.
 */
export default function GeneralLedgerTable({ companyName }) {
  // General ledger context.
  const {
    generalLedger: { query, table },
    isLoading,
  } = useGeneralLedgerContext();

  // General ledger table columns.
  const columns = useGeneralLedgerTableColumns();

  // Default expanded rows of general ledger table.
  const expandedRows = useMemo(
    () => defaultExpanderReducer(table.rows, 1),
    [table.rows],
  );

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('general_ledger_sheet')}
      fromDate={query.from_date}
      toDate={query.to_date}
      loading={isLoading}
      fullWidth={true}
    >
      <GeneralLedgerDataTable
        noResults={intl.get(
          'this_report_does_not_contain_any_data_between_date_period',
        )}
        columns={columns}
        data={table.rows}
        rowClassNames={tableRowTypesToClassnames}
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
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}

const GeneralLedgerDataTable = styled(ReportDataTable)`
  .tbody {
    .tr .td {
      padding-top: 0.2rem;
      padding-bottom: 0.2rem;
    }
    .tr.is-expanded {
      .td:not(.date) .cell-inner {
        opacity: 0;
      }
    }
    .tr:not(.no-results) .td:not(:first-of-type) {
      border-left: 1px solid #ececec;
    }
    .tr:last-child .td {
      border-bottom: 1px solid #ececec;
    }
    .tr.row_type {
      &--ACCOUNT {
        .td {
          &.date {
            font-weight: 500;

            .cell-inner {
              position: absolute;
            }
          }
        }
      }
      &--OPENING_BALANCE,
      &--CLOSING_BALANCE {
        .td {
          color: #000;
        }
        .date {
          font-weight: 500;

          .cell-inner {
            position: absolute;
          }
        }
        .amount {
          font-weight: 500;
        }
      }
      &--CLOSING_BALANCE {
        .name {
          font-weight: 500;
        }
        .td {
          border-top: 1px solid #ddd;
        }
      }
    }
  }
`;
