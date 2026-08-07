import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { UsersDataTable } from './UsersDataTable';
import { UsersListProvider } from './UsersProvider';
import {
  withDashboardActions,
  type WithDashboardActionsProps,
} from '@/containers/Dashboard/withDashboardActions';
import { compose } from '@/utils';

function UsersListPreferences({
  changePreferencesPageTitle,
}: WithDashboardActionsProps) {
  useEffect(() => {
    changePreferencesPageTitle(intl.get('users'));
  }, [changePreferencesPageTitle]);

  return (
    <UsersListProvider>
      <UsersDataTable />
    </UsersListProvider>
  );
}

export const UsersList = compose(withDashboardActions)(UsersListPreferences);
