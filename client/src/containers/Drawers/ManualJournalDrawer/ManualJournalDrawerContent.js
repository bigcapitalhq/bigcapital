import React from 'react';

import { DrawerBody } from 'components';

import 'style/components/Drawers/ViewDetails.scss';

import { ManualJournalDrawerProvider } from './ManualJournalDrawerProvider';
import ManualJournalDrawerDetails from './ManualJournalDrawerDetails';

/**
 * Manual Journal drawer content.
 */
export default function ManualJournalDrawerContent({
  // #ownProp
  manualJournalId,
}) {
  return (
    <ManualJournalDrawerProvider manualJournalId={manualJournalId}>
      <DrawerBody>
        <ManualJournalDrawerDetails />
      </DrawerBody>
    </ManualJournalDrawerProvider>
  );
}
