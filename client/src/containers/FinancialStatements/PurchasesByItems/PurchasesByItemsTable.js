import React from 'react';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import { DataTable } from 'components';

import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';

import { usePurchasesByItemsTableColumns } from './components';

/**
 * purchases by items data table.
 */
export default function PurchasesByItemsTable({ companyName }) {
  const { formatMessage } = useIntl();

  // Purchases by items context.
  const {
    purchaseByItems: { tableRows, query },
    isLoading,
  } = usePurchaseByItemsContext();

  // Purchases by items table columns.
  const columns = usePurchasesByItemsTableColumns();

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
      sheetType={formatMessage({ id: 'purchases_by_items' })}
      fromDate={query.from_date}
      toDate={query.to_date}
      name="purchases-by-items"
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
        noResults={'There were no purchases during the selected date range.'}
      />
    </FinancialSheet>
  );
}
