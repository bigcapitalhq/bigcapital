import React from 'react';
import { formatMessage } from 'services/intl';
import { If } from 'components';
import { useVendorsTranscationsContext } from './VendorsTransactionsProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';
import { defaultExpanderReducer, getColumnWidth, getForceWidth } from 'utils';
import { CellTextSpan } from 'components/Datatable/Cells';

/**
 * Retrieve vendors transcations columns.
 */
export const useVendorsTransactionsColumns = () => {
  const {
    vendorsTransactions: { tableRows },
  } = useVendorsTranscationsContext();

  return React.useMemo(
    () => [
      {
        Header: formatMessage({ id: 'vendor_name' }),
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
        className: 'vendor_name',
        textOverview: true,
        // width: 240,
      },
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: 'cells[1].value',
        className: 'name',
        textOverview: true,
        width: 180,
      },
      {
        Header: formatMessage({ id: 'reference_type' }),
        accessor: 'cells[2].value',
        textOverview: true,
        width: 180,
      },
      {
        Header: formatMessage({ id: 'transaction_type' }),
        accessor: 'cells[3].value',
        textOverview: true,
        width: 180,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        accessor: 'cells[4].value',
        className: 'credit',
        textOverview: true,
        width: getColumnWidth(tableRows, 'credit', {
          minWidth: 140,
          magicSpacing: 10,
        }),
      },
      {
        Header: formatMessage({ id: 'debit' }),
        accessor: 'cells[5].value',
        className: 'debit',
        textOverview: true,
        width: getColumnWidth(tableRows, 'debit', {
          minWidth: 140,
          magicSpacing: 10,
        }),
      },
      {
        Header: formatMessage({ id: 'running_balance' }),
        accessor: 'cells[6].value',
        className: 'running_balance',
        textOverview: true,
        width: getColumnWidth(tableRows, 'running_balance', {
          minWidth: 140,
          magicSpacing: 10,
        }),
      },
    ],
    [tableRows, formatMessage],
  );
};

/**
 * vendors transcations loading bar.
 */
export function VendorsTransactionsLoadingBar() {
  const { isVendorsTransactionsLoading } = useVendorsTranscationsContext();
  return (
    <If condition={isVendorsTransactionsLoading}>
      <FinancialLoadingBar />
    </If>
  );
}
