import React from 'react';
import { DataTable, Card } from 'components';
import intl from 'react-intl-universal';
import moment from 'moment';

/**
 * Journal entries table.
 */
export default function JournalEntriesTable({ journal }) {
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
        accessor: 'account_name',
        width: 150,
      },
      {
        Header: intl.get('contact'),
        accessor: 'contact',
        width: 150,
      },
      {
        Header: intl.get('credit'),
        accessor: 'credit',
        width: 100,
      },
      {
        Header: intl.get('debit'),
        accessor: 'debit',
        width: 100,
      },
    ],
    [],
  );

  return (
    <Card>
      <DataTable
        columns={columns}
        data={journal}
        className={'datatable--journal-entries'}
      />
    </Card>
  );
}
