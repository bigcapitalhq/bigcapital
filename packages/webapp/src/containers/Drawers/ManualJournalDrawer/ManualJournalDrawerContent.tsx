import React from 'react';

import '@/style/components/Drawers/ManualJournalDrawer.scss';

import { ManualJournalDrawerDetails } from './ManualJournalDrawerDetails';
import { ManualJournalDrawerProvider } from './ManualJournalDrawerProvider';
import { DrawerBody } from '@/components';

interface ManualJournalDrawerContentProps {
  manualJournalId: number | undefined;
}

/**
 * Manual Journal drawer content.
 */
export function ManualJournalDrawerContent({
  // #ownProp
  manualJournalId,
}: ManualJournalDrawerContentProps) {
  return (
    <ManualJournalDrawerProvider manualJournalId={manualJournalId}>
      <DrawerBody>
        <ManualJournalDrawerDetails />
      </DrawerBody>
    </ManualJournalDrawerProvider>
  );
}
