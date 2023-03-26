// @ts-nocheck
import React from 'react';

import '@/style/components/Drawers/ManualJournalDrawer.scss';

import { DrawerBody } from '@/components';
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
