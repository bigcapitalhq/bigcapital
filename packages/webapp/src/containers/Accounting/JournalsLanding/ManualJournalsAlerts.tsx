import React, { ComponentType, LazyExoticComponent } from 'react';

const JournalDeleteAlert = React.lazy(() =>
  import('@/containers/Alerts/ManualJournals/JournalDeleteAlert').then((m) => ({
    default: m.JournalDeleteAlert,
  })),
);
const JournalPublishAlert = React.lazy(() =>
  import('@/containers/Alerts/ManualJournals/JournalPublishAlert').then(
    (m) => ({ default: m.JournalPublishAlert }),
  ),
);

interface AlertItem {
  name: string;
  component: LazyExoticComponent<ComponentType<unknown>>;
}

/**
 * Manual journals alerts.
 */
export const ManualJournalsAlerts: AlertItem[] = [
  { name: 'journal-delete', component: JournalDeleteAlert },
  { name: 'journal-publish', component: JournalPublishAlert },
];
