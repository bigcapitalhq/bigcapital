import React from 'react';

const EasySMSDisconnectAlert = React.lazy(() =>
  import('../../Alerts/EasySMSIntegration/EasySMSDisconnectAlert'),
);

export default [
  {
    name: 'easysms-disconnect',
    component: EasySMSDisconnectAlert,
  },
];
