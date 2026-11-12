import * as FF from 'fp-ts/function';
import React from 'react';
import type { RecurringInvoiceDetailTabId } from './types';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';

const RecurringInvoiceDetailDrawerContent = React.lazy(() =>
  import('./RecurringInvoiceDetailDrawerContent').then((m) => ({
    default: m.RecurringInvoiceDetailDrawerContent,
  })),
);

interface RecurringInvoiceDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Recurring invoice detail drawer.
 */
function RecurringInvoiceDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: RecurringInvoiceDetailDrawerProps) {
  const recurringInvoiceId = payload?.recurringInvoiceId as number | undefined;
  const defaultTab = payload?.tab as RecurringInvoiceDetailTabId | undefined;

  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '1000px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <RecurringInvoiceDetailDrawerContent
          recurringInvoiceId={recurringInvoiceId}
          defaultTab={defaultTab}
          isOpen={isOpen}
        />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = FF.pipe(RecurringInvoiceDetailDrawer, withDrawers());
