import React from 'react';
import { formatMessage } from 'services/intl';
import { If } from 'components';
import { useCustomersTransactionsContext } from './CustomersTransactionsProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { getForceWidth, defaultExpanderReducer, getColumnWidth } from 'utils';
import { CellTextSpan } from 'components/Datatable/Cells';

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
        Header: formatMessage({ id: 'customer_name' }),
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
        // width: 240,
      },
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: 'cells[1].value',
        className: 'name',
        textOverview: true,
        width: 170,
      },
      {
        Header: formatMessage({ id: 'reference_type' }),
        accessor: 'cells[2].value',
        width: 120,
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'transaction_type' }),
        accessor: 'cells[3].value',
        width: 120,
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        accessor: 'cells[4].value',
        className: 'credit',
        textOverview: true,
        width: getColumnWidth(tableRows, 'cells[5].value', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: formatMessage({ id: 'debit' }),
        accessor: 'cells[5].value',
        className: 'debit',
        textOverview: true,
        width: getColumnWidth(tableRows, 'cells[6].value', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: formatMessage({ id: 'running_balance' }),
        accessor: 'cells[6].value',
        className: 'running_balance',
        textOverview: true,
        width: getColumnWidth(tableRows, 'cells[7].value', {
          minWidth: 120,
          magicSpacing: 10,
        }),
      },
    ],
    [tableRows, formatMessage],
  );
};

/**
 * customers transactions loading bar.
 */
export function CustomersTransactionsLoadingBar() {
  const { isCustomersTransactionsLoading } = useCustomersTransactionsContext();

  return (
    <If condition={isCustomersTransactionsLoading}>
      <FinancialLoadingBar />
    </If>
  );
}
