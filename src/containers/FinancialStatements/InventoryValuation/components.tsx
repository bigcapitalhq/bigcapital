import React, { useMemo } from 'react';
import intl from 'react-intl-universal';

import { If } from '@/components';
import { Align } from '@/constants';
import { getColumnWidth } from '@/utils';
import { CellTextSpan } from '@/components/Datatable/Cells';
import { useInventoryValuationContext } from './InventoryValuationProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve inventory valuation table columns.
 */
export const useInventoryValuationTableColumns = () => {
  // inventory valuation context
  const {
    inventoryValuation: { tableRows },
  } = useInventoryValuationContext();

  return useMemo(
    () => [
      {
        Header: intl.get('item_name'),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        width: 240,
        textOverview: true,
      },
      {
        Header: intl.get('quantity'),
        accessor: 'quantity_formatted',
        Cell: CellTextSpan,
        className: 'quantity_formatted',
        width: getColumnWidth(tableRows, `quantity_formatted`, {
          minWidth: 120,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('asset_value'),
        accessor: 'valuation_formatted',
        Cell: CellTextSpan,
        className: 'valuation',
        width: getColumnWidth(tableRows, `valuation_formatted`, {
          minWidth: 120,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('average'),
        accessor: 'average_formatted',
        Cell: CellTextSpan,
        className: 'average_formatted',
        width: getColumnWidth(tableRows, `average_formatted`, {
          minWidth: 120,
        }),
        textOverview: true,
        align: Align.Right,
      },
    ],
    [tableRows],
  );
};

/**
 * inventory valuation progress loading bar.
 */
export function InventoryValuationLoadingBar() {
  const { isFetching } = useInventoryValuationContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
