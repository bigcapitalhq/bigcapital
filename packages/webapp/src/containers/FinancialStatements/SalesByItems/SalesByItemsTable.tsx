import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { useSalesByItemsTableColumns } from './dynamicColumns';
import { useSalesByItemsContext } from './SalesByItemProvider';
import { ReportDataTable, FinancialSheet } from '@/components';
import { TableStyle } from '@/constants';
import { tableRowTypesToClassnames } from '@/utils';

interface SalesByItemsTableProps {
  companyName: string;
}

/**
 * Sales by items data table.
 */
export function SalesByItemsTable({ companyName }: SalesByItemsTableProps) {
  // Sales by items context.
  const { salesByItems, isLoading } = useSalesByItemsContext();

  const table = salesByItems?.table;
  const meta = salesByItems?.meta;

  // Sales by items table columns.
  const columns = useSalesByItemsTableColumns();

  return (
    <SalesByItemsSheet
      companyName={companyName}
      sheetType={intl.get('sales_by_items')}
      dateText={meta?.formattedDateRange}
    >
      <SalesByItemsDataTable
        columns={columns}
        data={table?.rows ?? []}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={tableRowTypesToClassnames}
        noResults={intl.get(
          'there_were_no_sales_during_the_selected_date_range',
        )}
        styleName={TableStyle.Constrant}
      />
    </SalesByItemsSheet>
  );
}

const SalesByItemsSheet = styled(FinancialSheet)`
  min-width: 850px;
`;

const SalesByItemsDataTable = styled(ReportDataTable)`
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
