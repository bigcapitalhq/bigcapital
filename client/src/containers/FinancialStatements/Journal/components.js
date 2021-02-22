import React from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';

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
