import React from 'react';
import intl from 'react-intl-universal';

import { DataTable, FinancialSheet } from 'components';

import { useInventoryValuationContext } from './InventoryValuationProvider';
import { useInventoryValuationTableColumns } from './components';

import { tableRowTypesToClassnames } from 'utils';
import { TableStyle } from 'common';

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
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('inventory_valuation')}
      asDate={new Date()}
      loading={isLoading}
    >
      <DataTable
        columns={columns}
        data={tableRows}
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
    </FinancialSheet>
  );
}
