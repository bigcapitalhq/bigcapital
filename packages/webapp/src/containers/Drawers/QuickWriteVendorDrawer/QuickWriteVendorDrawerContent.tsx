// @ts-nocheck
import React from 'react';
import {
  DrawerHeaderContent,
  DrawerBody,
  FormattedMessage as T,
} from '@/components';

import QuickVendorFormDrawer from './QuickVendorFormDrawer';
import { DRAWERS } from '@/constants/drawers';

/**
 * Quick create/edit vendor drawer.
 */
export default function QuickWriteVendorDrawerContent({ displayName }) {
  return (
    <React.Fragment>
      <DrawerHeaderContent
        name={DRAWERS.QUICK_CREATE_CUSTOMER}
        title={<T id={'create_a_new_vendor'} />}

      />
      <DrawerBody>
        <QuickVendorFormDrawer displayName={displayName} />
      </DrawerBody>
    </React.Fragment>
  );
}
