import React from 'react';
import intl from 'react-intl-universal';
import * as R from 'ramda';

import { If } from '@/components';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';

import { Align } from 'common';

/**
 * Retrieve customers balance summary columns.
 */
export const useCustomersSummaryColumns = () => {
  const {
    CustomerBalanceSummary: { table },
  } = useCustomersBalanceSummaryContext();

  return React.useMemo(() => {
    return dynamicColumns(table.columns || []);
  }, [table.columns]);
};

/**
 * Account name column accessor.
 */
const accountNameColumnAccessor = () => ({
  Header: intl.get('customer_name'),
  accessor: 'cells[0].value',
  className: 'customer_name',
  width: 240,
});

/**
 * Total column accessor.
 */
const totalColumnAccessor = () => ({
  Header: intl.get('total'),
  accessor: 'cells[1].value',
  className: 'total',
  width: 140,
  align: Align.Right,
});

/**
 * Percentage column accessor.
 */
const percentageColumnAccessor = () => ({
  Header: intl.get('percentage_of_column'),
  accessor: 'cells[2].value',
  className: 'total',
  width: 140,
  align: Align.Right,
});

const dynamicColumns = (columns) => {
  return R.map(
    R.compose(
      R.when(R.pathEq(['key'], 'name'), accountNameColumnAccessor),
      R.when(R.pathEq(['key'], 'total'), totalColumnAccessor),
      R.when(
        R.pathEq(['key'], 'percentage_of_column'),
        percentageColumnAccessor,
      ),
    ),
  )(columns);
};

/**
 * customers balance summary loading bar.
 */
export function CustomersBalanceLoadingBar() {
  const { isCustomersBalanceFetching } = useCustomersBalanceSummaryContext();

  return (
    <If condition={isCustomersBalanceFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
