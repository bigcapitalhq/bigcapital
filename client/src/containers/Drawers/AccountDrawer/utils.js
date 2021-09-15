import intl from 'react-intl-universal';
import React from 'react';

import { FormatDateCell } from '../../../components';
import { isBlank } from 'utils';

/**
 * Debit/credit table cell.
 */
function DebitCreditTableCell({ value, payload: { account } }) {
  return !isBlank(value) && value !== 0 ? account.formatted_amount : null;
}

/**
 * Running balance table cell.
 */
function RunningBalanceTableCell({ value, payload: { account } }) {
  return account.formatted_amount;
}

/**
 * Retrieve entries columns of read-only account view.
 */
export const useAccountReadEntriesColumns = () =>
  React.useMemo(
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
        accessor: 'reference_type_formatted',
        width: 100,
        textOverview: true,
      },
      {
        Header: intl.get('credit'),
        accessor: 'credit',
        Cell: DebitCreditTableCell,
        width: 80,
        className: 'credit',
        align: 'right',
        textOverview: true,
      },
      {
        Header: intl.get('debit'),
        accessor: 'debit',
        Cell: DebitCreditTableCell,
        width: 80,
        className: 'debit',
        align: 'right',
        textOverview: true,
      },
      {
        Header: intl.get('running_balance'),
        Cell: RunningBalanceTableCell,
        accessor: 'running_balance',
        width: 110,
        className: 'running_balance',
        align: 'right',
        textOverview: true,
      },
    ],
    [],
  );
