import React from 'react';
import intl from 'react-intl-universal';
import * as R from 'ramda';

import { If } from '@/components';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { useVendorsBalanceSummaryContext } from './VendorsBalanceSummaryProvider';

import { Align } from 'common';

/**
 * Retrieve vendors balance summary columns.
 */
export const useVendorsBalanceColumns = () => {
  const {
    VendorBalanceSummary: { table },
  } = useVendorsBalanceSummaryContext();

  return React.useMemo(() => {
    return dynamicColumns(table.columns || []);
  }, [table.columns]);
};

/**
 * Vendor name accessor.
 */
const vendorColumnAccessor = () => ({
  Header: intl.get('vendor_name'),
  accessor: 'cells[0].value',
  className: 'vendor_name',
  width: 240,
  align: 'left',
  textOverview: true,
});

/**
 * Percentage column accessor.
 */
const percentageColumnAccessor = () => ({
  Header: intl.get('percentage_of_column'),
  accessor: 'cells[2].value',
  className: 'total',
  width: 140,
  textOverview: true,
  align: Align.Right,
});

/**
 * Total column accessor.
 */
const totalColumnAccessor = () => ({
  Header: intl.get('total'),
  accessor: 'cells[1].value',
  className: 'total',
  width: 140,
  textOverview: true,
  align: Align.Right,
});

/**
 * Composes the response columns to table component columns.
 */
const dynamicColumns = (columns) => {
  return R.map(
    R.compose(
      R.when(R.pathEq(['key'], 'name'), vendorColumnAccessor),
      R.when(R.pathEq(['key'], 'total'), totalColumnAccessor),
      R.when(
        R.pathEq(['key'], 'percentage_of_column'),
        percentageColumnAccessor,
      ),
    ),
  )(columns);
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
