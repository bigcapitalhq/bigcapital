import intl from 'react-intl-universal';
import React from 'react';
import moment from 'moment';

import { Money } from 'components';
import { isBlank } from 'utils';

/**
 * Debit/credit table cell.
 */
function DebitCreditTableCell({ value, payload: { account } }) {
  return !isBlank(value) && value !== 0
    ? // <Money amount={value} currency={account.currency_code} />
      account.formatted_amount
    : null;
}

/**
 * Running balance table cell.
 */
function RunningBalanceTableCell({ value, payload: { account } }) {
  return (
    // <Money amount={value} currency={account.currency_code} />
    account.formatted_amount
  );
}

/**
 * Retrieve entries columns of read-only account view.
 */
export const useAccountReadEntriesColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('transaction_date'),
        accessor: ({ date }) => moment(date).format('YYYY MMM DD'),
        width: 110,
      },
      {
        Header: intl.get('transaction_type'),
        accessor: 'reference_type_formatted',
        width: 100,
      },
      {
        Header: intl.get('credit'),
        accessor: 'credit',
        Cell: DebitCreditTableCell,
        width: 80,
      },
      {
        Header: intl.get('debit'),
        accessor: 'debit',
        Cell: DebitCreditTableCell,
        width: 80,
      },
      {
        Header: intl.get('running_balance'),
        Cell: RunningBalanceTableCell,
        accessor: 'running_balance',
        width: 110,
      },
    ],
    [],
  );
