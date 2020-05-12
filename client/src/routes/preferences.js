import General from 'containers/Preferences/General/General';
import Users from 'containers/Preferences/Users/Users';
import Accountant from 'containers/Preferences/Accountant/Accountant';
import Accounts from 'containers/Preferences/Accounts/Accounts';
import CurrenciesList from 'containers/Preferences/Currencies/CurrenciesList'

const BASE_URL = '/preferences';

export default [
  {
    path: `${BASE_URL}/general`,
    component: General,
    exact: true,
  },
  {
    path: `${BASE_URL}/users`,
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
    component: Accountant,
    exact: true,
  },
  {
    path: `${BASE_URL}/accounts`,
    component: Accounts,
  },
];
