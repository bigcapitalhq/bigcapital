import React from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@blueprintjs/core';
import { Icon, If } from 'components';
import { getForceWidth, getColumnWidth } from 'utils';
import { useGeneralLedgerContext } from './GeneralLedgerProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve the general ledger table columns.
 */
export function useGeneralLedgerTableColumns() {
  const { formatMessage } = useIntl();

  // General ledger context.
  const {
    generalLedger: { tableRows },
  } = useGeneralLedgerContext();

  return React.useMemo(
    () => [
      {
        Header: formatMessage({ id: 'date' }),
        accessor: (row) => {
          if (row.rowType === 'ACCOUNT_ROW') {
            return (
              <span
                className={'force-width'}
                style={{ minWidth: getForceWidth(row.date) }}
              >
                {row.date}
              </span>
            );
          }
          return row.date;
        },
        className: 'date',
        width: 120,
      },
      {
        Header: formatMessage({ id: 'account_name' }),
        accessor: 'name',
        className: 'name',
        textOverview: true,
        // width: 200,
      },
      {
        Header: formatMessage({ id: 'transaction_type' }),
        accessor: 'reference_type_formatted',
        className: 'transaction_type',
        width: 125,
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'transaction_number' }),
        accessor: 'reference_id',
        className: 'transaction_number',
        width: 100,
      },
      {
        Header: formatMessage({ id: 'description' }),
        accessor: 'note',
        className: 'description',
        // width: 145,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        accessor: 'formatted_credit',
        className: 'credit',
        width: getColumnWidth(tableRows, 'formatted_credit', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: formatMessage({ id: 'debit' }),
        accessor: 'formatted_debit',
        className: 'debit',
        width: getColumnWidth(tableRows, 'formatted_debit', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: formatMessage({ id: 'amount' }),
        accessor: 'formatted_amount',
        className: 'amount',
        width: getColumnWidth(tableRows, 'formatted_amount', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
      {
        Header: formatMessage({ id: 'running_balance' }),
        accessor: 'formatted_running_balance',
        className: 'running_balance',
        width: getColumnWidth(tableRows, 'formatted_running_balance', {
          minWidth: 100,
          magicSpacing: 10,
        }),
      },
    ],
    [formatMessage, tableRows],
  );
}


/**
 * General ledger sheet alerts.
 */
 export function GeneralLedgerSheetAlerts() {
  const {
    generalLedger,
    isLoading,
    sheetRefresh
  } = useGeneralLedgerContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    sheetRefresh();
  };
  // Can't display any error if the report is loading.
  if (isLoading) { return null; }

  return (
    <If condition={generalLedger.meta.is_cost_compute_running}>
      <div class="alert-compute-running">
        <Icon icon="info-block" iconSize={12} /> Just a moment! We're
        calculating your cost transactions and this doesn't take much time.
        Please check after sometime.{' '}

        <Button onClick={handleRecalcReport} minimal={true} small={true}>
          Refresh
        </Button>
      </div>
    </If>
  );
}

/**
 * General ledger sheet loading bar.
 */
export function GeneralLedgerSheetLoadingBar() {
  const {
    isFetching,
  } = useGeneralLedgerContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  )
}
