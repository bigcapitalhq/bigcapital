import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { getReportRowTestId } from '../reportTestIds';
import { useInventorySummaryTableColumns } from './dynamicColumns';
import { useInventorySummaryContext } from './InventorySummaryProvider';
import { ReportDataTable, FinancialSheet } from '@/components';
import { TableStyle } from '@/constants';
import { tableRowTypesToClassnames } from '@/utils';

interface InventorySummaryTableProps {
  companyName: string;
}

/**
 * Inventory summary data table.
 */
export function InventorySummaryTable({
  companyName,
}: InventorySummaryTableProps) {
  // Inventory summary context.
  const { inventorySummary } = useInventorySummaryContext();

  const table = inventorySummary?.table;
  const meta = inventorySummary?.meta;

  // Inventory summary table columns.
  const columns = useInventorySummaryTableColumns();

  return (
    <InventorySummarySheet
      companyName={companyName}
      sheetType={intl.get('inventory_summary')}
      dateText={meta?.formattedDateRange}
    >
      <InventorySummaryDataTable
        columns={columns}
        data={table?.rows ?? []}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={tableRowTypesToClassnames}
        rowTestId={getReportRowTestId('inventory-summary')}
        noResults={intl.get(
          'there_were_no_inventory_transactions_during_the_selected_date_range',
        )}
        styleName={TableStyle.Constrant}
      />
    </InventorySummarySheet>
  );
}

const InventorySummarySheet = styled(FinancialSheet)`
  min-width: 850px;
`;

const InventorySummaryDataTable = styled(ReportDataTable)`
  --x-table-total-border-bottom-color: #000;
  --x-table-total-border-top-color: #bbb;
  --x-table-total-border-bottom-color: var(
    --color-datatable-constrant-cell-border
  );
  --x-table-total-border-top-color: var(
    --color-datatable-constrant-cell-border
  );

  .table {
    .tbody {
      .tr .td {
        border-bottom-width: 0;
        padding-top: 0.4rem;
        padding-bottom: 0.4rem;
      }
      .tr.row_type--TOTAL .td {
        border-top-width: 1px;
        font-weight: 500;
        border-top-width: 1px;
        border-top-style: solid;
        border-top-color: var(--x-table-total-border-top-color);
        border-bottom-style: double;
        border-bottom-width: 3px;
        border-bottom-color: var(--x-table-total-border-bottom-color);
      }
    }
  }
`;
