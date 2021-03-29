import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { getColumnWidth } from 'utils';
import { If } from 'components';
import { CellTextSpan } from 'components/Datatable/Cells';
import { useInventoryValuationContext } from './InventoryValuationProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve inventory valuation table columns.
 */

export const useInventoryValuationTableColumns = () => {
  const { formatMessage } = useIntl();

  // inventory valuation context
  const {
    inventoryValuation: { tableRows },
  } = useInventoryValuationContext();

  return useMemo(
    () => [
      {
        Header: formatMessage({ id: 'item_name' }),
        accessor: (row) => (row.code ? `${row.name} - ${row.code}` : row.name),
        className: 'name',
        width: 240,
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'quantity' }),
        accessor: 'quantity_formatted',
        Cell: CellTextSpan,
        className: 'quantity_formatted',
        width: getColumnWidth(tableRows, `quantity_formatted`, {
          minWidth: 120,
        }),
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'asset_value' }),
        accessor: 'valuation_formatted',
        Cell: CellTextSpan,
        className: 'valuation',
        width: getColumnWidth(tableRows, `valuation_formatted`, {
          minWidth: 120,
        }),
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'average' }),
        accessor: 'average_formatted',
        Cell: CellTextSpan,
        className: 'average_formatted',
        width: getColumnWidth(tableRows, `average_formatted`, {
          minWidth: 120,
        }),
        textOverview: true,
      },
    ],
    [tableRows, formatMessage],
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
