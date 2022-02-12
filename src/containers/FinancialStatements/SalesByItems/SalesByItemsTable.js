import React from 'react';
import intl from 'react-intl-universal';

import { DataTable, FinancialSheet } from 'components';

import { useSalesByItemsContext } from './SalesByItemProvider';
import { useSalesByItemsTableColumns } from './components';

import { tableRowTypesToClassnames } from 'utils';
import { TableStyle } from 'common';

/**
 * Sales by items data table.
 */
export default function SalesByItemsTable({ companyName }) {
  // Sales by items context.
  const {
    salesByItems: { tableRows, query },
    isLoading,
  } = useSalesByItemsContext();

  // Sales by items table columns.
  const columns = useSalesByItemsTableColumns();

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={intl.get('sales_by_items')}
      fromDate={query.from_date}
      toDate={query.to_date}
      name="sales-by-items"
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
        noResults={intl.get(
          'there_were_no_sales_during_the_selected_date_range',
        )}
        styleName={TableStyle.Constrant}
      />
    </FinancialSheet>
  );
}
