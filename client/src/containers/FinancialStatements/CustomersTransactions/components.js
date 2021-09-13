import React from 'react';
import intl from 'react-intl-universal';
import { If } from 'components';
import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { getForceWidth, getColumnWidth } from 'utils';

/**
 * Retrieve customers transactions columns.
 */

export const useCustomersTransactionsColumns = () => {
  const {
    customersTransactions: { tableRows },
  } = useCustomersTransactionsContext();

  return React.useMemo(
    () => [
      {
        Header: intl.get('customer_name'),
        accessor: ({ cells }) => {
          return (
            <span
              className={'force-width'}
              style={{ minWidth: getForceWidth(cells[0].key) }}
            >
              {cells[0].value}
            </span>
          );
        },
        className: 'customer_name',
        textOverview: true,
      },
      {
        Header: intl.get('account_name'),
        accessor: 'cells[1].value',
        className: 'name',
        textOverview: true,
        width: 170,
      },
      {
        Header: intl.get('reference_type'),
        accessor: 'cells[2].value',
        width: 120,
        textOverview: true,
      },
      {
        Header: intl.get('transaction_type'),
        accessor: 'cells[3].value',
        width: 120,
        textOverview: true,
      },
      {
        Header: intl.get('credit'),
        accessor: 'cells[4].value',
        className: 'credit',
        textOverview: true,
        width: getColumnWidth(tableRows, 'cells[5].value', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: intl.get('debit'),
        accessor: 'cells[5].value',
        className: 'debit',
        textOverview: true,
        width: getColumnWidth(tableRows, 'cells[6].value', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: intl.get('running_balance'),
        accessor: 'cells[6].value',
        className: 'running_balance',
        textOverview: true,
        width: getColumnWidth(tableRows, 'cells[7].value', {
          minWidth: 120,
          magicSpacing: 10,
        }),
      },
    ],
    [tableRows],
  );
};

/**
 * customers transactions loading bar.
 */
export function CustomersTransactionsLoadingBar() {
  const { isCustomersTransactionsFetching } = useCustomersTransactionsContext();

  return (
    <If condition={isCustomersTransactionsFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
