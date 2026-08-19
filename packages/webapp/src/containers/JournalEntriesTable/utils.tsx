// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

export const useGLEntriesTableColumns = () => {
  return React.useMemo(
    () => [
      {
        Header: intl.get('date'),
        accessor: 'date.formattedDate',
        width: 140,
        className: 'date',
        textOverview: true,
      },
      {
        Header: intl.get('account_name'),
        accessor: 'accountName',
        width: 140,
        className: 'account_name',
        textOverview: true,
      },
      {
        Header: intl.get('contact'),
        accessor: 'formattedContactType',
        width: 140,
        textOverview: true,
      },
      {
        Header: intl.get('debit'),
        accessor: ({ debit }) => debit.formattedAmount,
        width: 100,
        className: 'debit',
        textOverview: true,
        align: 'right',
      },
      {
        Header: intl.get('credit'),
        accessor: ({ credit }) => credit.formattedAmount,
        width: 100,
        className: 'credit',
        align: 'right',
        textOverview: true,
      },
    ],
    [],
  );
};
