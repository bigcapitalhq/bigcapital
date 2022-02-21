import React from 'react';
import { useParams } from 'react-router-dom';

import 'style/pages/ManualJournal/MakeJournal.scss';

import MakeJournalEntriesForm from './MakeJournalEntriesForm';
import { MakeJournalProvider } from './MakeJournalProvider';

import withCurrentOrganization from 'containers/Organization/withCurrentOrganization';
import { compose } from 'utils';

/**
 * Make journal entries page.
 */
function MakeJournalEntriesPage({
  // #withCurrentOrganization
  organization: { base_currency },
}) {
  const { id: journalId } = useParams();

  return (
    <MakeJournalProvider journalId={journalId} baseCurrency={base_currency}>
      <MakeJournalEntriesForm />
    </MakeJournalProvider>
  );
}
export default compose(withCurrentOrganization())(MakeJournalEntriesPage);
