// import AccountsCustomFields from "containers/Preferences/AccountsCustomFields";
import UsersList from 'containers/Preferences/Users/UsersList';
import RolesList from 'containers/Preferences/Users/RolesList';

export default {
  accounts: [
    // {
    //   path: '',
    //   component: AccountsCustomFields,
    //   exact: true,
    // },
    // {
    //   path: 'custom_fields',
    //   component: AccountsCustomFields,
    //   exact: true,
    // },
  ],
  users: [
    {
      path: '',
      component: UsersList,
      exact: true,
    },
    {
      path: '/roles',
      component: RolesList,
      exact: true,
    },
  ],
} 