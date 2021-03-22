import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

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
  const { formatMessage } = useIntl();

  useEffect(() => {
    changePreferencesPageTitle(formatMessage({ id: 'users' }));
  }, [changePreferencesPageTitle, formatMessage]);

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
