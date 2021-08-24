import React from 'react';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';

import { useAccountDrawerContext } from './AccountDrawerProvider';

import { DataTable, If } from 'components';

import { compose } from 'utils';
import { useAccountReadEntriesColumns } from './utils';

import withDrawerActions from 'containers/Drawer/withDrawerActions';


/**
 * account drawer table.
 */
function AccountDrawerTable({ closeDrawer }) {
  const {
    account,
    accounts,
    drawerName,
  } = useAccountDrawerContext();

  // Account read-only entries table columns.
  const columns = useAccountReadEntriesColumns();

  // Handle view more link click.
  const handleLinkClick = () => {
    closeDrawer(drawerName);
  };

  return (
    <div className={'account-drawer__table'}>
      <DataTable columns={columns} data={accounts} payload={{ account }}/>

      <If condition={accounts.length > 0}>
        <div class="account-drawer__table-footer">
          <Link
            to={`/financial-reports/general-ledger`}
            onClick={handleLinkClick}
          >
            ←{intl.get('view_more_transactions')}
          </Link>
        </div>
      </If>
    </div>
  );
}

export default compose(withDrawerActions)(AccountDrawerTable);
