// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import { If } from '@/components';
import { Align } from '@/constants';
import { CellTextSpan } from '@/components/Datatable/Cells';
import { usePurchaseByItemsContext } from './PurchasesByItemsProvider';
import { getColumnWidth } from '@/utils';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve purchases by items table columns.
 */
export const usePurchasesByItemsTableColumns = () => {
  // purchases by items context.
  const {
    purchaseByItems: { tableRows },
  } = usePurchaseByItemsContext();

  return React.useMemo(
    () => [
      {
        Header: intl.get('item_name'),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        width: 180,
        textOverview: true,
      },
      {
        Header: intl.get('quantity_purchased'),
        accessor: 'quantity_purchased_formatted',
        Cell: CellTextSpan,
        className: 'quantity_purchased_formatted',
        width: getColumnWidth(tableRows, `quantity_purchased_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('purchase_amount'),
        accessor: 'purchase_cost_formatted',
        Cell: CellTextSpan,
        className: 'purchase_cost_formatted',
        width: getColumnWidth(tableRows, `purchase_cost_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('average_price'),
        accessor: 'average_cost_price_formatted',
        Cell: CellTextSpan,
        className: 'average_cost_price_formatted',
        width: getColumnWidth(tableRows, `average_cost_price_formatted`, {
          minWidth: 180,
        }),
        textOverview: true,
        align: Align.Right,
      },
    ],
    [tableRows],
  );
};

/**
 * Purchases by items progress loading bar.
 */
export function PurchasesByItemsLoadingBar() {
  const { isFetching } = usePurchaseByItemsContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
