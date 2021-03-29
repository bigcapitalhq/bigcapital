import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@blueprintjs/core';
import { getColumnWidth } from 'utils';
import { If, Icon } from 'components';
import { CellTextSpan } from 'components/Datatable/Cells';
import { useSalesByItemsContext } from './SalesByItemProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve sales by items table columns.
 */
export const useSalesByItemsTableColumns = () => {
  const { formatMessage } = useIntl();

  //sales by items context.
  const {
    salesByItems: { tableRows },
  } = useSalesByItemsContext();

  return useMemo(
    () => [
      {
        Header: formatMessage({ id: 'item_name' }),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        width: 180,
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'sold_quantity' }),
        accessor: 'quantity_sold_formatted',
        Cell: CellTextSpan,
        className: 'quantity_sold',
        width: getColumnWidth(tableRows, `quantity_sold_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'sold_amount' }),
        accessor: 'sold_cost_formatted',
        Cell: CellTextSpan,
        className: 'sold_cost',
        width: getColumnWidth(tableRows, `sold_cost_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'average_price' }),
        accessor: 'average_sell_price_formatted',
        Cell: CellTextSpan,
        className: 'average_sell_price',
        width: getColumnWidth(tableRows, `average_sell_price_formatted`, {
          minWidth: 150,
        }),
        textOverview: true,
      },
    ],
    [tableRows, formatMessage],
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
