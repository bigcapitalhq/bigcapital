// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';

import { TableStyle } from '@/constants';
import { ReportDataTable, FinancialSheet } from '@/components';
import { tableRowTypesToClassnames } from '@/utils';

import { useInventoryValuationContext } from './InventoryValuationProvider';
import { useInventoryValuationTableColumns } from './components';

/**
 * inventory valuation data table.
 */
export default function InventoryValuationTable({
  //#ownProps
  companyName,
}) {
  // inventory valuation context.
  const {
    inventoryValuation: { tableRows },
    isLoading,
  } = useInventoryValuationContext();

  // inventory valuation table columns.
  const columns = useInventoryValuationTableColumns();

  return (
    <InventoryValuationSheet
      companyName={companyName}
      sheetType={intl.get('inventory_valuation')}
      asDate={new Date()}
      loading={isLoading}
    >
      <InventoryValuationDataTable
        columns={columns}
        data={tableRows}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={tableRowTypesToClassnames}
        styleName={TableStyle.Constraint}
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
      .tr.row_type--total .td {
        border-top: 1px solid #bbb;
        font-weight: 500;
        border-bottom: 3px double #000;
      }
    }
  }
`;
