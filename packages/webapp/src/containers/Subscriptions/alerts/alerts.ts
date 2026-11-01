import React from 'react';

const CancelMainSubscriptionAlert = React.lazy(() =>
  import('./CancelMainSubscriptionAlert').then((m) => ({
    default: m.CancelMainSubscriptionAlert,
  })),
);
const ResumeMainSubscriptionAlert = React.lazy(() =>
  import('./ResumeMainSubscriptionAlert').then((m) => ({
    default: m.ResumeMainSubscriptionAlert,
  })),
);

/**
 * Subscription alert.
 */
export const SubscriptionAlerts = [
  {
    name: 'cancel-main-subscription',
    component: CancelMainSubscriptionAlert,
  },
  {
    name: 'resume-main-subscription',
    component: ResumeMainSubscriptionAlert,
  },
];
