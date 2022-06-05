import React from 'react';

const JournalDeleteAlert = React.lazy(() =>
  import('../../Alerts/ManualJournals/JournalDeleteAlert'),
);
const JournalPublishAlert = React.lazy(() =>
  import('../../Alerts/ManualJournals/JournalPublishAlert'),
);

/**
 * Manual journals alerts.
 */

export default [
  { name: 'journal-delete', component: JournalDeleteAlert },
  { name: 'journal-publish', component: JournalPublishAlert },
];
