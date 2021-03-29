import React from 'react';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import { DataTable } from 'components';
import { useSalesByItemsContext } from './SalesByItemProvider';
import { useSalesByItemsTableColumns } from './components';

/**
 * Sales by items data table.
 */
export default function SalesByItemsTable({ companyName }) {
  const { formatMessage } = useIntl();

  // Sales by items context.
  const {
    salesByItems: { tableRows, query },
    isLoading,
  } = useSalesByItemsContext();

  // Sales by items table columns.
  const columns = useSalesByItemsTableColumns();

  const rowClassNames = (row) => {
    const { original } = row;
    const rowTypes = Array.isArray(original.rowType)
      ? original.rowType
      : [original.rowType];

    return {
      ...rowTypes.reduce((acc, rowType) => {
        acc[`row_type--${rowType}`] = rowType;
        return acc;
      }, {}),
    };
  };

  return (
    <FinancialSheet
      companyName={companyName}
      sheetType={formatMessage({ id: 'sales_by_items' })}
      fromDate={query.from_date}
      toDate={query.to_date}
      name="sales-by-items"
      loading={isLoading}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={tableRows}
        expandable={true}
        expandToggleColumn={1}
        expandColumnSpace={1}
        sticky={true}
        rowClassNames={rowClassNames}
      />
    </FinancialSheet>
  );
}
