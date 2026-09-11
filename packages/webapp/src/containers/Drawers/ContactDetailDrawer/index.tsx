// @ts-nocheck
import * as FF from 'fp-ts/function';
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import { withDrawers } from '@/containers/Drawer/withDrawers';

const ContactDetailDrawerContent = React.lazy(() =>
  import('./ContactDetailDrawerContent').then((m) => ({
    default: m.ContactDetailDrawerContent,
  })),
);

/**
 * Contact detail drawer.
 */
function ContactDetailDrawer({
  name,

  // #withDrawer
  isOpen,
  payload: { contactId },
}) {
  return (
    <Drawer isOpen={isOpen} name={name} size={'750px'}>
      <DrawerSuspense>
        <ContactDetailDrawerContent contact={contactId} />
      </DrawerSuspense>
    </Drawer>
  );
}

export const index = FF.pipe(ContactDetailDrawer, withDrawers());
