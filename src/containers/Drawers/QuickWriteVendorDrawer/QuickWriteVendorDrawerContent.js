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
        title={<T id={'create_a_new_vendor'} />}

      />
      <DrawerBody>
        <QuickVendorFormDrawer displayName={displayName} />
      </DrawerBody>
    </React.Fragment>
  );
}
