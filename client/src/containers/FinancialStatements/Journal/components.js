import React from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import { Button } from '@blueprintjs/core';
import { Icon, If } from 'components';
import { useJournalSheetContext } from './JournalProvider';
import FinancialLoadingBar from '../FinancialLoadingBar';

/**
 * Retrieve the journal table columns.
 */
export const useJournalTableColumns = () => {
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        Header: formatMessage({ id: 'date' }),
        accessor: (row) =>
          row.date ? moment(row.date).format('YYYY MMM DD') : '',
        className: 'date',
        width: 100,
      },
      {
        Header: formatMessage({ id: 'transaction_type' }),
        accessor: 'reference_type_formatted',
        className: 'reference_type_formatted',
        width: 120,
      },
      {
        Header: formatMessage({ id: 'num' }),
        accessor: 'reference_id',
        className: 'reference_id',
        width: 70,
      },
      {
        Header: formatMessage({ id: 'description' }),
        accessor: 'note',
        className: 'note',
      },
      {
        Header: formatMessage({ id: 'acc_code' }),
        accessor: 'account_code',
        width: 95,
        className: 'account_code',
      },
      {
        Header: formatMessage({ id: 'account' }),
        accessor: 'account_name',
        className: 'account_name',
        textOverview: true,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        accessor: 'formatted_credit',
        className: 'credit',
      },
      {
        Header: formatMessage({ id: 'debit' }),
        accessor: 'formatted_debit',
        className: 'debit',
      },
    ],
    [formatMessage],
  );
};

/**
 * Journal sheet loading bar.
 */
export function JournalSheetLoadingBar() {
  const {
    isFetching
  } = useJournalSheetContext();

  return (
    <If condition={isFetching}>
      <FinancialLoadingBar />
    </If>
  )
}

/**
 * Journal sheet alerts.
 */
 export function JournalSheetAlerts() {
  const {
    isLoading,
    refetchSheet,
    journalSheet,
  } = useJournalSheetContext();

  // Handle refetch the report sheet.
  const handleRecalcReport = () => {
    refetchSheet();
  };
  // Can't display any error if the report is loading.
  if (isLoading) { return null; }

  return (
    <If condition={journalSheet.meta.is_cost_compute_running}>
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