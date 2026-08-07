import React from 'react';
import intl from 'react-intl-universal';
import { useAccountDrawerTableOptionsContext } from './AccountDrawerTableOptionsProvider';

/**
 * Retrieve entries columns of read-only account view.
 */
export const useAccountReadEntriesColumns = () => {
  const { isFCYCurrencyType } = useAccountDrawerTableOptionsContext();

  return React.useMemo(
    () => [
      {
        Header: intl.get('transaction_date'),
        accessor: 'formattedDate',
        width: 110,
        textOverview: true,
      },
      {
        Header: intl.get('transaction_type'),
        accessor: 'transactionTypeFormatted',
        width: 100,
        textOverview: true,
      },
      {
        Header: intl.get('debit'),
        accessor: isFCYCurrencyType ? 'formattedFcDebit' : 'formattedDebit',
        width: 80,
        className: 'debit',
        align: 'right',
        textOverview: true,
      },
      {
        Header: intl.get('credit'),
        accessor: isFCYCurrencyType ? 'formattedFcCredit' : 'formattedCredit',
        width: 80,
        className: 'credit',
        align: 'right',
        textOverview: true,
      },
    ],
    [isFCYCurrencyType],
  );
};
