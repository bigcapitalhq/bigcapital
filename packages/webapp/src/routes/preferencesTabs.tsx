// @ts-nocheck
// import AccountsCustomFields from "containers/Preferences/AccountsCustomFields";
import { RolesListPrefernces as RolesList } from '../containers/Preferences/Users/Roles/RolesLanding/RolesList';
import { UsersList } from '../containers/Preferences/Users/UsersList';

export default {
  users: [
    {
      path: '',
      component: UsersList,
      exact: true,
    },
  ],
  roles: [
    {
      path: '',
      component: RolesList,
      exact: true,
    },
  ],
};
