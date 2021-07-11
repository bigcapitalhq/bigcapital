import React from 'react';
import intl from 'react-intl-universal';

import { If } from 'components';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { useCustomersBalanceSummaryContext } from './CustomersBalanceSummaryProvider';

/**
 * Retrieve customers balance summary columns.
 */
export const useCustomersSummaryColumns = () => {
  return React.useMemo(
    () => [
      {
        Header: intl.get('customer_name'),
        accessor: 'cells[0].value',
        className: 'customer_name',
        width: 240,
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
        className: 'total',
        width: 140,
      },
    ],
    [],
  );
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
