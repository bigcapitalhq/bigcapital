// @ts-nocheck
import React from 'react';
import * as R from 'ramda';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

const CreditNoteCustomizeDrawerBody = React.lazy(
  () => import('./CreditNoteCustomizeDrawerBody'),
);

/**
 * Invoice customize drawer.
 * @returns {React.ReactNode}
 */
function CreditNoteCustomizeDrawerRoot({
  name,
  // #withDrawer
  isOpen,
  payload,
}) {
  return (
    <Drawer isOpen={isOpen} name={name} payload={payload} size={'100%'}>
      <DrawerSuspense>
        <CreditNoteCustomizeDrawerBody />
      </DrawerSuspense>
    </Drawer>
  );
}

export const CreditNoteCustomizeDrawer = R.compose(withDrawers())(
  CreditNoteCustomizeDrawerRoot,
);
