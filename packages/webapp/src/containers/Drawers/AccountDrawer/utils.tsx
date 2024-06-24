// @ts-nocheck
import intl from 'react-intl-universal';
import React from 'react';

import { FormatDateCell } from '@/components';
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
        accessor: 'date',
        Cell: FormatDateCell,
        width: 110,
        textOverview: true,
      },
      {
        Header: intl.get('transaction_type'),
        accessor: 'transaction_type_formatted',
        width: 100,
        textOverview: true,
      },
      {
        Header: intl.get('debit'),
        accessor: isFCYCurrencyType ? 'formatted_fc_debit' : 'formatted_debit',
        width: 80,
        className: 'debit',
        align: 'right',
        textOverview: true,
      },
      {
        Header: intl.get('credit'),
        accessor: isFCYCurrencyType
          ? 'formatted_fc_credit'
          : 'formatted_credit',
        width: 80,
        className: 'credit',
        align: 'right',
        textOverview: true,
      },
    ],
    [isFCYCurrencyType],
  );
};
