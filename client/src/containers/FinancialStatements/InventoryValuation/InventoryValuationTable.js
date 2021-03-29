import React from 'react';
import { useIntl } from 'react-intl';

import FinancialSheet from 'components/FinancialSheet';
import { DataTable } from 'components';

import { useInventoryValuationContext } from './InventoryValuationProvider';
import { useInventoryValuationTableColumns } from './components';

/**
 * inventory valuation data table.
 */
export default function InventoryValuationTable({
  //#ownProps
  companyName,
}) {
  const { formatMessage } = useIntl();

  // inventory valuation context.
  const {
    inventoryValuation: { tableRows },
    isLoading,
  } = useInventoryValuationContext();

  // inventory valuation table columns.
  const columns = useInventoryValuationTableColumns();

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
      name="inventory-valuation"
      sheetType={formatMessage({ id: 'inventory_valuation' })}
      asDate={new Date()}
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
