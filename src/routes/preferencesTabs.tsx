// @ts-nocheck
// import AccountsCustomFields from "containers/Preferences/AccountsCustomFields";
import UsersList from '../containers/Preferences/Users/UsersList';
import RolesList from '../containers/Preferences/Users/Roles/RolesLanding/RolesList';

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
