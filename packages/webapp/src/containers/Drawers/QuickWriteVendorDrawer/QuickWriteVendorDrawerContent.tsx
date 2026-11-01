import React from 'react';
import { QuickVendorFormDrawer } from './QuickVendorFormDrawer';
import {
  DrawerHeaderContent,
  DrawerBody,
  FormattedMessage as T,
} from '@/components';
import { DRAWERS } from '@/constants/drawers';

interface QuickWriteVendorDrawerContentProps {
  displayName?: string;
  autofillRef?: number;
}

/**
 * Quick create/edit vendor drawer.
 */
export function QuickWriteVendorDrawerContent({
  displayName,
  autofillRef,
}: QuickWriteVendorDrawerContentProps) {
  return (
    <React.Fragment>
      <DrawerHeaderContent
        name={DRAWERS.QUICK_CREATE_CUSTOMER}
        title={<T id={'create_a_new_vendor'} />}
      />
      <DrawerBody>
        <QuickVendorFormDrawer
          displayName={displayName}
          autofillRef={autofillRef}
        />
      </DrawerBody>
    </React.Fragment>
  );
}
