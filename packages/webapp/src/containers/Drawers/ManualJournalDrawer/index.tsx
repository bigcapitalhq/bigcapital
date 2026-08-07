import React, { lazy } from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const ManualJournalDrawerContent = lazy(() =>
  import('./ManualJournalDrawerContent').then((m) => ({
    default: m.ManualJournalDrawerContent,
  })),
);

interface ManualJournalDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Manual journal drawer.
 */
function ManualJournalDrawer({
  name,

  // #withDrawer
  isOpen,
  payload,
}: ManualJournalDrawerProps) {
  const manualJournalId = payload?.manualJournalId as number | undefined;

  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      size={'65%'}
      style={{ minWidth: '700px', maxWidth: '900px' }}
    >
      <DrawerSuspense>
        <ManualJournalDrawerContent manualJournalId={manualJournalId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = compose(withDrawers())(ManualJournalDrawer);
