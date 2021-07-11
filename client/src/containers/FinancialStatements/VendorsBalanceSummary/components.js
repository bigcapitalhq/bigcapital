import React, { useMemo } from 'react';
import intl from 'react-intl-universal';

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
      Header: intl.get('vendor_name'),
      accessor: 'cells[0].value',
      className: 'customer_name',
      width: 240,
      sticky: 'left',
      textOverview: true,
    },
    {
      Header: intl.get('total'),
      accessor: 'cells[1].value',
      className: 'total',
      width: 140,
    },
    {
      Header: intl.get('percentage_of_column'),
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
