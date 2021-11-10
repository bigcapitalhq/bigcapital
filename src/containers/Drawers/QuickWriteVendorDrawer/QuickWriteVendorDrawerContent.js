import React from 'react';
import {
  DrawerHeaderContent,
  DrawerBody,
  FormattedMessage as T,
} from 'components';

import QuickVendorFormDrawer from './QuickVendorFormDrawer';

/**
 * Quick create/edit vendor drawer.
 */
export default function QuickWriteVendorDrawerContent({ displayName }) {
  return (
    <React.Fragment>
      <DrawerHeaderContent
        name="quick-create-customer"
        title={"Create a new vendor"}
      />
      <DrawerBody>
        <QuickVendorFormDrawer displayName={displayName} />
      </DrawerBody>
    </React.Fragment>
  );
}
