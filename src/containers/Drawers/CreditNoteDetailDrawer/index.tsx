// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

import { compose } from '@/utils';

const CreditNoteDetailDrawerContent = React.lazy(() =>
  import('./CreditNoteDetailDrawerContent'),
);

/**
 * Credit note detail drawer.
 */
function CreditNoteDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload: { creditNoteId },
}) {
  return (
    <Drawer
      isOpen={isOpen}
      name={name}
      style={{ minWidth: '700px', maxWidth: '900px' }}
      size={'65%'}
    >
      <DrawerSuspense>
        <CreditNoteDetailDrawerContent creditNoteId={creditNoteId} />
      </DrawerSuspense>
    </Drawer>
  );
}
export default compose(withDrawers())(CreditNoteDetailDrawer);
