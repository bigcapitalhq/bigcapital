import React from 'react';
import { QuickCustomerFormDrawer } from './QuickCustomerFormDrawer';
import {
  DrawerHeaderContent,
  DrawerBody,
  FormattedMessage as T,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';

interface QuickCreateCustomerDrawerContentProps {
  displayName?: string;
  autofillRef?: number;
}

/**
 * Quick create/edit customer drawer.
 */
export function QuickCreateCustomerDrawerContent({
  displayName,
  autofillRef,
}: QuickCreateCustomerDrawerContentProps) {
  return (
    <React.Fragment>
      <DrawerHeaderContent
        name={DRAWERS.QUICK_CREATE_CUSTOMER}
        title={<T id={'create_a_new_customer'} />}
      />
      <DrawerBody>
        <QuickCustomerFormDrawer
          displayName={displayName}
          autofillRef={autofillRef}
        />
      </DrawerBody>
    </React.Fragment>
  );
}
