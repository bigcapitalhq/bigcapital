// @ts-nocheck
import React from 'react';
import { Drawer, DrawerSuspense } from '@/components';
import withDrawers from '@/containers/Drawer/withDrawers';

import { compose } from '@/utils';

const ContactDetailDrawerContent = React.lazy(() =>
  import('./ContactDetailDrawerContent'),
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

export default compose(withDrawers())(ContactDetailDrawer);
