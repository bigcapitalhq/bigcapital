import React, { useMemo } from 'react';
import { formatMessage } from 'services/intl';

import { If } from 'components';
import { getColumnWidth } from 'utils';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';

/**
 * Retrieve vendors balance summary columns.
 */
export const useVendorsBalanceColumns = () => {
  return useMemo(() => [
    {
      Header: formatMessage({ id: 'vendor_name' }),
      accessor: 'cells[0].value',
      className: 'customer_name',
      width: 240,
      sticky: 'left',
      textOverview: true,
    },
    {
      Header: formatMessage({ id: 'total' }),
      accessor: 'cells[1].value',
      className: 'total',
      width: 140,
    },
    {
      Header: formatMessage({ id: 'percentage_of_column' }),
      accessor: 'cells[2].value',
      // className: 'total',
      width: 140,
    },
  ]);
};

/**
 * vendors balance summary loading bar.
 */
export function VendorsSummarySheetLoadingBar() {
  const { isVendorsBalanceFetching } = useVendorsBalanceSummaryContext();
  return (
    <If condition={isVendorsBalanceFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
