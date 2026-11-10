import * as FF from 'fp-ts/function';
import React from 'react';
import type { RecurringJournalDetailTabId } from './types';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';

const RecurringJournalDetailDrawerContent = React.lazy(() =>
  import('./RecurringJournalDetailDrawerContent').then((m) => ({
    default: m.RecurringJournalDetailDrawerContent,
  })),
);

interface RecurringJournalDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Recurring journal detail drawer.
 */
function RecurringJournalDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: RecurringJournalDetailDrawerProps) {
  const recurringJournalId = payload?.recurringJournalId as number | undefined;
  const defaultTab = payload?.tab as RecurringJournalDetailTabId | undefined;

  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '1000px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <RecurringJournalDetailDrawerContent
          recurringJournalId={recurringJournalId}
          defaultTab={defaultTab}
          isOpen={isOpen}
        />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = FF.pipe(RecurringJournalDetailDrawer, withDrawers());
