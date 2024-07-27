// @ts-nocheck
import React from 'react';

const CancelMainSubscriptionAlert = React.lazy(
  () => import('./CancelMainSubscriptionAlert'),
);
const ResumeMainSubscriptionAlert = React.lazy(
  () => import('./ResumeMainSubscriptionAlert'),
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
