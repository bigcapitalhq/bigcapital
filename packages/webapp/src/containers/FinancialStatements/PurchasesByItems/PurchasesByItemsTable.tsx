// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { ReportDataTable, FinancialSheet } from '@/components';

import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';

import { tableRowTypesToClassnames } from '@/utils';
import { TableStyle } from '@/constants';
import { usePurchasesByItemsTableColumns } from './dynamicColumns';

/**
 * Purchases by items data table.
 */
export default function PurchasesByItemsTable({ companyName }) {
  // Purchases by items context.
  const {
    purchaseByItems: { table, query },
  } = usePurchaseByItemsContext();

  // Purchases by items table columns.
  const columns = usePurchasesByItemsTableColumns();

  return (
    <PurchasesByItemsSheet
      companyName={companyName}
      sheetType={intl.get('purchases_by_items')}
      fromDate={query.from_date}
      toDate={query.to_date}
    >
      <PurchasesByItemsDataTable
        columns={columns}
        data={table.rows}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={tableRowTypesToClassnames}
        noResults={intl.get(
          'there_were_no_purchases_during_the_selected_date_range',
        )}
        styleName={TableStyle.Constrant}
      />
    </PurchasesByItemsSheet>
  );
}

const PurchasesByItemsSheet = styled(FinancialSheet)`
  min-width: 850px;
`;

const PurchasesByItemsDataTable = styled(ReportDataTable)`
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
        padding-top: 0.36rem;
        padding-bottom: 0.36rem;
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
