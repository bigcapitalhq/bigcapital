import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { UsersListProvider } from './UsersProvider';
import {
  withDashboardActions,
  type WithDashboardActionsProps,
} from '@/containers/Dashboard/withDashboardActions';
import { UsersDataTable } from './UsersDataTable';
import { flow } from 'fp-ts/function';

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

export const UsersList = flow(withDashboardActions)(
  UsersListPreferences,
);
