import * as FF from 'fp-ts/function';
import React from 'react';
import type { WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const CreditNoteCustomizeDrawerBody = React.lazy(() =>
  import('./CreditNoteCustomizeDrawerBody').then((m) => ({
    default: m.CreditNoteCustomizeDrawerBody,
  })),
);

interface CreditNoteCustomizeDrawerRootProps {
  name: string;
}

type CreditNoteCustomizeDrawerRootConnectedProps =
  CreditNoteCustomizeDrawerRootProps & WithDrawersProps;

/**
 * Invoice customize drawer.
 * @returns {React.ReactNode}
 */
function CreditNoteCustomizeDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload,
}: CreditNoteCustomizeDrawerRootConnectedProps) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      payload={payload}
      size={'calc(100% - 10px)'}
    >
      <DrawerSuspense>
        <CreditNoteCustomizeDrawerBody />
      </DrawerSuspense>
    </Drawer>
  );
}

export const CreditNoteCustomizeDrawer = FF.pipe(
  CreditNoteCustomizeDrawerRoot,
  withDrawers(),
);
