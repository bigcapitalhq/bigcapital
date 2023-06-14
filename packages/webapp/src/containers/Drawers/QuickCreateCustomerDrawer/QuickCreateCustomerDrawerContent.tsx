// @ts-nocheck
import React from 'react';
import {
  DrawerHeaderContent,
  DrawerBody,
  FormattedMessage as T,
} from '@/components';

import QuickCustomerFormDrawer from './QuickCustomerFormDrawer';
import { DRAWERS } from '@/constants/drawers';

/**
 * Quick create/edit customer drawer.
 */
export default function QuickCreateCustomerDrawerContent({ displayName }) {
  return (
    <React.Fragment>
      <DrawerHeaderContent
        name={DRAWERS.QUICK_CREATE_CUSTOMER}
        title={<T id={'create_a_new_customer'} />}
      />
      <DrawerBody>
        <QuickCustomerFormDrawer displayName={displayName} />
      </DrawerBody>
    </React.Fragment>
  );
}
