import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useAccountDrawerContext } from './AccountDrawerProvider';

import { formatMessage } from 'services/intl';
import { DataTable, Money } from 'components';
import { isBlank, compose } from 'utils';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

/**
 * account drawer table.
 */
function AccountDrawerTable({
  closeDrawer
}) {
  const {
    account: { currency_code },
    accounts,
    drawerName
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
        accessor: ({ running_balance }) => (
          <Money amount={running_balance} currency={currency_code} />
        ),
        width: 110,
      },
    ],
    [],
  );

  // Handle view more link click.
  const handleLinkClick = () => {
    closeDrawer(drawerName);
  };

  return (
    <div className={'account-drawer__table'}>
      <DataTable columns={columns} data={accounts} />

      <div class="account-drawer__table-footer">
        <Link to={`/financial-reports/general-ledger`} onClick={handleLinkClick}>
          ← View more transactions.
        </Link>
      </div>
    </div>
  );
}

export default compose(
  withDrawerActions
)(AccountDrawerTable);