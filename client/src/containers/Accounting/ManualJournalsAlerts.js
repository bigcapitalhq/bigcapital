import React from 'react';
import JournalDeleteAlert from 'containers/Alerts/ManualJournals/JournalDeleteAlert';
import JournalPublishAlert from 'containers/Alerts/ManualJournals/JournalPublishAlert';

/**
 * Manual journals alerts.
 */
export default function ManualJournalsAlerts() {
  return (
    <div>
      <JournalDeleteAlert name={'journal-delete'} />
      <JournalPublishAlert name={'journal-publish'} />
    </div>
  )
}