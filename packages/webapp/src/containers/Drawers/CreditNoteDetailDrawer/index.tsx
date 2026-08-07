import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers, WithDrawersProps } from '@/containers/Drawer/withDrawers';
import { compose } from '@/utils';

const CreditNoteDetailDrawerContent = React.lazy(() =>
  import('./CreditNoteDetailDrawerContent').then((m) => ({
    default: m.CreditNoteDetailDrawerContent,
  })),
);

interface CreditNoteDetailDrawerProps extends WithDrawersProps {
  name: string;
}

/**
 * Credit note detail drawer.
 */
function CreditNoteDetailDrawer({
  name,
  // #withDrawer
  isOpen,
  payload,
}: CreditNoteDetailDrawerProps) {
  const creditNoteId = payload?.creditNoteId as number | undefined;

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

export const index = compose(withDrawers())(CreditNoteDetailDrawer);
