// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const CashFlowTransactionDrawerContent = React.lazy(() =>
  import('./CashflowTransactionDrawerContent').then((m) => ({
    default: m.CashflowTransactionDrawerContent,
  })),
);

/**
 * Cash flow transaction drawer
 */
function CashflowTransactionDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { referenceId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      size={'65%'}
      style={{ minWidth: '700px', maxWidth: '900px' }}
    >
      <DrawerSuspense>
        <CashFlowTransactionDrawerContent referenceId={referenceId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = compose(withDrawers())(CashflowTransactionDetailDrawer);
