import React from 'react';
import intl from 'react-intl-universal';
import { If } from 'components';
import { useVendorsTransactionsContext } from './VendorsTransactionsProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { getColumnWidth, getForceWidth } from 'utils';

/**
 * Retrieve vendors transactions columns.
 */
export const useVendorsTransactionsColumns = () => {
  const {
    vendorsTransactions: { tableRows },
  } = useVendorsTransactionsContext();

  return React.useMemo(
    () => [
      {
        Header: intl.get('vendor_name'),
        accessor: ({ cells }) => {
          return (
            <span
              className={'force-width'}
              style={{ minWidth: getForceWidth(cells[0].value) }}
            >
              {cells[0].value}
            </span>
          );
        },
        className: 'vendor_name',
        // textOverview: true,
        // width: 240,
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
        textOverview: true,
        width: 120,
      },
      {
        Header: intl.get('transaction_type'),
        accessor: 'cells[3].value',
        textOverview: true,
        width: 120,
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
 * vendors transactions loading bar.
 */
export function VendorsTransactionsLoadingBar() {
  const { isVendorsTransactionFetching } = useVendorsTransactionsContext();

  return (
    <If condition={isVendorsTransactionFetching}>
      <FinancialLoadingBar />
    </If>
  );
}
