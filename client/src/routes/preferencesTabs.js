import AccountsCustomFields from "containers/Dashboard/Preferences/AccountsCustomFields";
import UsersList from 'containers/Dashboard/Preferences/UsersList';
import RolesList from 'containers/Dashboard/Preferences/RolesList';

export default {
  accounts: [
    {
      path: '',
      component: AccountsCustomFields,
      exact: true,
    },
    {
      name: 'dashboard.preferences.accounts.custom_fields',
      path: 'custom_fields',
      component: AccountsCustomFields,
      exact: true,
    },
  ],
  users: [
    {
      path: '',
      component: UsersList,
      exact: true,
    },
    {
      name: 'dashboard.preferences.users.roles',
      path: '/roles',
      component: RolesList,
      exact: true,
    },
  ],
} 