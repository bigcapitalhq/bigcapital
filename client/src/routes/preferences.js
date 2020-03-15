import General from 'containers/Dashboard/Preferences/General';
import Users from 'containers/Dashboard/Preferences/Users';
import Accountant from 'containers/Dashboard/Preferences/Accountant';
import Accounts from 'containers/Dashboard/Preferences/Accounts';

const BASE_URL = '/dashboard/preferences';

export default [
  {
    path: `${BASE_URL}/general`,
    name: 'dashboard.preferences.general',
    component: General,
    exact: true,
  },
  {
    path: `${BASE_URL}/users`,
    name: 'dashboard.preferences.users',
    component: Users,
    exact: true,
  },
  {
    path: `${BASE_URL}/accountant`,
    name: 'dashboard.preferences.accountant',
    component: Accountant,
    exact: true,
  },
  {
    path: `${BASE_URL}/accounts`,
    name: 'dashboard.preferences.accounts',
    component: Accounts,
  },
];