import General from 'containers/Preferences/General';
import Users from 'containers/Preferences/Users';
import Accountant from 'containers/Preferences/Accountant';
import Accounts from 'containers/Preferences/Accounts';
import CurrenciesList from 'containers/Preferences/CurrenciesList'

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
    path: `${BASE_URL}/currencies`,
    component: CurrenciesList,
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
