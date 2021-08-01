import React from 'react';
import { DataTable, Card } from 'components';
import intl from 'react-intl-universal';
import moment from 'moment';

/**
 * Journal entries table.
 */
export default function JournalEntriesTable({ transactions }) {
  const columns = React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: 'date',
        // accessor: (r) => moment(new Date()).format('YYYY MMM DD'),
        width: 150,
      },
      {
        Header: intl.get('account_name'),
        accessor: 'accountName',
        width: 150,
      },
      {
        Header: intl.get('contact'),
        accessor: 'contactTypeFormatted',
        width: 150,
      },
      {
        Header: intl.get('credit'),
        accessor: ({ credit }) => credit.formattedAmount,
        width: 100,
      },
      {
        Header: intl.get('debit'),
        accessor: ({ debit }) => debit.formattedAmount,
        width: 100,
      },
    ],
    [],
  );

  return (
    <Card>
      <DataTable
        columns={columns}
        data={transactions}
        className={'datatable--journal-entries'}
      />
    </Card>
  );
}
