import General from 'containers/Preferences/General/General';
import Users from '../containers/Preferences/Users/Users';
import Roles from '../containers/Preferences/Users/Roles/RolesForm/RolesFormPage';
import Accountant from 'containers/Preferences/Accountant/Accountant';
// import Accounts from 'containers/Preferences/Accounts/Accounts';
import Currencies from 'containers/Preferences/Currencies/Currencies';
import Item from 'containers/Preferences/Item';
import SMSIntegration from '../containers/Preferences/SMSIntegration';
import DefaultRoute from '../containers/Preferences/DefaultRoute';

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
    path: `${BASE_URL}/roles`,
    component: Roles,
    exact: true,
  },
  {
    path: `${BASE_URL}/roles/:id`,
    component: Roles,
    exact: true,
  },
  {
    path: `${BASE_URL}/currencies`,
    component: Currencies,
    exact: true,
  },
  {
    path: `${BASE_URL}/accountant`,
    component: Accountant,
    exact: true,
  },
  {
    path: `${BASE_URL}/items`,
    component: Item,
    exact: true,
  },
  {
    path: `${BASE_URL}/sms-message`,
    component: SMSIntegration,
    exact: true,
  },
  {
    path: `${BASE_URL}/`,
    component: DefaultRoute,
    exact: true,
  },
];
