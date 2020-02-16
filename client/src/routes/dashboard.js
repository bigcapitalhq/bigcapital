import Homepage from "containers/Dashboard/Homepage";

// import AccountsChart from 'pages/Dashboard/AccountsChart';

export default [
  {
    path: '/homepage',
    component: Homepage,
    exact: true,
  },
  // {
  //   path: '/accounts/list',
  //   component: AccountsChart,
  //   icon: 'cut',
  //   text: 'Chart of Accounts',
  //   label: 'Chart of Accounts'
  // },
];