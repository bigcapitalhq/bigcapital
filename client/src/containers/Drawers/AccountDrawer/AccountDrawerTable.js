import React from 'react';
import moment from 'moment';
import { useAccountDrawerContext } from './AccountDrawerProvider';

import { formatMessage } from 'services/intl';
import { DataTable, Money } from 'components';
import { isBlank } from 'utils';

/**
 * account drawer table.
 */
export default function AccountDrawerTable() {
  const {
    account: { currency_code },
    accounts,
  } = useAccountDrawerContext();

  const columns = React.useMemo(
    () => [
      {
        Header: formatMessage({ id: 'transaction_date' }),
        accessor: ({ date }) => moment(date).format('YYYY MMM DD'),
        width: 110,
      },
      {
        Header: formatMessage({ id: 'transaction_type' }),
        accessor: 'reference_type_formatted',
        width: 100,
      },
      {
        Header: formatMessage({ id: 'credit' }),
        accessor: ({ credit }) =>
          !isBlank(credit) && credit !== 0 ? (
            <Money amount={credit} currency={currency_code} />
          ) : null,
        width: 80,
      },
      {
        Header: formatMessage({ id: 'debit' }),
        accessor: ({ debit }) =>
          !isBlank(debit) && debit !== 0 ? (
            <Money amount={debit} currency={currency_code} />
          ) : null,
        width: 80,
      },
      {
        Header: formatMessage({ id: 'running_balance' }),
        accessor: 'balance',
        width: 110,
      },
    ],
    [],
  );

  return (
    <div className={'account-drawer__table'}>
      <DataTable columns={columns} data={accounts} />
    </div>
  );
}
