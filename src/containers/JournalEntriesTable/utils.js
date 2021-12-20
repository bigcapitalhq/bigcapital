import React from 'react';
import intl from 'react-intl-universal';
import moment from 'moment';


export const useGLEntriesTableColumns = () => {
  return React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: 'date',
        accessor: ({ formatted_date }) =>
          moment(formatted_date).format('YYYY MMM DD'),
        width: 140,
        className: 'date',
      },
      {
        Header: intl.get('account_name'),
        accessor: 'account_name',
        width: 140,
        className: 'account_name',
      },
      {
        Header: intl.get('contact'),
        accessor: 'contactTypeFormatted',
        width: 140,
      },
      {
        Header: intl.get('credit'),
        accessor: ({ credit }) => credit.formatted_amount,
        width: 100,
        className: 'credit',
        textAligment: 'right',
      },
      {
        Header: intl.get('debit'),
        accessor: ({ debit }) => debit.formatted_amount,
        width: 100,
        className: 'debit',
      },
    ],
    [],
  );
};
