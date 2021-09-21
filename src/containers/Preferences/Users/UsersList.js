import React, { useEffect } from 'react';
import intl from 'react-intl-universal';

import  {UsersListProvider } from './UsersProvider';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';

import UsersDataTable from './UsersDataTable';
import UsersAlerts from './UsersAlerts';
import { compose } from 'utils';

/**
 * Users list.
 */
function UsersListPreferences({
  // #withDashboardActions
  changePreferencesPageTitle,
}) {

  useEffect(() => {
    changePreferencesPageTitle(intl.get('users'));
  }, [changePreferencesPageTitle]);

  return (
    <UsersListProvider>
      <UsersDataTable />
      <UsersAlerts />
    </UsersListProvider>
  );
}

export default compose(
  withDashboardActions,
)(UsersListPreferences);
