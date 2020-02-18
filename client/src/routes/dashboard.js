import Homepage from "containers/Dashboard/Homepage";
import AccountsChart from 'containers/Dashboard/Accounts/AccountsChart';

export default [
  {
    path: '/dashboard/homepage',
    component: Homepage,
    exact: true,
  },
  {
    path: '/dashboard/accounts',
    component: AccountsChart,
    icon: 'cut',
    text: 'Chart of Accounts',
    label: 'Chart of Accounts'
  },
];