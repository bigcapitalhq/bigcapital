// @ts-nocheck
import React from 'react';

const ResumeFeedsBankAccountAlert = React.lazy(
  () => import('./ResumeFeedsBankAccount'),
);

const PauseFeedsBankAccountAlert = React.lazy(
  () => import('./PauseFeedsBankAccount'),
);

const UncategorizeTransactionsBulkAlert = React.lazy(
  () => import('./UncategorizeBankTransactionsBulkAlert'),
);

/**
 * Bank account alerts.
 */
export const BankAccountAlerts = [
  {
    name: 'resume-feeds-syncing-bank-accounnt',
    component: ResumeFeedsBankAccountAlert,
  },
  {
    name: 'pause-feeds-syncing-bank-accounnt',
    component: PauseFeedsBankAccountAlert,
  },
  {
    name: 'uncategorize-transactions-bulk',
    component: UncategorizeTransactionsBulkAlert,
  },
];
