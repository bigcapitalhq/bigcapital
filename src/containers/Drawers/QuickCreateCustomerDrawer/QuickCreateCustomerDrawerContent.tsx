// @ts-nocheck
import React from 'react';
import {
  DrawerHeaderContent,
  DrawerBody,
  FormattedMessage as T,
} from '@/components';

import QuickCustomerFormDrawer from './QuickCustomerFormDrawer';

/**
 * Quick create/edit customer drawer.
 */
export default function QuickCreateCustomerDrawerContent({ displayName }) {
  return (
    <React.Fragment>
      <DrawerHeaderContent
        name="quick-create-customer"
        title={<T id={'create_a_new_customer'} />}
      />
      <DrawerBody>
        <QuickCustomerFormDrawer displayName={displayName} />
      </DrawerBody>
    </React.Fragment>
  );
}
