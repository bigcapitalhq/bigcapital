// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { ReportDataTable, FinancialSheet } from '@/components';
import { tableRowTypesToClassnames } from '@/utils';

import { useInventoryValuationContext } from './InventoryValuationProvider';
import { useInventoryValuationColumns } from './dynamicColumns';

/**
 * Inventory valuation data table.
 */
export default function InventoryValuationTable({
  // #ownProps
  companyName,
}) {
  // Inventory valuation context.
  const {
    inventoryValuation: { table, query },
    isLoading,
  } = useInventoryValuationContext();

  // Inventory valuation table columns.
  const columns = useInventoryValuationColumns();

  return (
    <InventoryValuationSheet
      companyName={companyName}
      sheetType={intl.get('inventory_valuation')}
      asDate={query.as_date}
      loading={isLoading}
    >
      <InventoryValuationDataTable
        columns={columns}
        data={table.rows}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={tableRowTypesToClassnames}
        styleName={TableStyle.Constrant}
        noResults={intl.get(
          'there_were_no_inventory_transactions_during_the_selected_date_range',
        )}
      />
    </InventoryValuationSheet>
  );
}

const InventoryValuationSheet = styled(FinancialSheet)`
  min-width: 850px;
`;

const InventoryValuationDataTable = styled(ReportDataTable)`
  .table {
    .tbody {
      .tr .td {
        border-bottom: 0;
        padding-top: 0.4rem;
        padding-bottom: 0.4rem;
      }
      .tr.row_type--TOTAL .td {
        border-top: 1px solid #bbb;
        font-weight: 500;
        border-bottom: 3px double #000;
      }
    }
  }
`;
