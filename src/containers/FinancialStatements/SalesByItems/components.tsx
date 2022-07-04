import React, { useMemo } from 'react';
import intl from 'react-intl-universal';

import { getColumnWidth } from 'utils';
import { If } from '@/components';
import { CellTextSpan } from '@/components/Datatable/Cells';
import { useSalesByItemsContext } from './SalesByItemProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

import { Align } from 'common';

/**
 * Retrieve sales by items table columns.
 */
export const useSalesByItemsTableColumns = () => {
  //sales by items context.
  const {
    salesByItems: { tableRows },
  } = useSalesByItemsContext();

  return useMemo(
    () => [
      {
        Header: intl.get('item_name'),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        width: 180,
        textOverview: true,
      },
      {
        Header: intl.get('sold_quantity'),
        accessor: 'quantity_sold_formatted',
        Cell: CellTextSpan,
        className: 'quantity_sold',
        width: getColumnWidth(tableRows, `quantity_sold_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('sold_amount'),
        accessor: 'sold_cost_formatted',
        Cell: CellTextSpan,
        className: 'sold_cost',
        width: getColumnWidth(tableRows, `sold_cost_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
        align: Align.Right,
      },
      {
        Header: intl.get('average_price'),
        accessor: 'average_sell_price_formatted',
        Cell: CellTextSpan,
        className: 'average_sell_price',
        width: getColumnWidth(tableRows, `average_sell_price_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
        align: Align.Right,
      },
    ],
    [tableRows],
  );
};

/**
 * sales by items progress loading bar.
 */
export function SalesByItemsLoadingBar() {
  const { isFetching } = useSalesByItemsContext();
  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
