import React from 'react';
import MakeJournalEntriesForm from './MakeJournalEntriesForm';
import DashboardConnect from 'connectors/Dashboard.connector';
import {compose} from 'utils';

function MakeJournalEntriesPage() {
  return (
    <MakeJournalEntriesForm />
  );
}

export default compose(
  DashboardConnect,
)(MakeJournalEntriesPage);