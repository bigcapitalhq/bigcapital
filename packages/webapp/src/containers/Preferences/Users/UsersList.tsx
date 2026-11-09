import * as FF from 'fp-ts/function';
import { useEffect } from 'react';
import intl from 'react-intl-universal';
import { UsersDataTable } from './UsersDataTable';
import { UsersListProvider } from './UsersProvider';
import {
  withDashboardActions,
  type WithDashboardActionsProps,
} from '@/containers/Dashboard/withDashboardActions';

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

export const UsersList = FF.pipe(UsersListPreferences, withDashboardActions);
