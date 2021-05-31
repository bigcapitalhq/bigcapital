import React, { useMemo, useCallback } from 'react';
import { formatMessage } from 'services/intl';

import classNames from 'classnames';

import FinancialSheet from 'components/FinancialSheet';
import { DataTable } from 'components';
import { useInventoryItemDetailsColumns } from './components';
import { useInventoryItemDetailsContext } from './InventoryItemDetailsProvider';

import { defaultExpanderReducer } from 'utils';

/**
 * Inventory item detail table.
 */
export default function InventoryItemDetailsTable({
  // #ownProps
  companyName,
}) {
  const {
    inventoryItemDetails: { tableRows },
    isInventoryItemDetailsLoading,
    query,
  } = useInventoryItemDetailsContext();

  const columns = useInventoryItemDetailsColumns();

  const expandedRows = useMemo(
    () => defaultExpanderReducer(tableRows, 4),
    [tableRows],
  );

  const rowClassNames = (row) => {
    return [`row-type--${row.original.rowTypes}`];
  };

  return (
    <FinancialSheet
      name="inventory-item-details"
      companyName={companyName}
      sheetType={formatMessage({ id: 'inventory_item_details' })}
      loading={isInventoryItemDetailsLoading}
      fromDate={query.from_date}
      toDate={query.to_date}
    >
      <DataTable
        className="bigcapital-datatable--financial-report"
        columns={columns}
        data={tableRows}
        rowClassNames={rowClassNames}
        noInitialFetch={true}
        expandable={true}
        expanded={expandedRows}
        expandToggleColumn={1}
        expandColumnSpace={0.8}
      />
    </FinancialSheet>
  );
}
